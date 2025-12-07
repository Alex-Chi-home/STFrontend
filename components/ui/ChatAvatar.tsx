import Image from "next/image";

interface ChatAvatarProps {
  name: string;
  photoUrl?: string | null;
  chatId: number;
  size?: "sm" | "md" | "lg";
}

// Сolor palette
const AVATAR_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
  "#F8B739", // Orange
  "#52B788", // Green
  "#E76F51", // Coral
  "#2A9D8F", // Dark Teal
];

function getAvatarColor(chatId: number): string {
  return AVATAR_COLORS[chatId % AVATAR_COLORS.length];
}

function getInitial(name: string): string {
  if (!name || name.trim().length === 0) return "?";
  return name.trim()[0].toUpperCase();
}

function getSizeClasses(size: "sm" | "md" | "lg"): {
  container: string;
  text: string;
  pixels: number;
} {
  switch (size) {
    case "sm":
      return { container: "w-8 h-8", text: "text-sm", pixels: 32 };
    case "md":
      return { container: "w-12 h-12", text: "text-lg", pixels: 48 };
    case "lg":
      return { container: "w-16 h-16", text: "text-2xl", pixels: 64 };
    default:
      return { container: "w-12 h-12", text: "text-lg", pixels: 48 };
  }
}

export default function ChatAvatar({
  name,
  photoUrl,
  chatId,
  size = "md",
}: ChatAvatarProps) {
  const sizeClasses = getSizeClasses(size);
  const backgroundColor = getAvatarColor(chatId);
  const initial = getInitial(name);

  return (
    <div
      className={`${sizeClasses.container} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}
      style={{ backgroundColor: photoUrl ? "transparent" : backgroundColor }}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          width={sizeClasses.pixels}
          height={sizeClasses.pixels}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <span className={`${sizeClasses.text} font-semibold text-white`}>
          {initial}
        </span>
      )}
    </div>
  );
}
