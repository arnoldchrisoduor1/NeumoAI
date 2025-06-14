// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Optional utility functions that would complement the Hero component:
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// For generating random values used in particle animations
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// For the medical stats display
export function calculatePercentage(value: number, total: number): string {
  return `${Math.round((value / total) * 100)}%`
}