import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import AddReminderModal from "../components/AddReminderModal";
import { useAllRemindersQuery } from "../redux/reminderSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleReminder } from "../redux/authSlice";

const Dashboard = () => {
  const { reminderModal } = useSelector((store) => store.auth);
  const { data, isLoading, refetch } = useAllRemindersQuery();
  const dispatch = useDispatch();

  return (
    <div className="px-6 my-2 w-full">
      <div className="flex justify-around">
        <div className="h-20 w-60 bg-green-500 flex flex-col items-center justify-center rounded-lg">
          <h4 className="text-2xl font-bold text-white">Total</h4>
          <h4 className="text-2xl font-semibold text-black">1000</h4>
        </div>
        <div className="h-20 w-60 bg-red-500 flex flex-col items-center justify-center rounded-lg">
          <h4 className="text-2xl font-bold text-white">Expired</h4>
          <h4 className="text-2xl font-semibold text-black">10</h4>
        </div>
        <div className="h-20 w-60 bg-cyan-400 flex flex-col items-center justify-center rounded-lg">
          <h4 className="text-2xl font-bold text-white">Month</h4>
          <h4 className="text-2xl font-semibold text-black">20</h4>
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
                />
              </div>
              <div className="w-40 py-1 md:py-2 px-3 bg-white lg:ml-3 border rounded border-gray-200">
                <select className="w-full text-sm leading-3 text-gray-500 focus:outline-none">
                  <option>Employees</option>
                  <option>Clients</option>
                  <option>Employees</option>
                </select>
              </div>
            </div>
            <div className="flex items-end justify-around mt-4 md:mt-0 md:ml-3 lg:ml-0">
              <button className="inline-flex ml-1.5 items-start justify-start px-6 py-3 bg-cyan-500 hover:bg-cyan-600 focus:outline-none rounded">
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
              <AddReminderModal
                open={reminderModal.show}
                refetch={refetch}
                onClose={() =>
                  dispatch(handleReminder({ show: false, edit: false }))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white px-4 md:px-8 xl:px-10 overflow-x-auto">
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
            {data?.map((reminder, index) => (
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
                  <p className="mr-10">{reminder.notes}</p>
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
      </div>
    </div>
  );
};
export default Dashboard;
