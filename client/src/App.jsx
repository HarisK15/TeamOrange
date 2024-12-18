import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import Home from "../src/pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Clucks from "./pages/Clucks";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/PasswordUpdate";
import EmailVerification from "./pages/Verification";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { LoggedInProvider } from "./contexts/LoggedInContext";
import { UpdateClucksProvider } from "./contexts/UpdateClucksContext.jsx";
import NotificationsPage from './pages/Notificationspage.jsx';

//using axios to have a base URL so we don't have to type it everytime
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <LoggedInProvider>
        <UpdateClucksProvider>
          <Navbar />
          <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/clucks" element={<Clucks />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="/verify-email/:verificationToken" element={<EmailVerification />} />
            <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
        </UpdateClucksProvider>
      </LoggedInProvider>
    </>
  );
}

export default App;
