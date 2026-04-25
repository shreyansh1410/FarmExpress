import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Body from "./Componenets/Body";
import Home from "./Componenets/Home";
import Login from "./Componenets/Login";
import appStore from "./utils/appStore";
import AdminDashboard from "./Componenets/AdminDashboard";
import MergedSchedule from "./Componenets/MergedSchedule";
import MergeableSchedule from "./Componenets/MergeableSchedule";
import Truck from "./Componenets/Truck";
import AddRoute from "./Componenets/AddRoute";
import Profile from "./Componenets/Profile";
import ThemeProvider from "./Componenets/ThemeProvider";
import PrivacyPolicy from "./Componenets/PrivacyPolicy";
import TermsOfService from "./Componenets/TermsOfService";
import ViewTrucks from "./Componenets/ViewTrucks";
import ViewRoutes from "./Componenets/ViewRoutes";


function App() {
  return (
    <Provider store={appStore}>
      <ThemeProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/truck" element={<Truck />} />
              <Route path="/route" element={<AddRoute />} />
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
