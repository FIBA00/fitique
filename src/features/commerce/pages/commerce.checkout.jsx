/* Lavender Lookbook checkout: a quiet address and secure-payment handoff. */
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	ChevronRight,
	LoaderCircle,
	LockKeyhole,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

// ! internal imports
// # hooks
import { useCartStore } from "../hooks/useCart.js";
import { useCreatePaymentHandoff } from "../hooks/useDelivery.js";
import { usePageMeta } from "../../../hooks/usePageMeta";
import { orderService } from "../api/orders.api.js";

// # utils
import { formatCurrency } from "../../../lib/utils";
import { queryKeys } from "../../../lib/queryConfig";
import { useSessionStore } from "../../auth/hooks/useSession";

// # components
// ? missing internal import
import EmptyState from "../components/feedback/EmptyState";
import PaymentMethodPlaceholder from "../components/checkoutPayment.jsx";
import FormField from "../components/formField.jsx";

const schema = z.object({
	email: z.string().email("Please enter a valid email."),
	phone: z.string().min(7, "Please enter a phone number."),
	name: z.string().min(2, "Please enter your name."),
	address: z.string().min(5, "Please enter your delivery address."),
	city: z.string().min(2, "Please enter your city."),
	postal: z.string().min(3, "Please enter your postal code."),
	deliveryMethod: z.enum(["Boutique delivery", "Collection point"]),
	paymentMethod: z.string().min(1, "Choose a payment method."),
});

