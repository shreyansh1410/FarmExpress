const express = require('express');
const scheduleDeliveryRouter = express.Router();
const { companyAuth } = require('../middlewares/auth');
const Truck = require('../models/truck'); 
const Route = require('../models/route'); 
const { normalizeLicensePlate, isValidIndianHsrp } = require('../utils/validation');
const MATERIAL_TYPES = [
    "Building Materials",
    "Automotive Parts and Vehicles",
    "Fresh Produce",
    "Food and Grocery Products",
    "Pharmaceutical and Medical Supplies",
    "Industrial Machinery and Equipment",
    "Chemicals (Non-Hazardous)",
    "Textiles and Apparel",
    "Electronics and Consumer Durables",
    "General Merchandise",
    "Other"
];

scheduleDeliveryRouter.post('/scheduleDelivery/addtruck', companyAuth, async (req, res) => {
    try {
        const { licensePlate, totalCapacity, materialType } = req.body;
        const normalizedLicensePlate = normalizeLicensePlate(licensePlate);
        const numericCapacity = Number(totalCapacity);
        const normalizedMaterialType = materialType?.toString().trim();

        const companyId = req.company._id; 

        if (!normalizedLicensePlate || !numericCapacity) {
            return res.status(400).send("License plate and total capacity are required.");
        }
        if (numericCapacity <= 0) {
            return res.status(400).send("Total capacity must be greater than 0.");
        }
        if (!isValidIndianHsrp(normalizedLicensePlate)) {
            return res.status(400).send("License plate must follow Indian HSRP format (e.g. UP11AA1111, DL1CX9999).");
        }
        if (!normalizedMaterialType || !MATERIAL_TYPES.includes(normalizedMaterialType)) {
            return res.status(400).send("Please select a valid material type.");
        }

        const newTruck = new Truck({
            licensePlate: normalizedLicensePlate,
            companyId,
            totalCapacity: numericCapacity,
            materialType: normalizedMaterialType,
            currentLoad: [],
            remainingLoad: [],
        });

        await newTruck.save();

        res.status(201).json({ message: "Truck added successfully", data: newTruck });
    } catch (err) {
        console.error(err.stack);
        res.status(400).send("Error adding truck: " + err.message);
    }
});

scheduleDeliveryRouter.get('/scheduleDelivery/trucks', companyAuth, async (req, res) => {
    try {
        const companyId = req.company._id;
        const trucks = await Truck.find(
            { companyId },
            { _id: 1, licensePlate: 1, totalCapacity: 1, materialType: 1 }
        ).sort({ _id: -1 });
        res.json({ trucks });
    } catch (err) {
        console.error(err.stack);
        res.status(400).send("Error fetching trucks: " + err.message);
    }
});

scheduleDeliveryRouter.patch('/scheduleDelivery/truck/:truckId', companyAuth, async (req, res) => {
    try {
        const { truckId } = req.params;
        const { licensePlate, totalCapacity, materialType } = req.body;
        const companyId = req.company._id;

        const normalizedLicensePlate = normalizeLicensePlate(licensePlate);
        const numericCapacity = Number(totalCapacity);
        const normalizedMaterialType = materialType?.toString().trim();

        if (!normalizedLicensePlate || !numericCapacity || !normalizedMaterialType) {
            return res.status(400).send("License plate, total capacity and material type are required.");
        }
        if (!isValidIndianHsrp(normalizedLicensePlate)) {
            return res.status(400).send("License plate must follow Indian HSRP format (e.g. UP11AA1111, DL1CX9999).");
        }
        if (numericCapacity <= 0) {
            return res.status(400).send("Total capacity must be greater than 0.");
        }
        if (!MATERIAL_TYPES.includes(normalizedMaterialType)) {
            return res.status(400).send("Please select a valid material type.");
        }

        const truck = await Truck.findOne({ _id: truckId, companyId });
        if (!truck) {
            return res.status(404).send("Truck not found or does not belong to the company.");
        }

        const hasOverloadedStop = Array.isArray(truck.currentLoad)
            && truck.currentLoad.some((load) => Number(load) > numericCapacity);
        if (hasOverloadedStop) {
            return res.status(400).send("New total capacity cannot be less than an existing stop load.");
        }

        truck.licensePlate = normalizedLicensePlate;
        truck.totalCapacity = numericCapacity;
        truck.materialType = normalizedMaterialType;
        if (Array.isArray(truck.currentLoad)) {
            truck.remainingLoad = truck.currentLoad.map((load) => numericCapacity - Number(load));
        } else {
            truck.remainingLoad = [];
        }
        await truck.save();

        await Route.updateMany(
            { truckId: truck._id },
            { $set: { materialType: normalizedMaterialType } }
        );

        res.json({
            message: "Truck updated successfully.",
            data: {
                _id: truck._id,
                licensePlate: truck.licensePlate,
                totalCapacity: truck.totalCapacity,
                materialType: truck.materialType
            }
        });
    } catch (err) {
        console.error(err.stack);
        res.status(400).send("Error updating truck: " + err.message);
    }
});

