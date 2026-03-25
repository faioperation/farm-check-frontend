import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";

// admin
import Home from "../pages/admin/Home";
import SopManagement from "../pages/admin/SopManagement";
import UserManagement from "../pages/admin/UserManagement";
import AddUser from "../pages/admin/AddUser";
import TaskOversight from "../pages/admin/TaskOversight";
import AddSOP from "../pages/admin/AddSOP";
import Messaging from "../pages/admin/Messaging";
import Settings from "../pages/admin/Settings";
import Subscription from "../pages/admin/Subscription";

// owner
import Dashboard from "../pages/owner/Dashboard";
import SystemSettings from "../pages/owner/SyetemSettings";
import SubscriptionPlans from "../pages/owner/SubscriptionPlans";
import FarmManagement from "../pages/owner/FarmManagement";
import FarmDetails from "../pages/owner/FarmDetails";
import CreateFarm from "../pages/owner/CreateFarm";

// auth
import LogIn from "../pages/auth/LogIn";
import SignUp from "../pages/auth/SignUp";
import ResetPassword from "../pages/auth/ResetPassword";
import NewPassword from "../pages/auth/NewPassword";
import Success from "../pages/auth/Success";
import OTP from "../pages/auth/OTP";
import VerifyEmail from "../pages/auth/VerifyEmail";
import LandingPageLayout from "../layout/LandingPageLayout";
import AboutUs from "../pages/landing/AboutUs";
import PrivacyPolicy from "../pages/landing/PrivacyPolicy";
import TermsService from "../pages/landing/TermsService";

const router = createBrowserRouter([
  //  AUTH ROUTES
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "reset/password", element: <ResetPassword /> },
      { path: "verify/otp", element: <OTP /> },
      { path: "new/password", element: <NewPassword /> },
      { path: "success", element: <Success /> },
      { path: "verify/email", element: <VerifyEmail /> },
    ],
  },

  // ADMIN  DASHBOARD ROUTES
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      // admin
      { path: "/admin/home", element: <Home /> },
      { path: "/admin/sop/management", element: <SopManagement /> },
      { path: "/admin/user/management", element: <UserManagement /> },
      { path: "/admin/user/management/add/user", element: <AddUser /> },
      { path: "/admin/user/management/edit/user/:id", element: <AddUser /> },
      { path: "/admin/task/oversight", element: <TaskOversight /> },
      { path: "/admin/sop/management/upload/sop", element: <AddSOP /> },
      { path: "/admin/sop/management/edit/sop/:id", element: <AddSOP /> },
      { path: "/admin/messaging/oversight", element: <Messaging /> },
      { path: "/admin/farm/settings", element: <Settings /> },
      { path: "/admin/subscription/billing", element: <Subscription /> },

     
    ],
  },

  // SYSTEM OWNER DASHBOARD ROUTES
  {
    path: "/owner",
    element: <DashboardLayout />,
    children: [
       // owner
      { path: "/owner/dashboard", element: <Dashboard /> },
      { path: "/owner/farm/management", element: <FarmManagement /> },
      { path: "/owner/farm/management/details/:id", element: <FarmDetails /> },
      { path: "/owner/farm/management/create/farm", element: <CreateFarm /> },
      { path: "/owner/subscription/plans", element: <SubscriptionPlans /> },
      { path: "/owner/system/settings", element: <SystemSettings /> },
    ],
  },

  //Landing page route
  {
    path: "/",
    element: <LandingPageLayout />,
  },

  // Static info pages
  { path: "/about-us", element: <AboutUs /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms-of-service", element: <TermsService /> },
]);

export default router;
