import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { CalendarClock, MapPin, Route, Truck } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
};

const ViewRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(BASE_URL + "/scheduleDelivery/routes", {
        withCredentials: true,
      });
      setRoutes(res.data?.routes || []);
    } catch (err) {
      setError(err.response?.data || "Unable to fetch routes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="reveal-on-scroll mb-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-5 shadow-sm">
          <h1 className="text-3xl font-extrabold text-base-content">All Routes</h1>
          <p className="mt-2 text-sm text-base-content/70">
            View every route added across all your registered trucks.
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-4 py-2 text-sm">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-base-300/70 bg-base-200/60 p-8 text-center text-base-content/70">
            Loading routes...
          </div>
        ) : routes.length === 0 ? (
          <div className="rounded-2xl border border-base-300/70 bg-base-200/60 p-8 text-center text-base-content/70">
            No routes added yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {routes.map((route, index) => (
              <div
                key={route._id}
                className="apple-glass apple-glass-hover reveal-on-scroll reveal-up rounded-2xl border border-base-300/70 bg-base-200/60 p-5 shadow-sm backdrop-blur"
                style={{ "--reveal-delay": `${Math.min(index * 70, 280)}ms` }}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <p className="text-base font-semibold text-base-content">
                      {route.truckLicensePlate || "Unknown Truck"}
                    </p>
                  </div>
                  <div className="badge badge-outline">{route.materialType || "General Merchandise"}</div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <p className="flex items-center gap-2 text-base-content/85">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span>
                      <span className="font-semibold text-base-content">Source:</span> {route.source}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-base-content/85">
                    <Route className="h-4 w-4 text-secondary" />
                    <span>
                      <span className="font-semibold text-base-content">Destination:</span> {route.destination}
                    </span>
                  </p>
                  <p className="text-base-content/85">
                    <span className="font-semibold text-base-content">Truck Capacity:</span>{" "}
                    {route.truckTotalCapacity ?? "N/A"} kg
                  </p>
                  <p className="flex items-center gap-2 text-base-content/85">
                    <CalendarClock className="h-4 w-4 text-secondary" />
                    <span>
                      <span className="font-semibold text-base-content">Last Updated:</span>{" "}
                      {formatDate(route.updatedAt)}
                    </span>
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-base-300/70 bg-base-100/70 p-4">
                  <p className="mb-2 text-sm font-semibold text-base-content">Stops</p>
                  {Array.isArray(route.stops) && route.stops.length > 0 ? (
                    <div className="space-y-2">
                      {route.stops.map((stop, index) => (
                        <div
                          key={`${route._id}-${stop}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-base-300/60 bg-base-200/65 p-2 text-sm"
                        >
                          <span className="text-base-content">
                            {index + 1}. {stop}
                          </span>
                          <span className="text-base-content/75">
                            Load: {route.stopLoads?.[index] ?? 0} kg
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/70">No stops available.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRoutes;
