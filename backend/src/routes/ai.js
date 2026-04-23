const express = require("express");
const Route = require("../models/route");
const Truck = require("../models/truck");
const { companyAuth } = require("../middlewares/auth");
const {
  hasGeminiConfig,
  generateGeminiResponse,
  generateGeminiJson,
} = require("../utils/geminiClient");

const aiRouter = express.Router();

const scorePair = ({ truckOne, truckTwo, truckOneStops, truckTwoStops }) => {
  const stopSetOne = new Set(truckOneStops);
  const stopSetTwo = new Set(truckTwoStops);
  const commonStops = truckOneStops.filter((stop) => stopSetTwo.has(stop)).length;
  const combinedStops = new Set([...truckOneStops, ...truckTwoStops]).size;
  const overlapRatio = combinedStops === 0 ? 0 : commonStops / combinedStops;

  const biggerTruck =
    truckOne.totalCapacity >= truckTwo.totalCapacity ? truckOne : truckTwo;
  const smallerTruck = biggerTruck._id.toString() === truckOne._id.toString() ? truckTwo : truckOne;
  const biggerStops = biggerTruck._id.toString() === truckOne._id.toString() ? truckOneStops : truckTwoStops;
  const smallerStops =
    biggerTruck._id.toString() === truckOne._id.toString() ? truckTwoStops : truckOneStops;

  const isSubset = smallerStops.every((stop) => biggerStops.includes(stop));

  let capacityViolations = 0;
  smallerStops.forEach((stop) => {
    const biggerStopIndex = biggerStops.indexOf(stop);
    const smallerStopIndex = smallerStops.indexOf(stop);
    if (biggerStopIndex < 0 || smallerStopIndex < 0) return;

    const biggerRemaining = biggerTruck.remainingLoad?.[biggerStopIndex] ?? 0;
    const smallerLoad = smallerTruck.currentLoad?.[smallerStopIndex] ?? 0;
    if (biggerRemaining < smallerLoad) {
      capacityViolations += 1;
    }
  });

  const capacityFit = capacityViolations === 0 ? 1 : 0;
  const routeReduction = (truckOneStops.length + truckTwoStops.length - combinedStops) / 10;
  const subsetBonus = isSubset ? 0.2 : 0;
  const score = overlapRatio * 0.6 + capacityFit * 0.3 + routeReduction + subsetBonus;

  return {
    score: Number(score.toFixed(2)),
    overlapRatio: Number(overlapRatio.toFixed(2)),
    capacityFit: Boolean(capacityFit),
    isSubset,
    commonStops,
    combinedStops,
    savingsEstimate: `${Math.max(commonStops * 7, 5)}%`,
  };
};

const getCompanyRouteData = async (companyId) => {
  const trucks = await Truck.find({ companyId });
  if (!trucks.length) return [];

  const truckIds = trucks.map((truck) => truck._id);
  const routes = await Route.find({ truckId: { $in: truckIds } });
  const routeMap = new Map(routes.map((route) => [route.truckId.toString(), route]));

  return trucks
    .map((truck) => {
      const route = routeMap.get(truck._id.toString());
      if (!route || !route.stops?.length) return null;
      return {
        truck,
        route,
      };
    })
    .filter(Boolean);
};

