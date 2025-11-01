import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { RefObject } from "react";

interface MessageBubbleProps {
  handleEdit?: () => void;
  handleDelete?: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
}

export default function MessageMenue({
  handleEdit,
  handleDelete,
  menuRef,
  position,
}: MessageBubbleProps) {
  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: `${position.x - 70}px`,
        top: `${position.y + 30}px`,
      }}
      className={`bg-white shadow-lg rounded-lg p-2 z-10 transform transition-all duration-200 ease-out `}
    >
      <div className="flex-col">
        <button
          onClick={handleEdit}
          className="w-full cursor-pointer text-sm flex items-center  gap-2 p-2 hover:bg-gray-200 rounded-md"
          title="Edit message"
        >
          <Pencil1Icon className="w-4 h-4 text-gray-600" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="w-full cursor-pointer text-sm  text-red-600 flex items-center gap-2  p-2 hover:bg-gray-200 rounded-md transition-colors"
          title="Delete message"
        >
          <TrashIcon className="w-4 h-4 " />
          Delete
        </button>
      </div>
    </div>
  );
}
