import { useCallback, useEffect, useState } from "react";

import { IoMdClose } from "react-icons/io";

const Modal = ({
  isOpen,
  onClose,
  title,
  body,
  disabled,
  width,
  itemCenter,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={itemCenter}>
        <div className={width}>
          <div
            className={`translate duration-300 h-full ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center p-3 rounded-t justify-center relative border-b-[1px]">
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute right-9"
                  onClick={handleClose}
                >
                  <IoMdClose size={18} className="text-red-700 mt-1" />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              <div className="relative flex-auto">{body}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
