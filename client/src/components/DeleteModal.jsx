import { AiOutlineDelete } from "react-icons/ai";
import Modal from "./Modal";
import {
  useAllRemindersQuery,
  useDeleteReminderMutation,
  useReminderStatsQuery,
} from "../redux/reminderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteModal = ({ open, setOpen, onClose, id }) => {
  const navigate = useNavigate();
  const [deleteReminder, { isLoading }] = useDeleteReminderMutation();
  const { refetch } = useAllRemindersQuery({
    search: "",
    category: "All Categories",
    page: 1,
  });
  const { refetch: statsRefetch } = useReminderStatsQuery();

  const handleDelete = async () => {
    try {
      const res = await deleteReminder(id).unwrap();
      toast.success(res.msg);
      refetch();
      statsRefetch();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };
  const body = (
    <div className="text-center m-4 md:m-2">
      <AiOutlineDelete className="text-red-500 mx-auto w-9 h-9" />
      <div className="mx-auto my-2 mb-3">
        <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
        <p className="text-sm text-gray-500">
          Are you sure you want delete this reminder?
        </p>
      </div>
      <div className="flex gap-4">
        <div
          onClick={handleDelete}
          disabled={isLoading}
          className="btn bg-red-700 w-full rounded-md text-white py-1 cursor-pointer disabled:cursor-not-allowed"
        >
          Delete
        </div>
        <div
          onClick={() => setOpen(false)}
          className="btn  bg-gray-200 w-full rounded-md text-dark py-1 font-semibold cursor-pointer"
        >
          Cancel
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        disabled={false}
        title="Delete Reminder"
        body={body}
        isOpen={open}
        onClose={onClose}
        width="relative w-full mx-3 mt-40 md:mt-2 md:w-2/4 lg:w-1/4 my-6 mx-auto h-full lg:h-auto md:h-auto"
        itemCenter="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
      />
    </div>
  );
};
export default DeleteModal;
