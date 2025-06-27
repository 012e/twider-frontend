import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashObject(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}
