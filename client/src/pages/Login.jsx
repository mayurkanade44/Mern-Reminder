import { useRef } from "react";

const Login = () => {
  let form = useRef(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form_data = new FormData(form.current);
    let payload = {};
    form_data.forEach(function (value, key) {
      payload[key] = value;
    });
    console.log("payload", payload);
    // Place your API call here to submit your payload.
  };
  return (
    <section className="dark:bg-gray-900">
      <div className="mx-auto flex justify-center flex-col md:flex-row h-full">
        <form
          onSubmit={handleSubmit}
          ref={form}
          className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-900"
        >
          <div className="w-full sm:w-4/6 md:w-4/6 xl:w-2/3 text-gray-800 dark:text-gray-100 mb-12 sm:mb-0 px-2 sm:px-0">
            <div className="pt-1 px-2 flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-2xl sm:text-4xl font-bold">
                Login To Your Account
              </h3>
            </div>
            <div className="mt-10 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5">
                <label
                  htmlFor="email"
                  className="text-lg font-semibold leading-tight"
                >
                  Email
                </label>
                <input
                  required
                  id="email"
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
                  id="password"
                  name="password"
                  className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 focus:border-indigo-700 border-gray-300 border shadow"
                  type="password"
                />
              </div>
            </div>
            <div className="pt-6 w-full flex justify-between px-2 sm:px-6">
              <a
                className="text-sm hover:text-white text-indigo-600"
                href="javascript: void(0)"
              >
                Forgot Password?
              </a>
              <button
                className="text-sm hover:text-white text-indigo-600"
                href="javascript: void(0)"
              >
                Don't have an account?
              </button>
            </div>
            <div className="px-2 sm:mb-16 sm:px-6">
              <button
                type="submit"
                className="focus:outline-none w-full sm:w-auto bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm mt-6"
              >
                Login to Your Account
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