// Todo: this code is too much break down into components and plug and play.
export default function Checkout() {
	usePageMeta("Checkout", "Complete your Fitique boutique delivery details.");
	const { items, clearCart, promotionCode, orderNote, deliveryPreference } =
		useCartStore();
	const user = useSessionStore((state) => state.user);
	const navigate = useNavigate();
	const client = useQueryClient();
	const paymentHandoff = useCreatePaymentHandoff();
	const subtotal = items.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);
	const delivery = items.length ? 12 : 0;
	const total = subtotal + delivery;

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: user?.email || "",
			phone: user?.phone || "",
			name: user?.name || "",
			address: user?.addresses?.[0]?.line1 || "",
			city: user?.addresses?.[0]?.city || "",
			postal: "11211",
			deliveryMethod: "Boutique delivery",
			paymentMethod: "card",
		},
	} );
	
	const mutation = useMutation({
		mutationFn: async (payload) => {
			const order = await orderService.create(payload);
			const handoff = await paymentHandoff.mutateAsync({
				orderId: order.id,
				method: payload.payment.methodId,
				returnUrl: `${window.location.origin}/order-confirmation/${order.id}`,
			});
			return { ...order, payment: handoff || order.payment };
		},
		onSuccess: (order) => {
			clearCart();
			client.invalidateQueries({ queryKey: queryKeys.orders.list() });
			client.setQueryData(queryKeys.orders.detail(order.id), order);
			navigate(`/order-confirmation/${order.id}`, { state: { order } });
		},
	} );
	
	function placeOrder(values) {
		mutation.mutate({
			...values,
			total,
			promotionCode,
			orderNote,
			deliveryPreference,
			payment: {
				methodId: values.paymentMethod,
				method: values.paymentMethod,
				status: "Preparing your secure payment step.",
			},
			items: items.map(
				({ id, name, image, size, color, quantity, price }) => ({
					productId: id,
					name,
					image,
					size,
					color,
					quantity,
					price,
				}),
			),
			address: `${values.address}, ${values.city}, ${values.postal}`,
		});
	}
	if (!items.length)
		return (
			<div className="content-shell py-10 lg:py-16">
				{/* Fix-me: missing component import   */}
				{/* <EmptyState
					icon={LockKeyhole}
					title="Your checkout is clear."
					description="Choose a piece you love first, then return here when you are ready to arrange delivery."
				/> */}
				<h2>Missing empty state component here</h2>
			</div>
		);

	const submitting =
		isSubmitting || mutation.isPending || paymentHandoff.isPending;

	return (
		<div className="content-shell py-6 lg:py-10">
			<Link
				to="/cart"
				className="focus-ring inline-flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-widest text-fitique-brown hover:text-fitique-plum">
				<ArrowLeft size={15} /> Back to your bag
			</Link>
			<div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem]">
				<form
					onSubmit={handleSubmit(placeOrder)}
					aria-busy={submitting}
					className="relative grid gap-7">
					<div className="border-b border-fitique-line pb-6">
						<p className="eyebrow text-fitique-brown">
							A few details
						</p>
						<h1 className="serif mt-2 text-5xl tracking-[-.04em] text-fitique-plum">
							Checkout
						</h1>
					</div>
					<section>
						<div className="mb-4 flex items-center gap-3">
							<span className="grid h-7 w-7 place-items-center rounded-full bg-fitique-plum text-xs font-extrabold text-white">
								1
							</span>
							<h2 className="serif text-2xl text-fitique-plum">
								Contact information
							</h2>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								label="Email address"
								name="email"
								type="email"
								register={register}
								errors={errors}
								placeholder="you@example.com"
							/>
							<FormField
								label="Phone"
								name="phone"
								register={register}
								errors={errors}
								placeholder="For delivery updates"
							/>
						</div>
					</section>
					<section className="border-t border-fitique-line pt-7">
						<div className="mb-4 flex items-center gap-3">
							<span className="grid h-7 w-7 place-items-center rounded-full bg-fitique-plum text-xs font-extrabold text-white">
								2
							</span>
							<h2 className="serif text-2xl text-fitique-plum">
								Delivery address
							</h2>
						</div>
						<div className="grid gap-4">
							<FormField
								label="Full name"
								name="name"
								register={register}
								errors={errors}
								placeholder="Your name"
							/>
							<FormField
								label="Address"
								name="address"
								register={register}
								errors={errors}
								placeholder="Street address"
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									label="City"
									name="city"
									register={register}
									errors={errors}
									placeholder="City"
								/>
								<FormField
									label="Postal code"
									name="postal"
									register={register}
									errors={errors}
									placeholder="Postal code"
								/>
							</div>
						</div>
					</section>
					<section className="border-t border-fitique-line pt-7">
						<div className="mb-4 flex items-center gap-3">
							<span className="grid h-7 w-7 place-items-center rounded-full bg-fitique-plum text-xs font-extrabold text-white">
								3
							</span>
							<h2 className="serif text-2xl text-fitique-plum">
								How should it arrive?
							</h2>
						</div>
						<div className="grid gap-3">
							{["Boutique delivery", "Collection point"].map(
								(method) => (
									<label
										key={method}
										className="flex cursor-pointer items-start gap-3 border border-fitique-line bg-white p-4 has-checked:border-fitique-plum has-checked:bg-fitique-lilac/35">
										<input
											type="radio"
											value={method}
											{...register("deliveryMethod")}
											className="mt-1 accent-fitique-plum"
										/>
										<span>
											<span className="block text-sm font-extrabold">
												{method}
											</span>
											<span className="mt-1 block text-xs leading-5 text-fitique-ink/60">
												{method === "Boutique delivery"
													? "Delivered to your door in a confirmed arrival window."
													: "Collect nearby when it suits your schedule."}
											</span>
										</span>
									</label>
								),
							)}
						</div>
					</section>
					<PaymentMethodPlaceholder
						value={watch("paymentMethod")}
						onChange={(method) =>
							setValue("paymentMethod", method, {
								shouldValidate: true,
							})
						}
					/>
					{mutation.isError && (
						<p
							role="alert"
							className="border border-[#ddb6b6] bg-[#fbebeb] p-3 text-sm text-[#893838]">
							We could not prepare your secure payment step.
							Please review your details and try again.
						</p>
					)}
					<button
						type="submit"
						disabled={submitting}
						className="plum-button focus-ring w-full disabled:opacity-60">
						{submitting
							? "Preparing your secure next step…"
							: "Continue to payment"}
						<ChevronRight size={15} />
					</button>
					<AnimatePresence>
						{submitting && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.18 }}
								className="absolute inset-0 z-10 grid place-items-center bg-fitique-ivory/88 p-6 text-center">
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.22 }}
									className="border border-fitique-line bg-fitique-paper p-8 shadow-[0_16px_45px_rgba(73,53,81,.14)]">
									<LoaderCircle
										className="mx-auto animate-spin text-fitique-plum"
										size={31}
									/>
									<p className="serif mt-5 text-3xl text-fitique-plum">
										Setting your next step.
									</p>
									<p className="mt-2 max-w-xs text-sm leading-6 text-fitique-ink/65">
										Your selected method is being prepared
										for a secure payment handoff.
									</p>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</form>
				<aside className="h-fit bg-fitique-paper p-5 lg:sticky lg:top-24">
					<p className="eyebrow text-fitique-brown">Your order</p>
					<div className="mt-4 grid gap-4">
						{items.map((item) => (
							<div key={item.lineId} className="flex gap-3">
								<img
									src={item.image}
									alt=""
									className="h-16 w-12 object-cover"
								/>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-bold">
										{item.name}
									</p>
									<p className="mt-1 text-xs text-fitique-ink/55">
										{item.color} · {item.size} ·{" "}
										{item.quantity}×
									</p>
								</div>
								<span className="text-sm font-bold text-fitique-plum">
									{formatCurrency(item.price * item.quantity)}
								</span>
							</div>
						))}
					</div>
					<dl className="mt-5 grid gap-3 border-t border-fitique-line pt-4 text-sm">
						<div className="flex justify-between">
							<dt>Subtotal</dt>
							<dd>{formatCurrency(subtotal)}</dd>
						</div>
						<div className="flex justify-between">
							<dt>Delivery</dt>
							<dd>{formatCurrency(delivery)}</dd>
						</div>
						<div className="flex justify-between font-extrabold text-fitique-plum">
							<dt>Total</dt>
							<dd>{formatCurrency(total)}</dd>
						</div>
					</dl>
					<p className="mt-5 flex gap-2 text-xs leading-5 text-fitique-ink/55">
						<LockKeyhole
							size={14}
							className="mt-.5 shrink-0 text-fitique-plum"
						/>{" "}
						Fitique carries your preferred payment path to the
						secure provider step without collecting payment details.
					</p>
				</aside>
			</div>
		</div>
	);
}
