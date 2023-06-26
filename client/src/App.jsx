import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Footer, Navbar } from "./components";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reminder from "./pages/Reminder";

function App() {
  const Layout = () => {
    return (
      <div className="container">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/"  element={<Layout />}>
        <Route index={true} path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reminder/:id" element={<Reminder />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
