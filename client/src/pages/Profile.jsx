import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAllCategoriesQuery,
  useUpdateUserMutation,
} from "../redux/userSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const { data: profile } = useAllCategoriesQuery();
  const [searchParams] = useSearchParams();
  const [update, { isLoading }] = useUpdateUserMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    emailList: "",
    verificationToken: "",
    email: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      verificationToken: searchParams.get("token"),
      email: searchParams.get("email"),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await update(form).unwrap();
      toast.success(res.msg);
      navigate("/");
      setForm({
        password: "",
        emailList: "",
        verificationToken: "",
        email: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col w-[370px] border-2 border-black p-3">
        <h1 className="text-2xl font-semibold text-center">
          {profile?.name} Profile
        </h1>
        <form action="submit" onSubmit={handleSubmit}>
          <div className="my-8 gap-2">
            <div className="flex mb-3 md:my-5">
              <label
                htmlFor="password"
                className="pr-2 w-52 text-xl font-semibold text-gray-800"
              >
                Set Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
                placeholder="Set new password"
              />
            </div>
          </div>
          <div className="mb-5 gap-2">
            <div className="flex mb-1">
              <label
                htmlFor="emailList"
                className="pr-2 w-36 text-xl font-semibold text-gray-800"
              >
                Email List
              </label>
              <input
                type="email"
                value={form.emailList}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, emailList: e.target.value }))
                }
                className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
                placeholder="Email ids for reminder notification"
              />
            </div>
            <p className="flex justify-end text-xs text-red-600">
              Upto 2 Email ids are allowed
            </p>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-green-800 text-white font-bold text-lg py-1 mb-2 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Profile;
