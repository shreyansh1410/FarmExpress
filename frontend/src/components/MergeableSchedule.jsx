import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Truck, MapPin, Loader2, Sparkles } from "lucide-react";

const MergeableSchedule = () => {
  const [mergeablePairs, setMergeablePairs] = useState(null);
  const [mergeMessage, setMergeMessage] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyzeRoutes = async () => {
    setLoading(true);
    setAiSuggestions([]);
    setAiMessage("");
    setMergeablePairs(null);
    setMergeMessage("");

    try {
      const aiRes = await axios.post(
        `${BASE_URL}/ai/route-suggestion`,
        {},
        { withCredentials: true }
      );
      setAiSuggestions(aiRes.data.suggestions || []);
      if (aiRes.data.message) {
        setAiMessage(aiRes.data.message);
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setAiSuggestions([]);
      setAiMessage("Unable to fetch AI suggestions right now.");
    }

    try {
      const res = await axios.get(BASE_URL + "/mergeableSchedule", {
        withCredentials: true,
      });
      setMergeablePairs(res.data.mergeablePairs || []);
      setMergeMessage(res.data.message || "");
    } catch (err) {
      console.error("Error fetching mergeable pairs:", err);
      setMergeablePairs([]);
      setMergeMessage("Could not fetch mergeable routes right now.");
    } finally {
      setLoading(false);
    }
  };

  const decisionColor = (decision) => {
    if (decision === "merge") return "bg-emerald-600/20 text-emerald-300 border-emerald-500/30";
    if (decision === "avoid") return "bg-red-600/20 text-red-300 border-red-500/30";
    return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30";
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Route Optimization
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover efficient route combinations and optimize your delivery schedules
          </p>
        </div>

        <button 
          className={`
            w-full max-w-xl mx-auto bg-emerald-600 hover:bg-emerald-500 
            text-white font-semibold py-4 px-8 rounded-2xl shadow-lg 
            transition-all duration-200 flex items-center justify-center gap-3
            ${loading ? 'opacity-90 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}
          `}
          onClick={handleAnalyzeRoutes}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Truck className="w-5 h-5" />
          )}
          {loading ? 'Thinking with AI and analyzing routes...' : 'Find Mergeable Routes'}
        </button>

        {(aiSuggestions.length > 0 || aiMessage) && (
          <div className="mt-8 bg-base-200 border border-base-300 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-base-content text-xl font-semibold">AI Route Recommendations</h3>
            </div>

            {aiMessage && (
              <p className="text-base-content/80 mb-4">{aiMessage}</p>
            )}

            <div className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div
                  key={suggestion.pairId}
                  className="border border-base-300 rounded-2xl p-4 bg-base-100"
                >
                  <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
                    <p className="text-base-content font-medium">
                      {suggestion.truckOneLicensePlate} + {suggestion.truckTwoLicensePlate}
                    </p>
                    <span
                      className={`capitalize px-3 py-1 rounded-full border text-xs ${decisionColor(
                        suggestion.decision
                      )}`}
                    >
                      {suggestion.decision || "consider"}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">
                    Score: {suggestion.score} | Overlap: {Math.round((suggestion.overlapRatio || 0) * 100)}% |
                    Estimated Savings: {suggestion.savingsEstimate}
                  </p>
                  <p className="text-sm text-primary">{suggestion.aiRecommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mergeablePairs !== null && (
          <div className="mt-12 space-y-12">
            {mergeablePairs.length > 0 ? (
              mergeablePairs.map((pair, index) => (
                <div 
                  key={index} 
                  className="bg-base-200 rounded-3xl shadow-xl overflow-hidden border border-base-300"
                >
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">
                        Route Combination {index + 1}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8 p-8">
                    {[{
                      label: "Route A",
                      stops: pair.truckOneStops,
                      licensePlate: pair.truckOneLicensePlate,
                      currentLoad: pair.truckOneCurrentLoad || [],
                      remainingLoad: pair.truckOneRemainingLoad || [],
                      totalCapacity: pair.truckOneTotalCapacity
                    }, {
                      label: "Route B",
                      stops: pair.truckTwoStops,
                      licensePlate: pair.truckTwoLicensePlate,
                      currentLoad: pair.truckTwoCurrentLoad || [],
                      remainingLoad: pair.truckTwoRemainingLoad || [],
                      totalCapacity: pair.truckTwoTotalCapacity
                    }].map((truck, idx) => (
                      <div key={idx} className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex-shrink-0 w-12 h-12 bg-base-300 rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-base-content">
                              {truck.label}
                            </h4>
                            <p className="text-sm text-base-content/70">
                              Vehicle ID: {truck.licensePlate}
                            </p>
                            <p className="text-xs text-base-content/60">
                              Capacity: {truck.totalCapacity ?? "N/A"} kg
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8">
                          {truck.stops.map((stop, stopIndex) => (
                            <div 
                              key={stopIndex} 
                              className={`
                                relative mb-8 last:mb-0 
                                transition-all duration-300 ease-in-out
                                hover:translate-x-2
                              `}
                            >
                              <div className="absolute left-0 top-0 mt-2 -ml-8">
                                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {stopIndex + 1}
                                </div>
                              </div>
                              
                              <div className="bg-base-100 rounded-2xl p-4 shadow-sm border border-base-300">
                                <div className="flex items-start gap-3">
                                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                  <div>
                                    <p className="text-base-content">{stop}</p>
                                    <p className="text-xs text-base-content/70 mt-1">
                                      Load: {truck.currentLoad?.[stopIndex] ?? 0} kg | Remaining: {truck.remainingLoad?.[stopIndex] ?? 0} kg
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {stopIndex !== truck.stops.length - 1 && (
                                <div className="absolute left-[-14px] ml-[-1px] w-[2px] h-8 bg-emerald-600/30"
                                     style={{top: '2.5rem'}} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-8 pb-8 space-y-3">
                    <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-4">
                      <p className="text-emerald-300 font-medium">Suggested action</p>
                      <p className="text-base-content text-sm mt-1">
                        {pair.suggestion || "Merge Route B into Route A after validating stop order and load constraints."}
                      </p>
                    </div>
                    {Array.isArray(pair.loadChecks) && pair.loadChecks.length > 0 && (
                      <div className="bg-base-100 border border-base-300 rounded-xl p-4">
                        <p className="text-base-content font-medium mb-2">Capacity checks on overlapping stops</p>
                        <div className="space-y-2">
                          {pair.loadChecks.map((check, checkIndex) => (
                            <div key={`${check.stop}-${checkIndex}`} className="text-sm text-base-content/80 flex flex-wrap gap-2 items-center">
                              <span className="text-emerald-300">{check.stop}</span>
                              <span>Available: {check.availableCapacity} kg</span>
                              <span>Required: {check.requiredLoad} kg</span>
                              <span className={check.canCarry ? "text-emerald-300" : "text-red-300"}>
                                {check.canCarry ? "Pass" : "Fail"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-base-200 rounded-3xl shadow-md border border-base-300">
                <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8 text-base-content/60" />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No Mergeable Routes Found
                </h3>
                <p className="text-base-content/70 max-w-md mx-auto">
                  {mergeMessage || "Current routes are optimized or cannot be merged. Try analyzing different time slots or areas."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MergeableSchedule;