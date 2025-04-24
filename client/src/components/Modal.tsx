import React, { PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import Header from "./Header";
import { LuX } from "react-icons/lu";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

/**
 * Modal component for displaying content in a modal dialog.
 *
 * This component uses React's createPortal to render the modal directly into the document body,
 * which helps avoid z-index and overflow issues that can occur when nesting modals within other components.
 *
 * @component
 * @param {object} props - The component props
 * @param {boolean} props.isOpen - Whether the modal is open or closed
 * @param {() => void} props.onClose - Function to call when the modal should be closed
 * @param {string} props.name - The title/name of the modal to display in the header
 * @param {React.ReactNode} props.children - The content to display inside the modal
 *
 * @returns {React.ReactPortal | null} A React portal containing the modal or null if modal is not open
 *
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} name="Settings">
 *   <p>Modal content goes here</p>
 * </Modal>
 * ```
 */
function Modal({ isOpen, onClose, name, children }: PropsWithChildren<Props>) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    // BACKGROUND
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600/50 p-4">
      {/* MODAL */}
      <div className="dark:bg-dark-secondary w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
        <Header
          name={name}
          buttonComponent={
            <button
              className="bg-blue-primary flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-blue-600"
              onClick={onClose}
            >
              <LuX size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
