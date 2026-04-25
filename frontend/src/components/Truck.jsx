import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { CircleGauge, Fuel, ShieldCheck, Truck as TruckIcon } from "lucide-react";

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
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="reveal-on-scroll rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5 shadow-sm lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Fleet Setup
                </p>
                <h1 className="mt-1 text-3xl font-extrabold text-base-content">
                  Register a New Truck
                </h1>
                <p className="mt-2 text-sm text-base-content/70">
                  Add your vehicle profile to start route planning and delivery optimization.
                </p>
              </div>
              <div className="hidden rounded-xl border border-base-300/70 bg-base-100/70 p-3 backdrop-blur sm:flex">
                <TruckIcon className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>

          <div className="apple-glass apple-glass-hover reveal-on-scroll reveal-up rounded-2xl border border-base-300/70 bg-base-200/60 p-5 shadow-md backdrop-blur-lg lg:col-span-2">
            <div className="space-y-4">
              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text font-semibold text-base-content">License Plate</span>
                </div>
                <input
                  type="text"
                  placeholder="UP11AA1111"
                  value={licensePlate}
                  onChange={(e) =>
                    setLicensePlate(normalizeLicensePlate(e.target.value))
                  }
                  className="input input-bordered w-full bg-base-100/70"
                />
              </label>

              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text font-semibold text-base-content">Total Capacity (kg)</span>
                </div>
                <input
                  type="number"
                  placeholder="1000"
                  value={totalCapacity}
                  onChange={(e) => setTotalCapacity(e.target.value)}
                  className="input input-bordered w-full bg-base-100/70"
                />
              </label>

              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text font-semibold text-base-content">Material Type</span>
                </div>
                <select
                  className="select select-bordered w-full bg-base-100/70"
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
            </div>

            <button
              className="btn btn-success mt-6 w-full text-base font-semibold"
              onClick={handleAddTruck}
            >
              Save Truck and Continue
            </button>

            {successMessage && (
              <div className="alert alert-success mt-4 py-2 text-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="alert alert-error mt-4 py-2 text-sm">
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="apple-glass apple-glass-hover reveal-on-scroll reveal-up rounded-2xl border border-base-300/70 bg-base-200/60 p-4 shadow-sm backdrop-blur">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <CircleGauge className="h-4 w-4" />
                <p className="text-sm font-semibold">Capacity Guidance</p>
              </div>
              <p className="text-sm text-base-content/75">
                Enter max carrying load in kilograms. This is used to validate stop-level loads later.
              </p>
            </div>

            <div className="apple-glass apple-glass-hover reveal-on-scroll reveal-up rounded-2xl border border-base-300/70 bg-base-200/60 p-4 shadow-sm backdrop-blur" style={{ "--reveal-delay": "90ms" }}>
              <div className="mb-2 flex items-center gap-2 text-secondary">
                <Fuel className="h-4 w-4" />
                <p className="text-sm font-semibold">Material Compatibility</p>
              </div>
              <p className="text-sm text-base-content/75">
                Pick the closest material category for better route matching and shipment planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Truck;
