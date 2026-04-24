import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useLocation } from "react-router-dom";

const normalizeLicensePlate = (value = "") => value.toUpperCase().replace(/\s+/g, "");
const normalizeLocation = (value = "") => value.trim();
const MATERIAL_TYPE_OPTIONS = [
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
  "Other",
];

const AddRoute = () => {
  const location = useLocation();
  const [trucks, setTrucks] = useState([]);
  const [selectedTruckId, setSelectedTruckId] = useState(location.state?.truckId || "");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationLoad, setDestinationLoad] = useState("");
  const [materialType, setMaterialType] = useState("General Merchandise");
  const [stopRows, setStopRows] = useState([{ stopName: "", stopLoad: "" }]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const selectedTruck = useMemo(
    () => trucks.find((truck) => truck._id === selectedTruckId) || null,
    [trucks, selectedTruckId]
  );

  const fetchTrucks = async () => {
    try {
      const res = await axios.get(BASE_URL + "/scheduleDelivery/trucks", {
        withCredentials: true,
      });
      const companyTrucks = res.data?.trucks || [];
      setTrucks(companyTrucks);

      if (!selectedTruckId && companyTrucks.length > 0) {
        const preferredTruck = companyTrucks.find(
          (truck) =>
            truck.licensePlate ===
            normalizeLicensePlate(
              location.state?.licensePlate ||
                localStorage.getItem("lastAddedTruckLicensePlate") ||
                ""
            )
        );
        setSelectedTruckId(preferredTruck?._id || companyTrucks[0]._id);
      }
    } catch (err) {
      setError(err.response?.data || "Unable to fetch your trucks.");
    }
  };

  useEffect(() => {
    fetchTrucks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTruck?.materialType) {
      setMaterialType(selectedTruck.materialType);
    }
  }, [selectedTruck]);

  const addStop = () => {
    if (stopRows.length < 10) {
      setStopRows([...stopRows, { stopName: "", stopLoad: "" }]);
    }
  };

  const removeStop = (indexToRemove) => {
    if (stopRows.length === 1) {
      setStopRows([{ stopName: "", stopLoad: "" }]);
      return;
    }
    setStopRows(stopRows.filter((_, index) => index !== indexToRemove));
  };

  const updateStopRow = (index, key, value) => {
    const updatedRows = [...stopRows];
    updatedRows[index] = { ...updatedRows[index], [key]: value };
    setStopRows(updatedRows);
  };

  const handleAddRoute = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setInfoMessage("");

      if (!selectedTruckId) {
        setError("Please select a truck.");
        return;
      }
      const normalizedSource = normalizeLocation(source);
      const normalizedDestination = normalizeLocation(destination);
      if (!normalizedSource || !normalizedDestination) {
        setError("Source and destination are required.");
        return;
      }

      const hasIncompleteStop = stopRows.some(
        (row) => (normalizeLocation(row.stopName) && row.stopLoad === "") || (!normalizeLocation(row.stopName) && row.stopLoad !== "")
      );
      if (hasIncompleteStop) {
        setError("Each intermediate stop must include both stop name and stop load.");
        return;
      }
      if (destinationLoad === "") {
        setError("Destination load is required.");
        return;
      }

      const sourceLower = normalizedSource.toLowerCase();
      const destinationLower = normalizedDestination.toLowerCase();

      const intermediateStops = stopRows
        .map((row) => ({
          stopName: normalizeLocation(row.stopName),
          stopLoad: row.stopLoad,
        }))
        .filter((row) => row.stopName);

      const cleanedIntermediateStops = intermediateStops.filter(
        (row) =>
          row.stopName.toLowerCase() !== sourceLower &&
          row.stopName.toLowerCase() !== destinationLower
      );

      if (cleanedIntermediateStops.length !== intermediateStops.length) {
        setInfoMessage(
          "Intermediate stops matching source/destination were auto-removed."
        );
      }
      const normalizedStops = [
        ...cleanedIntermediateStops.map((row) => row.stopName),
        normalizedDestination,
      ];
      const normalizedStopLoads = [
        ...cleanedIntermediateStops.map((row) => Number(row.stopLoad)),
        Number(destinationLoad),
      ];

      if (normalizedStopLoads.some((load) => Number.isNaN(load) || load < 0)) {
        setError("Stop load must be a valid non-negative number.");
        return;
      }
      if (
        selectedTruck &&
        normalizedStopLoads.some((load) => load > selectedTruck.totalCapacity)
      ) {
        setError(
          `Stop load cannot exceed selected truck capacity (${selectedTruck.totalCapacity} kg).`
        );
        return;
      }

      const res = await axios.post(
        BASE_URL + "/scheduleDelivery/addroute",
        {
          truckId: selectedTruckId,
          source: normalizedSource,
          destination: normalizedDestination,
          materialType,
          stops: normalizedStops,
          stopLoads: normalizedStopLoads,
        },
        { withCredentials: true }
      );

      console.log("Route Added:", res.data);

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("Route added successfully!");
        setStopRows([{ stopName: "", stopLoad: "" }]);
        setDestinationLoad("");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div id="route" className="flex justify-center items-center min-h-screen p-10">
      <div className="p-8 rounded-lg shadow-lg w-[500px] bg-base-200 border border-base-300">
        <h1 className="text-center text-base-content text-2xl font-bold mb-6">Add Route</h1>

        {/* Truck selector */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-base-content">Select Truck</span>
          </div>
          <select
            value={selectedTruckId}
            onChange={(e) => setSelectedTruckId(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select one of your trucks</option>
            {trucks.map((truck) => (
              <option key={truck._id} value={truck._id}>
                {normalizeLicensePlate(truck.licensePlate)} - {truck.totalCapacity} kg
              </option>
            ))}
          </select>
          {selectedTruck && (
            <p className="text-xs text-base-content/70 mt-2">
              Selected: {normalizeLicensePlate(selectedTruck.licensePlate)} (
              {selectedTruck.totalCapacity} kg max capacity)
            </p>
          )}
        </label>

        <label className="form-control w-full mt-4">
          <div className="label">
            <span className="label-text text-base-content">Material Type</span>
          </div>
          <select
            className="select select-bordered w-full"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
          >
            {MATERIAL_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Stops Section */}
        <span className="label-text text-base-content mt-6 block">
          Add source separately, then intermediate stops and destination with loads
        </span>
        <label className="form-control w-full mt-3">
          <div className="label">
            <span className="label-text text-base-content">Source (not a stop)</span>
          </div>
          <input
            type="text"
            placeholder="Enter source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="input input-bordered w-full"
          />
        </label>
        <div className="mt-4 rounded-xl border border-base-300 bg-base-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-base-content">Intermediate Stops</p>
            <button
              onClick={addStop}
              disabled={stopRows.length >= 10}
              className="btn btn-sm btn-outline"
            >
              + Add Stop
            </button>
          </div>
          <div className="space-y-3">
            {stopRows.map((row, index) => (
              <div
                key={index}
                className="rounded-lg border border-base-300 bg-base-200 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-base-content/70">
                    Intermediate Stop {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="btn btn-ghost btn-xs text-error"
                    title="Remove stop"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Stop name"
                    value={row.stopName}
                    onChange={(e) => updateStopRow(index, "stopName", e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Load at stop (kg)"
                    value={row.stopLoad}
                    onChange={(e) => updateStopRow(index, "stopLoad", e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base-content">Destination</span>
            </div>
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base-content">Destination Load (kg)</span>
            </div>
            <input
              type="number"
              min="0"
              placeholder="Enter destination load"
              value={destinationLoad}
              onChange={(e) => setDestinationLoad(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button className="btn btn-success w-full mt-6" onClick={handleAddRoute}>
          Add
        </button>

        {/* Success Message - ✅ Shows only on successful response */}
        {successMessage && <p className="text-green-400 text-center mt-4">{successMessage}</p>}

        {/* Error Message Display */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {infoMessage && <p className="text-blue-300 text-center mt-2">{infoMessage}</p>}
      </div>
    </div>
  );
};

export default AddRoute;
