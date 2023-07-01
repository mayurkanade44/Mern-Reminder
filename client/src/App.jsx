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
import {
  Login,
  Dashboard,
  Profile,
  Reminder,
  Admin,
  ProtectedRoute,
  PageNotFound,
} from "./pages";

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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminder/:id"
          element={
            <ProtectedRoute>
              <Reminder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
