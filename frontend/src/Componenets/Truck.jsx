import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const HSRP_REGEX = /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/;
const normalizeLicensePlate = (value = "") =>
  value.toUpperCase().replace(/\s+/g, "");
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

const Truck = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const [totalCapacity, setTotalCapacity] = useState(1000);
  const [materialType, setMaterialType] = useState("General Merchandise");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message state
  const navigate = useNavigate();

  // API call to add truck
  const handleAddTruck = async () => {
    try {
      setError(""); // ✅ Clear error before making API call
      setSuccessMessage(""); // ✅ Clear previous success message
      const normalizedLicensePlate = normalizeLicensePlate(licensePlate);

      if (!HSRP_REGEX.test(normalizedLicensePlate)) {
        setError(
          "License plate must follow Indian HSRP format (e.g. UP11AA1111 or DL1CX9999).",
        );
        return;
      }

      const res = await axios.post(
        BASE_URL + "/scheduleDelivery/addtruck",
        {
          licensePlate: normalizedLicensePlate,
          totalCapacity: Number(totalCapacity),
          materialType,
        },
        { withCredentials: true },
      );

      localStorage.setItem(
        "lastAddedTruckLicensePlate",
        normalizedLicensePlate,
      );
      navigate("/route", {
        state: { truckId: res.data?.data?._id, licensePlate: normalizedLicensePlate },
      });
      console.log("Truck Added:", res.data);

      // ✅ Show success message ONLY on success
      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("Truck added successfully!");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-10">
      <div className="p-8 rounded-lg shadow-lg w-[500px] bg-base-200 border border-base-300">
        <h1 className="text-center text-base-content text-2xl font-bold mb-6">
          Add Truck
        </h1>

        {/* License Plate Input */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-base-content">License Plate</span>
          </div>
          <input
            type="text"
            placeholder="UP11AA1111"
            value={licensePlate}
            onChange={(e) =>
              setLicensePlate(normalizeLicensePlate(e.target.value))
            }
            className="input input-bordered w-full"
          />
        </label>

        {/* Total Capacity Input */}
        <label className="form-control w-full mt-4">
          <div className="label">
            <span className="label-text text-base-content">Total Capacity</span>
          </div>
          <input
            type="number"
            placeholder="Type here"
            value={totalCapacity}
            onChange={(e) => setTotalCapacity(e.target.value)}
            className="input input-bordered w-full"
          />
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

        {/* Submit Button */}
        <button
          className="btn btn-success w-full mt-6"
          onClick={handleAddTruck}
        >
          Add
        </button>

        {/* Success Message - ✅ ONLY SHOWS ON SUCCESS */}
        {successMessage && (
          <p className="text-green-400 text-center mt-4">{successMessage}</p>
        )}

        {/* Error Message Display */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Truck;
