import clsx from "clsx";
import { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Memoize frequently used class combinations
const classCache = new Map<string, string>();

export function cnCached(...inputs: ClassValue[]) {
  const key = JSON.stringify(inputs);
  
  if (classCache.has(key)) {
    return classCache.get(key)!;
  }
  
  const result = clsx(inputs);
  classCache.set(key, result);
  
  return result;
}
