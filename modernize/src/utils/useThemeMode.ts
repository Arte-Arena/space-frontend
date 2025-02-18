import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

export function useThemeMode() {
  const mode = useSelector((state: AppState) => state.customizer.activeMode);
  return mode;
}