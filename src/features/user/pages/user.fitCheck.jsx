/* Fitique’s live, consent-led fitting-room experience. */
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Check,
	ChevronLeft,
	ChevronRight,
	CircleX,
	Clock3,
	ImageUp,
	LoaderCircle,
	LogIn,
	RotateCcw,
	Save,
	ShoppingBag,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

// ! internal imports
// # hooks

import { useProducts } from "../../products/hooks/useProducts";
import { useCartStore } from "../../commerce/hooks/useCart";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { useAuth } from "../../auth/hooks/useAuth.js";

// # api
import { trpc } from "../../../api/trpc.js";
import { cachePolicy } from "../../../api/queryConfig.js";

// # components
import { HangerMark } from "../../../components/brand";
import { startLogin, imageToDataUrl, formatCurrency } from "../../../lib/utils";
import { profileSchema, imageSchema } from "../../../schema/auth.schema.js";
import { extras, steps } from "../../../configs/constants.js";

// Todo: breakdown into components this code is too much .
export default function FitCheck() {
	usePageMeta(
		"Fit Check",
		"Live image-led fit guidance saved to your Fitique profile.",
	);
	const [searchParams] = useSearchParams();
	const requestedProduct = searchParams.get("product");
	const [step, setStep] = useState(1);
	const [previewUrl, setPreviewUrl] = useState("");
	const [result, setResult] = useState(null);
	const addItem = useCartStore((state) => state.addItem);
	const { isAuthenticated, user } = useAuth();
	const profileQuery = trpc.fitCheck.profile.useQuery(undefined, {
		enabled: isAuthenticated,
		...cachePolicy.fitProfile,
	});
	const { data: catalogProducts = [] } = useProducts({ sort: "newest" });
	const utils = trpc.useUtils();

	const {
		register,
		setValue,
		watch,
		trigger,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(imageSchema),
		defaultValues: {
			photo: null,
			consent: false,
			product: requestedProduct || "",
			extras: [],
		},
	});

	const profileForm = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			preferredSize: "",
			height: "",
			bodyShape: "",
			stylePreferences: "",
			fitNotes: "",
		},
	});
	const photo = watch("photo");
	const selectedProductId = watch("product");
	const selectedExtras = watch("extras");
	const selectedProduct = useMemo(
		() =>
			catalogProducts.find((product) => product.id === selectedProductId),
		[catalogProducts, selectedProductId],
	);

	const saveProfile = trpc.fitCheck.saveProfile.useMutation({
		onSuccess: (profile) => {
			if (profile?.preferredSize)
				localStorage.setItem(
					"fitique-preferred-size",
					profile.preferredSize,
				);
			utils.fitCheck.profile.invalidate();
			toast("Your Fitique profile has been saved.");
		},
		onError: () =>
			toast.error(
				"We could not save your profile. Please sign in and try again.",
			),
	});

	const analyzeMutation = trpc.fitCheck.analyze.useMutation({
		onSuccess: (data) => {
			setResult(data);
			setStep(5);
			utils.fitCheck.latest.invalidate();
			utils.fitCheck.profile.invalidate();
		},
		onError: (error) => {
			setStep(3);
			toast.error(
				error.message || "We could not complete your Fit Check.",
			);
		},
	});

	useEffect(
		() => () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		},
		[previewUrl],
	);

	useEffect(() => {
		if (profileQuery.data) {
			if (profileQuery.data.preferredSize)
				localStorage.setItem(
					"fitique-preferred-size",
					profileQuery.data.preferredSize,
				);
			profileForm.reset({
				preferredSize: profileQuery.data.preferredSize || "",
				height: profileQuery.data.height || "",
				bodyShape: profileQuery.data.bodyShape || "",
				stylePreferences: profileQuery.data.stylePreferences || "",
				fitNotes: profileQuery.data.fitNotes || "",
			});
		}
	}, [profileQuery.data, profileForm]);

	function choosePhoto(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(URL.createObjectURL(file));
		setValue("photo", file, { shouldValidate: true });
	}
	function removePhoto() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl("");
		setValue("photo", null, { shouldValidate: true });
	}
	async function next() {
		const valid =
			step === 1
				? await trigger(["photo", "consent"])
				: await trigger("product");
		if (valid) setStep((current) => current + 1);
	}
	function toggleExtra(extra) {
		setValue(
			"extras",
			selectedExtras.includes(extra)
				? selectedExtras.filter((item) => item !== extra)
				: [...selectedExtras, extra],
		);
	}
	async function analyze(values) {
		if (!isAuthenticated) {
			toast("Sign in to run and save your live Fit Check.");
			startLogin();
			return;
		}
		if (!selectedProduct) return;
		setStep(4);
		try {
			const photoDataUrl = await imageToDataUrl(values.photo);
			analyzeMutation.mutate({
				photoDataUrl,
				productId: selectedProduct.id,
				productName: selectedProduct.name,
				productType: selectedProduct.type,
				availableSizes: selectedProduct.sizes,
				extras: values.extras,
			});
		} catch (error) {
			setStep(3);
			toast.error(error.message);
		}
	}
	function reset() {
		removePhoto();
		setValue("consent", false);
		setValue("product", "");
		setValue("extras", []);
		setResult(null);
		setStep(1);
	}
	function saveCurrentProfile(values) {
		if (!isAuthenticated) {
			startLogin();
			return;
		}
		saveProfile.mutate(values);
	}

	return (
		<div className="bg-fitique-lilac/30">
			<div className="content-shell py-7 lg:py-10">
				<div className="grid gap-5 border-b border-fitique-line pb-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
					<div className="paper-noise relative overflow-hidden border border-fitique-line bg-fitique-lilac/70 p-5">
						<HangerMark
							strokeWidth={1.05}
							className="h-11 w-11 text-fitique-plum"
						/>
						<div className="mt-14 border-t border-fitique-plum/30 pt-3">
							<p className="eyebrow text-fitique-brown">
								Your personal fitting room
							</p>
							<p className="serif mt-2 text-2xl leading-6 text-fitique-plum">
								Take your time. The right feeling is part of the
								fit.
							</p>
						</div>
					</div>
					<div className="max-w-3xl lg:px-6">
						<p className="eyebrow text-fitique-brown">
							Live personal guidance
						</p>
						<h1 className="serif mt-2 text-5xl tracking-[-.05em] text-fitique-plum sm:text-6xl">
							Fit Check
						</h1>
						<p className="mt-3 max-w-2xl text-sm leading-7 text-fitique-ink/65">
							A private, image-led estimate for your next piece.
							Your saved profile makes the guidance more personal
							each time.
						</p>
						{!isAuthenticated && (
							<button
								onClick={startLogin}
								className="ghost-button focus-ring mt-5">
								<LogIn size={15} /> Sign in for live Fit Check
							</button>
						)}
						{isAuthenticated && (
							<div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
								<p className="text-xs font-bold text-fitique-brown">
									Signed in as{" "}
									{user?.name || "Fitique member"}
								</p>
								<Link
									to="/fit-history"
									className="focus-ring inline-flex items-center gap-1 text-xs font-extrabold text-fitique-plum hover:underline">
									<Clock3 size={14} /> View saved checks
								</Link>
							</div>
						)}
					</div>
				</div>
				<div className="mt-7 grid grid-cols-4 border-y border-fitique-line py-4">
					{steps.map((label, index) => {
						const active =
							step === index + 1 || (index === 3 && step === 5);
						const done = step > index + 1;
						return (
							<div
								key={label}
								className="flex items-center gap-2 text-[.6rem] font-extrabold uppercase tracking-[.09em] sm:text-[.68rem]">
								<span
									className={`grid h-6 w-6 place-items-center rounded-full ${active || done ? "bg-fitique-plum text-white" : "bg-fitique-ivory text-fitique-brown"}`}>
									{done ? <Check size={13} /> : index + 1}
								</span>
								<span
									className={
										active
											? "text-fitique-plum"
											: "hidden text-fitique-ink/45 sm:inline"
									}>
									{label}
								</span>
							</div>
						);
					})}
				</div>
				<div className="mt-8 min-h-124 border border-fitique-line bg-fitique-ivory p-5 sm:p-8 lg:p-10">
					{step === 1 && (
						<section className="mx-auto max-w-xl">
							<p className="eyebrow text-fitique-brown">
								Step 01
							</p>
							<h2 className="serif mt-2 text-4xl text-fitique-plum">
								Start with a photo.
							</h2>
							<p className="mt-3 text-sm leading-6 text-fitique-ink/65">
								Use a clear, full-length photo in everyday
								clothes. Fitique turns that visual context and
								the piece you choose into a conservative
								style-and-size estimate.
							</p>
							<p className="mt-5 border-l-2 border-fitique-plum bg-fitique-lilac/50 px-4 py-3 text-xs leading-5 text-fitique-ink/70">
								<strong className="text-fitique-plum">
									Your privacy, clearly:
								</strong>{" "}
								this photo is securely sent for Fit Check
								analysis and saved with your private result so
								you can revisit it from your account.
							</p>
							{previewUrl ? (
								<div className="mt-7 overflow-hidden border border-fitique-line bg-fitique-paper">
									<img
										src={previewUrl}
										alt="Your selected Fit Check photo"
										className="max-h-104 w-full object-cover"
									/>
									<div className="flex items-center justify-between bg-fitique-ivory p-3">
										<span className="text-sm font-bold">
											{photo?.name}
										</span>
										<button
											onClick={removePhoto}
											className="focus-ring inline-flex items-center gap-1 text-xs font-extrabold text-fitique-brown hover:text-fitique-plum">
											<CircleX size={15} /> Remove
										</button>
									</div>
								</div>
							) : (
								<label className="focus-within:ring-3 focus-within:ring-fitique-lilac mt-7 flex min-h-64 cursor-pointer flex-col items-center justify-center border border-dashed border-fitique-brown/60 bg-fitique-paper p-6 text-center hover:border-fitique-plum">
									<ImageUp
										size={32}
										className="text-fitique-plum"
									/>
									<span className="mt-4 text-sm font-extrabold">
										Choose a photo
									</span>
									<span className="mt-1 text-xs text-fitique-ink/60">
										JPG, PNG, or WEBP · up to 7 MB
									</span>
									<input
										type="file"
										accept="image/jpeg,image/png,image/webp"
										onChange={choosePhoto}
										className="sr-only"
									/>
								</label>
							)}
							{errors.photo && (
								<p role="alert" className="field-error">
									{errors.photo.message}
								</p>
							)}
							<label className="mt-5 flex items-start gap-3 text-xs leading-5 text-fitique-ink/65">
								<input
									type="checkbox"
									{...register("consent")}
									className="mt-0.5 accent-fitique-plum"
								/>{" "}
								I consent to Fitique using this photo for my fit
								analysis and storing it with my saved result.
							</label>
							{errors.consent && (
								<p role="alert" className="field-error">
									{errors.consent.message}
								</p>
							)}
							<div className="mt-7 flex justify-end">
								<button
									onClick={next}
									className="plum-button focus-ring">
									Choose a piece <ChevronRight size={15} />
								</button>
							</div>
						</section>
					)}
					{step === 2 && (
						<section className="mx-auto max-w-3xl">
							<p className="eyebrow text-fitique-brown">
								Step 02
							</p>
							<h2 className="serif mt-2 text-4xl text-fitique-plum">
								What are you considering?
							</h2>
							<p className="mt-3 text-sm leading-6 text-fitique-ink/65">
								Pick a piece to receive guidance against its
								available sizes.
							</p>
							<div className="mt-7 grid gap-3 sm:grid-cols-2">
								{catalogProducts
									.filter((product) => product.inStock)
									.map((product) => (
										<button
											key={product.id}
											onClick={() =>
												setValue(
													"product",
													product.id,
													{ shouldValidate: true },
												)
											}
											className={`focus-ring flex items-center gap-4 border p-3 text-left ${selectedProductId === product.id ? "border-fitique-plum bg-fitique-lilac/50" : "border-fitique-line bg-white hover:border-fitique-plum"}`}>
											<img
												src={product.image}
												alt=""
												className="h-20 w-16 object-cover"
											/>
											<span>
												<span className="block text-sm font-extrabold">
													{product.name}
												</span>
												<span className="mt-1 block text-xs text-fitique-ink/55">
													{product.type} ·{" "}
													{formatCurrency(
														product.price,
													)}
												</span>
											</span>
										</button>
									))}
							</div>
							{errors.product && (
								<p role="alert" className="field-error">
									{errors.product.message}
								</p>
							)}
							<div className="mt-7 flex justify-between">
								<button
									onClick={() => setStep(1)}
									className="ghost-button focus-ring">
									<ChevronLeft size={15} /> Back
								</button>
								<button
									onClick={next}
									className="plum-button focus-ring">
									Add the details <ChevronRight size={15} />
								</button>
							</div>
						</section>
					)}
					{step === 3 && (
						<section className="mx-auto max-w-3xl">
							<p className="eyebrow text-fitique-brown">
								Step 03
							</p>
							<h2 className="serif mt-2 text-4xl text-fitique-plum">
								Make it yours.
							</h2>
							<p className="mt-3 text-sm leading-6 text-fitique-ink/65">
								Add optional styling extras and, if you wish,
								save the preferences that make your next Fit
								Check feel more personal.
							</p>
							<div className="mt-7 flex flex-wrap gap-3">
								{extras.map((extra) => (
									<button
										key={extra}
										onClick={() => toggleExtra(extra)}
										className={`focus-ring border px-4 py-3 text-sm font-bold ${selectedExtras.includes(extra) ? "border-fitique-plum bg-fitique-plum text-white" : "border-fitique-line bg-white text-fitique-ink hover:border-fitique-plum"}`}>
										{extra}
									</button>
								))}
							</div>
							<form
								onSubmit={profileForm.handleSubmit(
									saveCurrentProfile,
								)}
								className="mt-8 border border-fitique-line bg-fitique-lilac/35 p-5">
								<div className="flex items-baseline justify-between gap-4">
									<div>
										<p className="eyebrow text-fitique-brown">
											Your saved fit profile
										</p>
										<p className="mt-2 text-sm leading-6 text-fitique-ink/65">
											Optional profile details support a
											more considered recommendation. You
											can change them any time.
										</p>
									</div>
									{isAuthenticated && (
										<span className="text-xs font-bold text-fitique-plum">
											{profileQuery.isLoading
												? "Loading…"
												: "Private to your account"}
										</span>
									)}
								</div>
								<div className="mt-5 grid gap-3 sm:grid-cols-2">
									<input
										className="field-input text-sm"
										placeholder="Usual size (e.g. M)"
										{...profileForm.register(
											"preferredSize",
										)}
									/>
									<input
										className="field-input text-sm"
										placeholder="Height (optional)"
										{...profileForm.register("height")}
									/>
									<input
										className="field-input text-sm"
										placeholder="Preferred silhouette"
										{...profileForm.register("bodyShape")}
									/>
									<input
										className="field-input text-sm"
										placeholder="Style preferences"
										{...profileForm.register(
											"stylePreferences",
										)}
									/>
								</div>
								<textarea
									className="field-input mt-3 min-h-20 text-sm"
									placeholder="Fit notes you want to remember"
									{...profileForm.register("fitNotes")}
								/>
								<div className="mt-4 flex justify-end">
									<button
										type="submit"
										disabled={saveProfile.isPending}
										className="ghost-button focus-ring disabled:opacity-60">
										<Save size={14} />{" "}
										{isAuthenticated
											? saveProfile.isPending
												? "Saving…"
												: "Save my profile"
											: "Sign in to save"}
									</button>
								</div>
							</form>
							<div className="mt-7 flex justify-between">
								<button
									onClick={() => setStep(2)}
									className="ghost-button focus-ring">
									<ChevronLeft size={15} /> Back
								</button>
								<button
									onClick={handleSubmit(analyze)}
									disabled={analyzeMutation.isPending}
									className="plum-button focus-ring disabled:opacity-60">
									Run live Fit Check <Sparkles size={15} />
								</button>
							</div>
						</section>
					)}
					{step === 4 && (
						<section className="mx-auto grid max-w-xl place-items-center py-20 text-center">
							<div className="relative grid h-24 w-24 place-items-center rounded-full border border-fitique-lilac bg-fitique-lilac/40">
								<LoaderCircle
									size={35}
									className="animate-spin text-fitique-plum"
								/>
								<span className="absolute inset-2 rounded-full border-t-2 border-fitique-brown/60" />
							</div>
							<p className="serif mt-8 text-4xl text-fitique-plum">
								Reading your Fit Check…
							</p>
							<p className="mt-3 max-w-md text-sm leading-6 text-fitique-ink/65">
								Considering the visual context, the piece you
								selected, and your saved preferences. This
								usually takes a few moments.
							</p>
						</section>
					)}
					{step === 5 && result && (
						<section className="mx-auto max-w-4xl">
							<div className="grid gap-7 lg:grid-cols-[.88fr_1fr] lg:items-center">
								<div className="relative overflow-hidden bg-fitique-sand">
									<img
										src={result.photoUrl || previewUrl}
										alt="Your Fit Check photo"
										className="aspect-[.78] h-full w-full object-cover"
									/>
									<span className="absolute left-4 top-4 bg-fitique-ivory px-3 py-1.5 text-[.6rem] font-extrabold uppercase tracking-widest text-fitique-plum">
										Live Fit Check
									</span>
								</div>
								<div>
									<p className="eyebrow text-fitique-brown">
										Your Fitique result
									</p>
									<h2 className="serif mt-2 text-5xl leading-none text-fitique-plum">
										Try a size{" "}
										<i>{result.recommendedSize}.</i>
									</h2>
									<div className="mt-5 flex items-center gap-2">
										<span className="rounded-full bg-[#dce9dc] px-3 py-1 text-[.65rem] font-extrabold uppercase tracking-[.09em] text-[#345c39]">
											{result.confidence} confidence
										</span>
										<span className="text-xs text-fitique-ink/55">
											Personalized estimate
										</span>
									</div>
									<p className="mt-5 text-sm leading-7 text-fitique-ink/70">
										{result.fitSummary}
									</p>
									<div className="mt-6 grid gap-2">
										{result.considerations.map(
											(consideration) => (
												<span
													key={consideration}
													className="border border-fitique-line bg-white px-3 py-2 text-xs font-bold">
													{consideration}
												</span>
											),
										)}
									</div>
									<div className="mt-6 border-t border-fitique-line pt-5">
										<p className="field-label">
											Stylist note
										</p>
										<p className="serif text-2xl text-fitique-plum">
											{result.styleTip}
										</p>
									</div>
									<div className="mt-7 flex flex-wrap gap-3">
										<button
											onClick={() => {
												if (selectedProduct) {
													addItem(selectedProduct, {
														size: result.recommendedSize,
													});
													toast(
														"Your selected piece is in the bag",
													);
												}
											}}
											className="plum-button focus-ring">
											<ShoppingBag size={15} /> Add piece
											to bag
										</button>
										<button
											onClick={() =>
												toast(
													"Your live Fit Check has been saved to your account.",
												)
											}
											className="ghost-button focus-ring">
											<Save size={15} /> Saved to profile
										</button>
										<button
											onClick={reset}
											className="focus-ring inline-flex items-center gap-2 px-2 text-xs font-extrabold text-fitique-brown hover:text-fitique-plum">
											<RotateCcw size={15} /> Try another
										</button>
									</div>
								</div>
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
