import type { ColorOption, SneakerColors } from "@/types";

export const PALETTE: ColorOption[] = [
  { id: "red", name: "Inferno Red", hex: "#d4161c" },
  { id: "volt", name: "Volt Green", hex: "#D6FF4D" },
  { id: "white", name: "Arctic White", hex: "#eef1f0" },
  { id: "black", name: "Shadow Black", hex: "#14171a" },
  { id: "sand", name: "Sand Beige", hex: "#cdb892" },
  { id: "blue", name: "Electric Blue", hex: "#1f6bff" },
  { id: "purple", name: "Purple Pulse", hex: "#8a2be2" },
];

export const DEFAULT_COLORS: SneakerColors = {
  upper: "#d4161c",
  laces: "#14171a",
  midsole: "#D6FF4D",
  outsole: "#14171a",
  accent: "#D6FF4D",
};

export const ZONES: { id: keyof SneakerColors; label: string }[] = [
  { id: "upper", label: "Upper" },
  { id: "laces", label: "Laces" },
  { id: "midsole", label: "Midsole" },
  { id: "outsole", label: "Outsole & Trim" },
  { id: "accent", label: "Accent" },
];
