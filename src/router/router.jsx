import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import NotFound from "../components/NotFound";
import AddPerson from "../pages/AddPerson";
import DutyUpdate from "../pages/DutyUpdate";
import Employers from "../pages/Employers";
import EmployDetails from "../pages/EmployDetails";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import UsersPage from "../pages/UsersPage";
import ShiftChange from "../pages/ShiftChange";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        index: true,
        element: <HomePage />,
      },
      {
        path: "/addPerson",
        element: (
          <AdminRoute>
            <AddPerson />
          </AdminRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        ),
      },
      {
        path: "/employers",
        element: <Employers />,
      },
      {
        path: "/shiftChange",
        element: <ShiftChange />,
      },
      {
        path: "/employers/:id",
        element: <EmployDetails />,
      },

      {
        path: "/dutyUpdate",
        element: (
          <AdminRoute>
            <DutyUpdate />
          </AdminRoute>
        ),
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
