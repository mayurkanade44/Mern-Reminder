import { useEffect, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { AddReminderModal, CategoryModal, Loading } from "../components";
import {
  useAllRemindersQuery,
  useReminderStatsQuery,
} from "../redux/reminderSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleReminder, logoutUser } from "../redux/authSlice";
import { useAllCategoriesQuery, useLogoutMutation } from "../redux/userSlice";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { reminderModal } = useSelector((store) => store.auth);
  const [tempSearch, setTempSearch] = useState("");
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [page, setPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState("All Categories");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: categories, refetch: categoryRefetch } =
    useAllCategoriesQuery();
  const { data: stats, refetch: statsRefetch } = useReminderStatsQuery();
  const [logout] = useLogoutMutation();
  const { data, isLoading, isFetching, refetch, error } = useAllRemindersQuery({
    search,
    category: searchCategory,
    page,
  });

  useEffect(() => {
    if (error && error.status === 401) {
      async () => {
        await logout();
        dispatch(logoutUser());
        navigate("/");
        toast.error("Unauthorized! Logging Out");
      };
    }
  }, [error]);

  const debounce = () => {
    let timeoutId;
    return (e) => {
      setTempSearch(e.target.value);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearch(e.target.value);
        setPage(1);
      }, 1000);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []);

  const pages = Array.from({ length: data?.pages }, (_, index) => index + 1);

  return (
    <div className="px-6 my-2 w-full">
      {(isLoading || isFetching) && <Loading />}
      <div className="flex justify-around">
        <div className="h-20 w-60 bg-green-500 flex flex-col items-center justify-center rounded-lg">
          <h4 className="text-2xl font-bold text-white">Total</h4>
          <h4 className="text-2xl font-semibold text-black">{stats?.total}</h4>
        </div>
        <div className="h-20 w-60 bg-red-500 flex flex-col items-center justify-center rounded-lg">
          <h4 className="text-2xl font-bold text-white">Expired</h4>
          <h4 className="text-2xl font-semibold text-black">
            {stats?.expired}
          </h4>
        </div>
        <div className="h-20 w-60 bg-cyan-400 flex flex-col items-center justify-center rounded-lg">
          <h4 className="text-2xl font-bold text-white">Expiring</h4>
          <h4 className="text-2xl font-semibold text-black">{stats?.month}</h4>
        </div>
      </div>
      <div className="md:px-10 py-4 md:py-7">
        <div className="lg:flex items-center justify-between">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
            All Reminders
          </p>
          <div className="md:flex items-center mt-6 lg:mt-0">
            <div className="flex items-center">
              <div className="flex items-center pl-1 bg-white border w-64 rounded border-gray-200">
                <AiOutlineSearch />
                <input
                  type="text"
                  className="py-1 md:py-2.5 pl-1 w-full focus:outline-none text-sm rounded text-gray-600 placeholder-gray-500"
                  placeholder="Search"
                  value={tempSearch}
                  onChange={optimizedDebounce}
                />
              </div>
              <div className="w-40 py-1 md:py-2 px-3 bg-white lg:ml-3 border rounded border-gray-200">
                <select
                  className="w-full text-sm leading-3 text-gray-500 focus:outline-none"
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="All Categories">All Categories</option>
                  {categories?.categories?.map((data) => {
                    return (
                      <option value={data} key={data}>
                        {data}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex items-end justify-around mt-4 md:mt-0 md:ml-3 lg:ml-0">
              <button
                onClick={() => setOpenCategory(true)}
                className="inline-flex ml-1.5 items-start justify-start px-6 py-3 bg-cyan-500 hover:bg-cyan-600 focus:outline-none rounded"
              >
                <p className="text-sm font-medium leading-none text-white">
                  Add Category
                </p>
              </button>
              <button
                onClick={() =>
                  dispatch(handleReminder({ show: true, edit: false }))
                }
                className="inline-flex ml-1.5 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
              >
                <p className="text-sm font-medium leading-none text-white">
                  New Reminder
                </p>
              </button>
              {reminderModal.show && (
                <AddReminderModal
                  open={reminderModal.show}
                  refetch={refetch}
                  statsRefetch={statsRefetch}
                  onClose={() =>
                    dispatch(handleReminder({ show: false, edit: false }))
                  }
                />
              )}
              {openCategory && (
                <CategoryModal
                  open={openCategory}
                  refetch={categoryRefetch}
                  onClose={() => setOpenCategory(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white px-4 md:px-8 xl:px-10 overflow-x-auto">
        {data?.reminders?.length < 1 && (
          <h1 className="text-center text-red-500 font-semibold text-2xl">
            No Data Found
          </h1>
        )}
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="h-16 w-full text-md leading-none text-gray-600">
              <th className="font-bold text-left pl-5">Title</th>
              <th className="font-bold text-left pl-9">Category</th>
              <th className="font-bold text-left">Expiry Date</th>
              <th className="font-bold text-left">Notes</th>
              <th className="font-bold text-left w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {data?.reminders?.map((reminder, index) => (
              <tr
                key={reminder._id}
                className="h-14 text-sm leading-none text-gray-700 border-b border-t border-gray-200 bg-white hover:bg-gray-100"
              >
                <td className="pl-5">
                  <h1>{reminder.title}</h1>
                </td>
                <td className="mr-16 pl-10">
                  <p>{reminder.category}</p>
                </td>
                <td>
                  <p className="mr-6">
                    {new Date(reminder.expirationDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </td>
                <td>
                  <p className="mr-10">{reminder.notes?.substring(0, 20)}</p>
                </td>
                <td>
                  <div className="flex items-center">
                    <Link
                      to={`/reminder/${reminder._id}`}
                      className="bg-black mr-3 py-2.5 px-5 rounded text-sm leading-3 text-white focus:outline-none"
                    >
                      Details
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length > 1 && (
          <nav>
            <ul className="list-style-none flex justify-center mt-2">
              {pages.map((item) => (
                <li className="pr-1" key={item}>
                  <button
                    className={`relative block rounded px-3 py-1.5 text-sm transition-all duration-30  ${
                      page === item ? "bg-blue-400" : "bg-neutral-700"
                    } text-white hover:bg-blue-400`}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