scheduleDeliveryRouter.get('/scheduleDelivery/routes', companyAuth, async (req, res) => {
    try {
        const companyId = req.company._id;
        const routes = await Route.find({})
            .populate({
                path: 'truckId',
                match: { companyId },
                select: 'licensePlate totalCapacity materialType companyId'
            })
            .sort({ updatedAt: -1, _id: -1 });

        const companyRoutes = routes
            .filter((routeDoc) => routeDoc.truckId)
            .map((routeDoc) => ({
                _id: routeDoc._id,
                truckId: routeDoc.truckId?._id,
                truckLicensePlate: routeDoc.truckId?.licensePlate,
                truckTotalCapacity: routeDoc.truckId?.totalCapacity,
                source: routeDoc.source,
                destination: routeDoc.destination,
                materialType: routeDoc.materialType,
                stops: Array.isArray(routeDoc.stops) ? routeDoc.stops : [],
                stopLoads: Array.isArray(routeDoc.stopLoads) ? routeDoc.stopLoads : [],
                updatedAt: routeDoc.updatedAt
            }));

        res.json({ routes: companyRoutes });
    } catch (err) {
        console.error(err.stack);
        res.status(400).send("Error fetching routes: " + err.message);
    }
});

scheduleDeliveryRouter.delete('/scheduleDelivery/truck/:truckId', companyAuth, async (req, res) => {
    try {
        const { truckId } = req.params;
        const companyId = req.company._id;

        const truck = await Truck.findOne({ _id: truckId, companyId });
        if (!truck) {
            return res.status(404).send("Truck not found or does not belong to the company.");
        }

        const deletedRoutesResult = await Route.deleteMany({ truckId: truck._id });
        await Truck.deleteOne({ _id: truck._id });

        return res.json({
            message: "Truck removed successfully. Associated routes were also deleted.",
            data: {
                deletedTruckId: truck._id,
                deletedRouteCount: deletedRoutesResult.deletedCount || 0
            }
        });
    } catch (err) {
        console.error(err.stack);
        res.status(400).send("Error deleting truck: " + err.message);
    }
});

