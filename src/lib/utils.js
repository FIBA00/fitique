import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function classNameMerge(...inputs) {
	return twMerge(clsx(inputs));
}
export function formatCurrency(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
}
export function getDiscount(product) {
	return product.previousPrice
		? Math.round(
				((product.previousPrice - product.price) /
					product.previousPrice) *
					100,
			)
		: null;
}

export function setQuery(setSearchParams, current, key, value) {
	const next = new URLSearchParams(current);
	value ? next.set(key, value) : next.delete(key);
	setSearchParams(next);
}

export function toParams(filters) {
	return new URLSearchParams(
		Object.entries(filters)
			.filter(([, value]) => Boolean(value))
			.map(([key, value]) => [key, String(value)]),
	);
}

export const timestamp = (value) =>
	value
		? new Intl.DateTimeFormat("en", {
				dateStyle: "medium",
				timeStyle: "short",
			}).format(new Date(value))
		: "Awaiting delivery time";

export function imageToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () =>
			reject(new Error("We could not read that photo."));
		reader.readAsDataURL(file);
	});
}
