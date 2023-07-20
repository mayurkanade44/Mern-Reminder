import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/userSlice";
import { logoutUser } from "../redux/authSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);

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
          <header className="mx-auto px-6 lg:px-16 flex justify-between py-2 md:py-3 items-center">
            <div>
              <Link to="/">
                <h1 className="text-2xl font-semibold text-cyan-400 hover:text-black">
                  Reminder
                </h1>
              </Link>
            </div>
            <div className="text-white items-center gap-y-3 lg:text-dark-soft flex flex-col lg:flex-row gap-x-1 font-semibold">
              <div className="relative group">
                <div className="flex flex-col items-center">
                  <button
                    className="flex gap-x-1 items-center lg:mt-0 px-4 py-1 rounded-full text-dark font-semibold"
                    onClick={() => setProfileDropdown(!profileDropdown)}
                  >
                    <span className="text-blue-500 text-lg">
                      {user.name.split(" ")[0]}
                    </span>
                    <MdKeyboardArrowDown className="text-black" />
                  </button>
                  <div
                    className={`${
                      profileDropdown ? "block" : "hidden"
                    } lg:hidden transition-all duration-500 pt-1 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-[100px]`}
                  >
                    <ul className="bg-dark-soft lg:bg-white text-center flex flex-col shadow-lg rounded-lg overflow-hidden">
                      <Link
                        to={`/profile`}
                        className="px-2 py-1 text-blue-500 hover:text-black"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className=" px-2 py-2 text-red-500 hover:text-black"
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </section>
      )}
    </>
  );
};
export default Navbar;