aiRouter.post("/ai/route-suggestion", companyAuth, async (req, res) => {
  try {
    const companyId = req.company._id;
    const companyName = req.company.companyName || "this company";
    const routeData = await getCompanyRouteData(companyId);

    if (routeData.length < 2) {
      return res.status(200).json({
        suggestions: [],
        message: "Need at least two routes to generate suggestions.",
      });
    }

    const rawPairs = [];
    for (let i = 0; i < routeData.length; i++) {
      for (let j = i + 1; j < routeData.length; j++) {
        const first = routeData[i];
        const second = routeData[j];
        const scoring = scorePair({
          truckOne: first.truck,
          truckTwo: second.truck,
          truckOneStops: first.route.stops,
          truckTwoStops: second.route.stops,
        });

        rawPairs.push({
          pairId: `${first.truck._id}-${second.truck._id}`,
          truckOneId: first.truck._id,
          truckOneLicensePlate: first.truck.licensePlate,
          truckOneStops: first.route.stops,
          truckTwoId: second.truck._id,
          truckTwoLicensePlate: second.truck.licensePlate,
          truckTwoStops: second.route.stops,
          ...scoring,
        });
      }
    }

    const topCandidates = rawPairs
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (!hasGeminiConfig()) {
      return res.status(200).json({
        suggestions: topCandidates.map((candidate) => ({
          ...candidate,
          aiRecommendation:
            candidate.capacityFit && candidate.isSubset
              ? "Strong merge candidate with route overlap and sufficient spare capacity."
              : "Potential merge candidate. Verify stop order and available capacity before merging.",
        })),
        message: "Gemini key missing, showing heuristic suggestions only.",
      });
    }

    const aiInput = topCandidates.map((candidate) => ({
      pairId: candidate.pairId,
      truckOneLicensePlate: candidate.truckOneLicensePlate,
      truckTwoLicensePlate: candidate.truckTwoLicensePlate,
      truckOneStops: candidate.truckOneStops,
      truckTwoStops: candidate.truckTwoStops,
      overlapRatio: candidate.overlapRatio,
      capacityFit: candidate.capacityFit,
      score: candidate.score,
      savingsEstimate: candidate.savingsEstimate,
    }));

    const aiResult = await generateGeminiJson({
      systemPrompt:
        "You are a logistics optimization assistant. Reply strictly in JSON with this shape: {\"recommendations\":[{\"pairId\":\"string\",\"decision\":\"merge|consider|avoid\",\"reason\":\"string\"}]}. Keep each reason under 35 words.",
      userPrompt: `Company: ${companyName}. Evaluate these route merge candidates:\n${JSON.stringify(
        aiInput
      )}`,
    });

    const aiRecommendations = new Map(
      (aiResult.recommendations || []).map((item) => [item.pairId, item])
    );

    const suggestions = topCandidates.map((candidate) => {
      const recommendation = aiRecommendations.get(candidate.pairId);
      return {
        ...candidate,
        decision: recommendation?.decision || "consider",
        aiRecommendation:
          recommendation?.reason ||
          "Consider merge after validating stop sequence and truck load constraints.",
      };
    });

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("AI route suggestion error:", error);
    return res.status(502).json({
      error: "Failed to generate AI route suggestions.",
      details: "AI provider request failed. Please try again in a moment.",
    });
  }
});

aiRouter.post("/ai/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required." });
    }

    if (!hasGeminiConfig()) {
      return res.status(200).json({
        reply:
          "AI chat is not configured yet. Please add GEMINI_API_KEY in backend/.env and restart the server.",
      });
    }

    const compactHistory = Array.isArray(history)
      ? history.slice(-8).map((entry) => ({
          role: entry.role === "assistant" ? "assistant" : "user",
          text: String(entry.text || "").slice(0, 300),
        }))
      : [];

    const { cleanedText } = await generateGeminiResponse({
      systemPrompt:
        "You are the FarmXpress assistant. Help users with delivery scheduling, route merging, profile/login issues, and support queries. Keep answers concise, practical, and safe. If asked for private data or secrets, refuse and suggest contacting support.",
      userPrompt: `Conversation:\n${JSON.stringify(
        compactHistory
      )}\n\nUser message: ${message}`,
    });

    return res.status(200).json({
      reply:
        cleanedText ||
        "I could not generate a response right now. Please try again.",
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return res.status(502).json({
      error: "Failed to generate AI response.",
      details: "AI provider request failed. Please try again in a moment.",
    });
  }
});

module.exports = aiRouter;
