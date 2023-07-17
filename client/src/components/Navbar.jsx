import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/userSlice";
import { logoutUser } from "../redux/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      dispatch(logoutUser());
      toast.success(res.msg);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user && (
        <section className="top-0 left-0 right-0 bg-white shadow-sm border-b-[1px]">
          <header className="mx-auto px-10 flex justify-between py-1 md:py-3 items-center">
            <div>
              <Link to="/">
                <h1>Reminder</h1>
              </Link>
            </div>
            <div>
              <button
                type="button"
                onClick={handleLogout}
                className="border-2 border-red-500 px-4 py-1 rounded-full text-red-500 font-semibold"
              >
                Logout
              </button>
            </div>
          </header>
        </section>
      )}
    </>
  );
};
export default Navbar;
