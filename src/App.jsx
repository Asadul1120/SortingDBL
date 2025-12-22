import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        theme="dark"
        pauseOnHover={false}
      />

      <Outlet />
    </>
  );
}

export default App;
