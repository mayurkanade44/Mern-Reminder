import { Link, useParams } from "react-router-dom";
import { useSingleReminderQuery } from "../redux/reminderSlice";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import FileSaver from "file-saver";
import { handleReminder } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { DeleteModal, AddReminderModal, Loading } from "../components";

const Reminder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { reminderModal } = useSelector((store) => store.auth);
  const { data, isLoading, refetch } = useSingleReminderQuery(id);
  const [openDelete, setOpenDelete] = useState(false);

  const downloadMultipleFiles = (fileUrls) => {
    fileUrls.forEach((url) => {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          FileSaver.saveAs(blob, url.split("/").pop());
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <div className="mx-4 lg:mx-60">
      {isLoading && <Loading />}
      {reminderModal.show && (
        <AddReminderModal
          open={reminderModal.show}
          onClose={() => dispatch(handleReminder({ show: false, edit: false }))}
          data={data}
          refetch={refetch}
        />
      )}
      {openDelete && (
        <DeleteModal
          open={openDelete}
          setOpen={setOpenDelete}
          onClose={() => setOpenDelete(false)}
          id={data?._id}
        />
      )}
      <div className="my-6 lg:mt-10 mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-4">
        <h4 className="text-2xl font-bold">{data?.title}</h4>
        <div className="mt-2 md:mt-0 flex">
          <Link
            to="/dashboard"
            className="mr-3 text-white bg-gray-200 dark:bg-gray-700 focus:outline-none transition duration-150 ease-in-out rounded hover:bg-gray-300 dark:hover:bg-gray-600 px-5 py-2 text-sm"
          >
            Back
          </Link>
          <button
            onClick={() => setOpenDelete(true)}
            className="mr-3 flex bg-gray-200 dark:bg-red-600 rounded px-3 py-2 text-sm text-white"
          >
            <AiFillDelete className="w-4 h-4 mt-0.5 mr-1.5" />
            Delete
          </button>
          <button
            onClick={() => dispatch(handleReminder({ show: true, edit: true }))}
            className="flex hover:bg-indigo-600 bg-indigo-700 rounded text-white px-3 py-2 text-sm"
          >
            <AiFillEdit className="w-4 h-4 mt-0.5 mr-1.5" />
            Edit Reminder
          </button>
        </div>
      </div>
      <div className="flex md:justify-center md:mt-10">
        <div>
          <div className="flex flex-row">
            <h1 className="text-lg font-semibold mr-2">Category - </h1>
            <div className="bg-indigo-200 h-7 mb-6 rounded-md flex items-center justify-center">
              <span className="text-sm text-indigo-700 font-semibold mx-2">
                {data?.category}
              </span>
            </div>
          </div>
          <div className="flex flex-row">
            <h1 className="text-lg font-semibold mr-2">Expiration Date - </h1>
            <div className="bg-red-600 h-7 mb-6 rounded-md flex items-center justify-center">
              <span className="text-sm text-white font-semibold mx-2">
                {new Date(data?.expirationDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex flex-row">
            <h1 className="text-lg font-semibold mr-2">Reminder Starts</h1>
            <div className="bg-green-400 h-7 mb-6 rounded-md flex items-center justify-center">
              <span className="text-sm text-white font-semibold mx-2">
                {data?.expiryMonths.length}
              </span>
            </div>
            <h1 className="text-lg font-semibold ml-2">Months Before Expiry</h1>
          </div>
          <div className="flex flex-row">
            <h1 className="text-lg font-semibold mr-2">Auto Renew</h1>
            <div className="bg-green-400 h-7 mb-6 rounded-md flex items-center justify-center">
              <span className="text-sm text-white font-semibold mx-2">
                {data?.renew}
              </span>
            </div>
          </div>
          <h1 className="text-lg font-semibold mr-2 mb-6">
            Notes - {data?.notes}
          </h1>
          <div className="flex flex-row">
            <h1 className="text-lg font-semibold mr-2">Attached Documents -</h1>

            <button
              type="button"
              onClick={() => downloadMultipleFiles(data?.documents)}
              className="flex hover:bg-green-600 bg-green-700 rounded text-white px-3 py-1 text-sm disabled:opacity-0"
              disabled={!data?.documents.length}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reminder;
