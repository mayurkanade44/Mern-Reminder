import Modal from "./Modal";

const AddReminderModal = ({ open, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  const body = (
    <section className="mx-auto px-5 py-2">
      <form action="submit" onSubmit={handleSubmit}>
        <div className="flex my-6">
          <label
            htmlFor="FirstName"
            className="pr-2 text-xl font-semibold text-gray-800"
          >
            Title
          </label>
          <input
            type="text"
            name="firstName"
            className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
            placeholder="Enter reminder title"
          />
        </div>
        <div className="flex my-6">
          <label
            htmlFor="FirstName"
            className="pr-2 text-xl font-semibold text-gray-800"
          >
            Category
          </label>
          <select
            type="text"
            name="firstName"
            className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
            placeholder="Enter reminder title"
          />
        </div>
        <div className="flex my-6">
          <label
            htmlFor="FirstName"
            className="pr-2 text-xl w-72 lg:w-60 font-semibold text-gray-800"
          >
            Expiration Date
          </label>
          <input
            type="date"
            name="firstName"
            className="border w-full border-gray-300 dark:border-gray-700 pl-2 py-1 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 "
            placeholder="Enter reminder title"
          />
        </div>
        <div className="my-6 flex w-full">
          <label
            htmlFor="about"
            className="pr-2 text-xl font-semibold text-gray-800"
          >
            Notes
          </label>
          <textarea
            id="about"
            name="about"
            className="w-full border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 resize-none placeholder-gray-500"
            placeholder="Any notes"
            rows={4}
          />
        </div>
        <div className="flex my-4">
          <label
            htmlFor="FirstName"
            className="pr-2 text-xl font-semibold text-gray-800"
          >
            Documents
          </label>
          <input type="file" name="firstName" className="w-full" multiple />
        </div>
        <div className="flex justify-center">
          <button
            className="bg-green-800 text-white font-bold text-lg py-1 mb-2 px-4 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
          >
            Add Reminder
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
        actionLabel="Add"
        onSubmit={handleSubmit}
        body={body}
        isOpen={open}
        onClose={onClose}
        width="relative w-full mt-40 md:mt-2 md:w-3/6 lg:w-2/6 my-6 mx-auto h-full lg:h-auto md:h-auto"
        itemCenter="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
      />
    </div>
  );
};
export default AddReminderModal;