scheduleDeliveryRouter.post('/scheduleDelivery/addroute', companyAuth, async (req, res) => {
    try {
        const { truckId, licensePlate, source, destination, stops, stopLoads, materialType } = req.body;
        const normalizedLicensePlate = normalizeLicensePlate(licensePlate || "");
        const normalizedSource = (source || "").trim();
        const normalizedDestination = (destination || "").trim();
        const normalizedMaterialType = materialType?.toString().trim();
        const normalizedStops = Array.isArray(stops)
            ? stops.map((stop) => String(stop || "").trim()).filter(Boolean)
            : [];
        const normalizedLoads = Array.isArray(stopLoads)
            ? stopLoads.map((load) => Number(load))
            : [];
        const companyId = req.company._id;

        if (!truckId && !normalizedLicensePlate) {
            return res.status(400).send("truckId or licensePlate is required.");
        }
        if (normalizedLicensePlate && !isValidIndianHsrp(normalizedLicensePlate)) {
            return res.status(400).send("License plate must follow Indian HSRP format (e.g. UP11AA1111, DL1CX9696).");
        }

        let truck = null;
        if (truckId) {
            truck = await Truck.findOne({ _id: truckId, companyId });
        } else {
            truck = await Truck.findOne({ licensePlate: normalizedLicensePlate, companyId });
        }
        if (!truck) {
            return res.status(404).send("Truck not found or does not belong to the company.");
        }
        const resolvedMaterialType = normalizedMaterialType || truck.materialType;
        if (!resolvedMaterialType || !MATERIAL_TYPES.includes(resolvedMaterialType)) {
            return res.status(400).send("Please select a valid material type.");
        }

        if (!normalizedSource || !normalizedDestination) {
            return res.status(400).send("Source and destination are required.");
        }
        if (normalizedStops.length < 1) {
            return res.status(400).send("At least one stop entry is required (destination).");
        }
        if (normalizedStops.length !== normalizedLoads.length) {
            return res.status(400).send("Each stop must include a corresponding stop load.");
        }
        if (normalizedLoads.some((load) => Number.isNaN(load) || load < 0)) {
            return res.status(400).send("Stop loads must be valid non-negative numbers.");
        }
        if (normalizedLoads.some((load) => load > truck.totalCapacity)) {
            return res.status(400).send("Stop load cannot exceed selected truck total capacity.");
        }

        const sourceLower = normalizedSource.toLowerCase();
        const destinationLower = normalizedDestination.toLowerCase();
        const cleanedStops = normalizedStops.filter(
            (stop) => stop.toLowerCase() !== sourceLower
        );
        if (cleanedStops.length === 0) {
            cleanedStops.push(normalizedDestination);
        }
        cleanedStops[cleanedStops.length - 1] = normalizedDestination;
        if (cleanedStops.some((stop, idx) => idx < cleanedStops.length - 1 && stop.toLowerCase() === destinationLower)) {
            return res.status(400).send("Destination should appear only as the final stop.");
        }
        if (cleanedStops.length !== normalizedLoads.length) {
            return res.status(400).send("Stop loads count must match stop count after source/destination normalization.");
        }

        const routePayload = {
            truckId: truck._id, 
            source: normalizedSource,
            destination: normalizedDestination,
            materialType: resolvedMaterialType,
            stops: cleanedStops,
            stopLoads: normalizedLoads
        };

        const savedRoute = await Route.findOneAndUpdate(
            { truckId: truck._id },
            routePayload,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        truck.currentLoad = normalizedLoads;
        truck.remainingLoad = normalizedLoads.map((load) => truck.totalCapacity - load);
        await truck.save();

        res.status(201).json({ message: "Route added successfully", data: savedRoute });
    } catch (err) {
        console.error(err.stack);
        res.status(400).send("Error adding route: " + err.message);
    }
});


scheduleDeliveryRouter.delete('/scheduleDelivery/deletescheduleDelivery/:id', companyAuth, async (req, res) => {
    try {
        const routeId = req.params.id;

        const companyId = req.company._id;

        const route = await Route.findById(routeId).populate('truckId');
        if (!route) {
            return res.status(404).send("Route not found.");
        }

        if (!route.truckId || !route.truckId.companyId) {
            return res.status(400).send("Invalid route or truck data.");
        }

        if (route.truckId.companyId.toString() !== companyId.toString()) {
            return res.status(403).send("You are not authorized to delete this route.");
        }

        await Route.findByIdAndDelete(routeId);
        await Truck.findByIdAndUpdate(route.truckId._id, {
            currentLoad: [],
            remainingLoad: []
        });

        res.send("Route deleted successfully: " + routeId);
    } catch (err) {
        console.error(err.stack); 
        res.status(400).send("Error deleting route: " + err.message);
    }
});

module.exports = scheduleDeliveryRouter;