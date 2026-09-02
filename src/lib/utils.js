import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) { return twMerge(clsx(inputs)); }
export function formatCurrency(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }
export function getDiscount(product) { return product.previousPrice ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100) : null; }
