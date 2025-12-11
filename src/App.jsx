// Application shell that wires routing, context, and analytics providers.
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import GTMProvider from "./components/Tracking/GTMProvider";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ToastContainer from "./components/UI/ToastContainer";
import AppointmentFlow from "./pages/AppointmentFlow";
import { HelmetProvider } from 'react-helmet-async';
import LocationsDirectory from "./pages/LocationsDirectory";
import LocationPage from "./pages/LocationPage";
import FAQPage from "./pages/FAQPage";
import Confirmation from "./pages/Confirmation";
import HomePage from "./pages/HomePage";
import LicensePlateFlow from "./pages/LicensePlateFlow";
import MakeModelFlow from "./pages/MakeModelFlow";
import VINFlow from "./pages/VINFlow";
import ManageAppointment from "./pages/ManageAppointment";
import { AppProvider } from "./context/AppContext";

import { useEffect, useState } from "react";
import { authLogin } from "./services/auth";
import { hasValidToken } from "./services/utils/tokenManager";

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check if we have a valid token, if not, try to login
      if (!hasValidToken()) {
        try {
          console.debug("Initializing App Authentication...");
          await authLogin();
        } catch (e) {
          console.error("Auto-login failed:", e);
        }
      }
      setIsReady(true);
    };

    initAuth();
  }, []);



  return (
    <ErrorBoundary>
      <AppProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <GTMProvider>
            <HelmetProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home/welcome/:id" element={<HomePage />} />
                  <Route path="/welcome/home/:id" element={<HomePage />} />
                  <Route path="/manage-appointment/:id" element={<ManageAppointment />} />
                  <Route path="/updateappointment" element={<ManageAppointment />} />
                  <Route path="/sell-by-vin" element={<VINFlow />} />
                  <Route path="/valuation/:uid" element={<MakeModelFlow />} />
                  <Route path="/sell-by-make-model" element={<Navigate to="/valuation" replace />} />
                  <Route path="/valuation/vehicledetails/:uid" element={<MakeModelFlow />} />
                  <Route path="/valuation/vehiclecondition/:uid" element={<MakeModelFlow />} />
                  <Route path="/secure/bookappointment/:uid" element={<MakeModelFlow />} />
                  <Route path="/valuation/confirmation/:uid" element={<Confirmation />} />
                  <Route path="/confirmation/:uid" element={<Confirmation />} />
                  {/* Legacy routes stay available to honor existing inbound links. */}
                  <Route path="/sell-by-plate" element={<LicensePlateFlow />} />
                  <Route path="/appointment" element={<AppointmentFlow />} />

                  {/* SEO / Geo Routes */}
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/locations" element={<LocationsDirectory />} />
                  <Route path="/sell-my-car/location/:slug" element={<LocationPage />} />
                  <Route path="/sell-my-car/:state/:city" element={<LocationPage />} />
                  <Route path="/sell-my-car/:state" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
              <ToastContainer />
            </HelmetProvider>
          </GTMProvider>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
