import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  useNewReminderMutation,
  useUpdateReminderMutation,
} from "../redux/reminderSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useAllCategoriesQuery } from "../redux/userSlice";

const initialState = {
  title: "",
  category: "Driving License",
  expirationDate: "",
  reminderDue: "1",
  notes: "",
  documents: [],
  renew: "Disabled",
};

const AddReminderModal = ({ open, onClose, data, refetch, statsRefetch }) => {
  const [formValue, setFormValue] = useState(initialState);
  const [newReminder, { isLoading }] = useNewReminderMutation();
  const { reminderModal } = useSelector((store) => store.auth);
  const [updateReminder, { isLoading: updateLoading }] =
    useUpdateReminderMutation();
  const { data: categories } = useAllCategoriesQuery();

  useEffect(() => {
    if (reminderModal.edit) {
      setFormValue({
        title: data?.title,
        category: data.category,
        notes: data.notes,
        expirationDate: new Date(data.expirationDate)
          .toISOString()
          .slice(0, 10),
        reminderDue: data.expiryMonths.length,
        documents: [],
        renew: data.renew,
      });
    }
  }, [reminderModal.edit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValue.title || !formValue.expirationDate)
      return toast.error("Please provide all values");

    const form = new FormData();

    form.set("title", formValue.title);
    form.set("category", formValue.category);
    form.set("expirationDate", new Date(formValue.expirationDate));
    form.set("reminderDue", formValue.reminderDue);
    form.set("notes", formValue.notes);
    if (formValue.renew === "Disabled") form.set("autoRenew", false);
    else form.set("autoRenew", true);
    form.set("renew", formValue.renew);
    formValue.documents.forEach((file) => {
      form.append("documents", file);
    });

    try {
      let res;
      if (reminderModal.edit) {
        res = await updateReminder({ data: form, id: data._id }).unwrap();
      } else {
        res = await newReminder(form).unwrap();
      }
      onClose();
      refetch();
      statsRefetch();
      setFormValue(initialState);
      toast.success(res.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  const dueMonths = [1, 2, 3];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "documents") {
      setFormValue((prev) => ({
        ...prev,
        documents: Array.from(e.target.files),
      }));
    } else setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const body = (
    <section className="mx-auto px-5 py-2">
      <form action="submit" onSubmit={handleSubmit}>
        <div className="md:flex justify-between my-4 gap-2">
          <div className="md:w-2/4 lg:w-3/5 flex mb-3 md:mb-0">
            <label
              htmlFor="title"
              className="pr-2 text-lg font-semibold text-gray-800"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formValue.title}
              onChange={handleChange}
              className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
              placeholder="Enter reminder title"
            />
          </div>
          <div className="md:w-2/4 lg:w-2/5 flex">
            <label
              htmlFor="category"
              className="pr-2 text-lg font-semibold text-gray-800"
            >
              Category
            </label>
            <select
              type="text"
              name="category"
              value={formValue.category}
              onChange={handleChange}
              className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
              placeholder="Enter reminder title"
            >
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
        <div className="md:flex justify-between my-4 gap-3">
          <div className="md:w-2/4 lg:w-3/5 flex mb-3 md:mb-0">
            <label
              htmlFor="expirationDate"
              className="pr-2 text-lg w-[220px] md:w-64 lg:w-56 font-semibold text-gray-800"
            >
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formValue.expirationDate}
              onChange={handleChange}
              className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
              placeholder="Enter reminder title"
            />
          </div>
          <div className="md:w-2/4 flex">
            <label
              htmlFor="reminderDue"
              className="pr-2 text-lg font-semibold text-gray-800"
            >
              Reminder
            </label>
            <select
              name="reminderDue"
              className="border w-10 border-gray-300 dark:border-gray-700 pl-1 rounded text-sm focus:outline-none focus:border-indigo-700 "
              value={formValue.reminderDue}
              onChange={handleChange}
            >
              {dueMonths.map((data) => {
                return (
                  <option value={data} key={data}>
                    {data}
                  </option>
                );
              })}
            </select>
            <p className="pl-2 text-lg font-semibold text-gray-800">
              Months Before
            </p>
          </div>
        </div>
        <div className="my-6 flex w-full">
          <label
            htmlFor="notes"
            className="pr-2 text-lg font-semibold text-gray-800"
          >
            Notes
          </label>
          <textarea
            name="notes"
            value={formValue.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 resize-none placeholder-gray-500"
            placeholder="Any notes"
            rows={4}
          />
        </div>
        <div className="md:flex justify-between my-4 gap-2">
          <div className="md:w-3/4 lg:w-3/5 flex mb-3 md:mb-0">
            <label
              htmlFor="documents"
              className="pr-2 text-lg font-semibold text-gray-800"
            >
              Documents
            </label>
            <input
              type="file"
              name="documents"
              onChange={handleChange}
              className="w-full"
              multiple
            />
          </div>
          <div className="md:w-2/4 lg:w-2/5 flex">
            <div className="flex items-center mr-2">
              <p className="ml-3 text-lg font-semibold text-gray-800">
                Auto Renew
              </p>
            </div>
            <select
              name="renew"
              className="border w-24 h-6 mt-1 border-gray-300 dark:border-gray-700  rounded text-sm focus:outline-none focus:border-indigo-700 "
              value={formValue.renew}
              onChange={handleChange}
            >
              <option value="Disabled">Disabled</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-green-800 text-white font-bold text-lg py-1 mb-2 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading || updateLoading}
          >
            {reminderModal.edit ? "Update" : "Add Reminder"}
          </button>
        </div>
      </form>
    </section>
  );

  return (
    <div>
      <Modal
        disabled={false}
        title="New Expiration Reminder"
        body={body}
        isOpen={open}
        onClose={onClose}
        width="relative w-full mx-3 mt-20 md:mt-2 md:w-5/6 lg:w-3/6 h-full lg:h-auto md:h-auto"
        itemCenter="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
      />
    </div>
  );
};
export default AddReminderModal;
