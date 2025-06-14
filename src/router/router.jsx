import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import NotFound from "../components/NotFound";
import AddPerson from "../pages/AddPerson";
import DutyUpdate from "../pages/DutyUpdate";
import Employers from "../pages/Employers";
import EmployDetails from "../pages/EmployDetails";

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
        element: <AddPerson />,
      },
      {
        path: "/employers",
        element: <Employers />,
      },
      {
        path: "/employers/:id",
        element: <EmployDetails/>,
      },
      {
        path: "/dutyUpdate",
        element: <DutyUpdate />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
