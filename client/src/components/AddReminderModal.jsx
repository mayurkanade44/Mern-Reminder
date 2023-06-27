import Modal from "./Modal";

const AddReminderModal = ({ open, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  const dueMonths = [1, 2, 3];

  const body = (
    <section className="mx-auto px-5 py-2">
      <form action="submit" onSubmit={handleSubmit}>
        <div className="md:flex justify-between my-4 gap-2">
          <div className="md:w-2/4 lg:w-3/5 flex mb-3 md:mb-0">
            <label
              htmlFor="FirstName"
              className="pr-2 text-lg font-semibold text-gray-800"
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
          <div className="md:w-2/4 lg:w-2/5 flex">
            <label
              htmlFor="FirstName"
              className="pr-2 text-lg font-semibold text-gray-800"
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
        </div>
        <div className="md:flex justify-between my-4 gap-3">
          <div className="md:w-2/4 lg:w-3/5 flex mb-3 md:mb-0">
            <label
              htmlFor="FirstName"
              className="pr-2 text-lg w-[220px] md:w-64 lg:w-56 font-semibold text-gray-800"
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
          <div className="md:w-2/4 flex">
            <label
              htmlFor="ReminderBefore"
              className="pr-2 text-lg font-semibold text-gray-800"
            >
              Reminder
            </label>
            <select
              type="text"
              name="firstName"
              className="border w-10 border-gray-300 dark:border-gray-700 pl-1 rounded text-sm focus:outline-none focus:border-indigo-700 "
              placeholder="Enter reminder title"
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
            htmlFor="about"
            className="pr-2 text-lg font-semibold text-gray-800"
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
        <div className="md:flex justify-between my-4 gap-2">
          <div className="md:w-3/4 lg:w-3/5 flex mb-3 md:mb-0">
            <label
              htmlFor="FirstName"
              className="pr-2 text-lg font-semibold text-gray-800"
            >
              Documents
            </label>
            <input type="file" name="firstName" className="w-full" multiple />
          </div>
          <div className="md:w-2/4 lg:w-2/5 flex">
            <div className="flex items-center">
              <div className="bg-white dark:bg-gray-800 border rounded-sm border-gray-400 dark:border-gray-700 w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                <input
                  type="checkbox"
                  className="checkbox  absolute cursor-pointer w-full h-full"
                />
                <div className="check-icon hidden bg-indigo-700 text-white rounded-sm"></div>
              </div>
              <p className="ml-3 text-lg font-semibold text-gray-800">
                Auto Renew
              </p>
            </div>
          </div>
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
        width="relative w-full mt-40 md:mt-2 md:w-5/6 lg:w-3/6  my-6 mx-auto h-full lg:h-auto md:h-auto"
        itemCenter="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
      />
    </div>
  );
};
export default AddReminderModal;
