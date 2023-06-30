import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Footer, Navbar } from "./components";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reminder from "./pages/Reminder";
import Profile from "./pages/Profile";

function App() {
  const Layout = () => {
    return (
      <>
        <ToastContainer position="top-center" autoClose={2000} />
        <div className="container">
          <Navbar />
          <Outlet />
          <Footer />
        </div>
      </>
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index={true} path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reminder/:id" element={<Reminder />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
