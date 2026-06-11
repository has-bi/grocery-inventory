export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="fixed inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative bg-white rounded-t-2xl sm:rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl pb-[env(safe-area-inset-bottom)]">
        <div className="sm:hidden flex justify-center pt-2.5">
          <div className="w-10 h-1 rounded-full bg-gray-300"></div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, className = "" }) {
  return (
    <div className={`px-6 pt-6 pb-4 border-b border-gray-200 ${className}`}>
      <h3 className="text-xl font-light text-black">
        {children}
      </h3>
    </div>
  );
}

export function ModalBody({ children, className = "" }) {
  return (
    <div className={`px-6 py-6 space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
