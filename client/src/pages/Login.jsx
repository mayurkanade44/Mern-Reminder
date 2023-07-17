import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.admin) navigate("/admin");
      else navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (showRegister) {
        res = await register({
          name: e.target[0].value,
          email: e.target[1].value,
          password: e.target[2].value,
        }).unwrap();
        setShowRegister(false);
      } else {
        res = await login({
          email: e.target[0].value,
          password: e.target[1].value,
        }).unwrap();
        dispatch(setCredentials(res));
        if (res.user.admin) navigate("/admin");
        else navigate("/dashboard");
      }
      toast.success(res.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };
  return (
    <section className="dark:bg-gray-900">
      <div className="mx-auto flex justify-center flex-col md:flex-row h-full">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-900"
        >
          <div className="w-full sm:w-4/6 md:w-4/6 xl:w-2/3 text-gray-800 dark:text-gray-100 mb-10 sm:mb-0 px-2 sm:px-0">
            <div className="pt-1 px-2 flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-2xl sm:text-4xl font-bold">
                {showRegister
                  ? "Register Your Account"
                  : "Login To Your Account"}
              </h3>
            </div>
            <div className="mt-8 w-full px-2 sm:px-6">
              {showRegister && (
                <div className="flex flex-col mt-5">
                  <label
                    htmlFor="name"
                    className="text-lg font-semibold leading-tight"
                  >
                    Name
                  </label>
                  <input
                    required
                    name="name"
                    className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow"
                    type="text"
                  />
                </div>
              )}
              <div className="flex flex-col mt-5">
                <label
                  htmlFor="email"
                  className="text-lg font-semibold leading-tight"
                >
                  Email
                </label>
                <input
                  required
                  name="email"
                  className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow"
                  type="email"
                />
              </div>
              <div className="flex flex-col mt-5">
                <label
                  htmlFor="password"
                  className="text-lg font-semibold fleading-tight"
                >
                  Password
                </label>
                <input
                  required
                  name="password"
                  className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 focus:border-indigo-700 border-gray-300 border shadow"
                  type="password"
                />
              </div>
            </div>
            <div className="pt-6 w-full flex justify-between px-2 sm:px-6">
              <button
                type="button"
                onClick={() => setShowRegister(!showRegister)}
                className="text-sm hover:text-indigo-400 text-white"
              >
                {showRegister
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
              {!showRegister && (
                <p className="text-sm hover:text-indigo-400 text-white">
                  Forgot Password?
                </p>
              )}
            </div>
            <div className="flex justify-center px-2 sm:mb-16 sm:px-6">
              <button
                type="submit"
                disabled={loginLoading || registerLoading}
                className="focus:outline-none w-full sm:w-auto bg-indigo-700 text-white px-8 py-3 text-sm mt-6 hover:bg-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {showRegister ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </form>
        <div className="w-full hidden md:block md:w-1/2 bg-indigo-600 px-2 py-12 sm:p-12 flex-col relative">
          <div className="flex-1 flex flex-col justify-center">
            <div className="">
              <img
                src="https://dh-ui.s3.amazonaws.com/assets/team.png"
                alt="loginImg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
