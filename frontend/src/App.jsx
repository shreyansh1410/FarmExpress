import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Body from "./components/Body";
import Home from "./components/Home";
import Login from "./components/Login";
import appStore from "./utils/appStore";
import AdminDashboard from "./components/AdminDashboard";
import MergedSchedule from "./components/MergedSchedule";
import MergeableSchedule from "./components/MergeableSchedule";
import Truck from "./components/Truck";
import AddRoute from "./components/AddRoute";
import Profile from "./components/Profile";
import ThemeProvider from "./components/ThemeProvider";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ViewTrucks from "./components/ViewTrucks";
import ViewRoutes from "./components/ViewRoutes";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Provider store={appStore}>
      <ThemeProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/truck"
                element={
                  <ProtectedRoute>
                    <Truck />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/route"
                element={
                  <ProtectedRoute>
                    <AddRoute />
                  </ProtectedRoute>
                }
              />
              <Route path="/view-trucks" element={<ViewTrucks />} />
              <Route path="/view-routes" element={<ViewRoutes />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/mergedSchedule" element={<MergedSchedule />} />
              <Route path="/mergeable" element={<MergeableSchedule />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App
