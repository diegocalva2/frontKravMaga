export type CardColor = "blue" | "green" | "red" | "yellow" | "purple";
type ColorVariant = {
  border: string;
  bg: string;
  text: string;
};

export const colorVariants: Record<CardColor, ColorVariant> = {
  blue: {
    border: "border-blue-500",
    bg: "bg-gradient-to-r from-blue-500/30 to-blue-600/40", // degradado
    text: "text-blue-400",
  },
  green: {
    border: "border-green-500",
    bg: "bg-gradient-to-r from-green-500/30 to-green-600/40",
    text: "text-green-400",
  },
  red: {
    border: "border-red-500",
    bg: "bg-gradient-to-r from-red-500/30 to-red-600/40",
    text: "text-red-400",
  },
  yellow: {
    border: "border-yellow-300",
    bg: "bg-gradient-to-r from-yellow-400/30 to-yellow-500/40",
    text: "text-yellow-300",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-gradient-to-r from-purple-500/30 to-purple-600/40",
    text: "text-purple-400",
  },
};