type ClassValue = string | false | null | undefined;

/** Concatène des classes conditionnelles. Sans dépendance externe. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
