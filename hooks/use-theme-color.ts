import { Colors } from '@/constants/colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  _colorName?: string
): string {
  return props.dark ?? Colors.text.primary;
}
