import { toast } from "react-toastify";
import { useAddCategoryMutation } from "../redux/userSlice";
import Modal from "./Modal";
import { useSelector } from "react-redux";

const CategoryModal = ({ open, onClose }) => {
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const { user } = useSelector((store) => store.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { category: e.target[0].value };
    try {
      const res = await addCategory({ data, id: user.userId }).unwrap();
      toast.success(res.msg);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  const body = (
    <section className="mx-auto px-5 py-2">
      <form action="submit" onSubmit={handleSubmit}>
        <div className="md:flex justify-between my-4 gap-2">
          <label
            htmlFor="title"
            className="pr-2 text-lg w-52 font-semibold text-gray-800"
          >
            Category Name
          </label>
          <input
            type="text"
            className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
            placeholder="Enter reminder title"
          />
        </div>
        <div className="flex justify-center mt-5">
          <button
            className="bg-green-800 text-white font-bold text-lg py-1 mb-2 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
      </form>
    </section>
  );

  return (
    <div>
      <Modal
        disabled={false}
        title="Add New Category"
        body={body}
        isOpen={open}
        onClose={onClose}
        width="relative w-full mx-3 mt-40 md:mt-2 md:w-2/3 lg:w-1/3 my-6 mx-auto h-full lg:h-auto md:h-auto"
        itemCenter="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
      />
    </div>
  );
};
export default CategoryModal;
