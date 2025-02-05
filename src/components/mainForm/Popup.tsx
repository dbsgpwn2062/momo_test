import React from "react";

interface PopupProps {
  selectedDate: string | null;
  note: string;
  onClose: () => void;
  onNoteChange: (note: string) => void;
}

const Popup: React.FC<PopupProps> = ({
  selectedDate,
  note,
  onClose,
  onNoteChange,
}) => {
  if (!selectedDate) return null;

  return (
    <div className="w-1/2 h-full bg-gray-50 shadow-lg border-l p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{selectedDate}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <textarea
        className="w-full h-4/5 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="여기에 메모를 입력하세요..."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
      />
    </div>
  );
};

export default Popup;
