import { useRoutes } from "react-router-dom";
import "./app.css";
import './globals.d.ts';

// Layouts
import AdminLayout from "./pages/AdminLayout";
import ProtectedRoute from './components/ProtectedRoute.js'

import AuthLayout from "./pages/AuthLayout";

// Import
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Zoho from "./pages/auth/Zoho";
import SignupConfirmation from "./pages/auth/SignupConfirmation";
import OTP from "./pages/auth/OTP";
import SignInHelp from "./pages/auth/SignInHelp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Navigation from "./pages/Navigation";
import Activity from "./pages/Activity";
import NewProject from "./pages/NewProject";
import Stakeholders from "./pages/Stakeholders";
import Requirements from "./pages/Requirements";
import Assumptions from "./pages/Assumptions";
import RiskManagement from "./pages/RiskManagement";
import ProjectDocuments from "./pages/ProjectDocuments";
import TimeTracking from "./pages/TimeTracking";
import ChangeManagement from "./pages/ChangeManagement";
import Issues from "./pages/Issues";
import ChangeControlBoard from "./pages/ChangeControlBoard";
import ProjectSummary from "./pages/ProjectSummary";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectContacts from "./pages/ProjectContacts";
import ShareProject from "./pages/ShareProject";
import Collaboration from "./pages/Collaboration";
import ManageProjectAccess from "./pages/ManageProjectAccess";
import ChangeManagementEntry from "./pages/ChangeManagementEntry";

function App() {
   // Helper function to wrap elements with ProtectedRoute
   const protectRoute = (element:any) => {
    return <ProtectedRoute>{element}</ProtectedRoute>;
  };
  const routes = [
    {
      path: `${process.env.REACT_APP_BASE_URL || ""}`,
      element: protectRoute(<AdminLayout />),
      children: [
        { path: "", element: protectRoute(<Landing />) },
        { path: "dashboard", element: protectRoute(<Dashboard />) },
        { path: "navigation", element: protectRoute(<Navigation />) },
        { path: "activity", element: protectRoute(<Activity />) },
        { path: "new_project", element: protectRoute(<NewProject />) },
        { path: "stakeholders", element: protectRoute(<Stakeholders />) },
        { path: "requirements", element: protectRoute(<Requirements />) },
        { path: "assumptions", element: protectRoute(<Assumptions />) },
        { path: "risk_management", element: protectRoute(<RiskManagement />) },
        { path: "project_documents", element: protectRoute(<ProjectDocuments />) },
        { path: "time_tracking", element: protectRoute(<TimeTracking />) },
        { path: "change_management", element: protectRoute(<ChangeManagement />) },
        { path: "issues", element: protectRoute(<Issues />) },
        { path: "ccb", element: protectRoute(<ChangeControlBoard />) },
        { path: "project_summary", element: protectRoute(<ProjectSummary />) },
        { path: "project_details", element: protectRoute(<ProjectDetails />) },
        { path: "project_contacts", element: protectRoute(<ProjectContacts />) },
        { path: "share_project", element: protectRoute(<ShareProject />) },
        { path: "collaboration", element: protectRoute(<Collaboration />) },
        { path: "manage_project_access", element: protectRoute(<ManageProjectAccess />) },
        { path: "change_management_entry", element: protectRoute(<ChangeManagementEntry />) },
   
      ],
    },
    {
      path: `${process.env.REACT_APP_BASE_URL || ""}/auth`,
      // element: <AuthLayout />,
      children: [
        { path: "signin", element: <SignIn /> },
        { path: "signup", element: <SignUp /> },
        { path: "signup-confirmation", element: <SignupConfirmation /> },
        { path: "plans", element: <Zoho />},
        { path: "otp", element: <OTP /> },
        {path: "reset-password", element: <SignInHelp/>},
        {path:"forgot-password/:id/:time", element: <ForgotPassword/>}
      ],
    },
  ];

  return useRoutes(routes);
}

export default App;
