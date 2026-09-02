import { z } from "zod";

const allowedTypes = [ "image/jpeg", "image/png", "image/webp" ];
const MAX_PHOTO_BYTES = 7 * 1024 * 1024;


export const imageSchema = z.object( {
	photo: z
		.any()
		.refine(
			(file) => file instanceof File,
			"Please add a JPG, PNG, or WEBP photo.",
		)
		.refine(
			(file) => !file || allowedTypes.includes(file.type),
			"Use a JPG, PNG, or WEBP image.",
		)
		.refine(
			(file) => !file || file.size <= MAX_PHOTO_BYTES,
			"Choose an image smaller than 7 MB.",
		),
	consent: z
		.boolean()
		.refine(Boolean, "Please agree before we analyse your photo."),
	product: z.string().min(1, "Choose a piece to check."),
	extras: z.array(z.string()).default([]),
});
