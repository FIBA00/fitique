/* Lavender Lookbook order detail: delivery progress is made tactile and reassuring with a simple visual timeline. */
import {
	ArrowLeft,
	Check,
	Circle,
	MapPin,
	Truck,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";

// ! internal imports 
// # hooks
import { useOrder } from "../hooks/useOrders.js";
import { usePageMeta } from "../../../hooks/usePageMeta.js";
import { formatCurrency } from "../../../lib/utils.js";

// # components
// ? missing internal import
// import EmptyState from "../components/feedback/EmptyState";

import OrderStatus from "../components/orderStatus.jsx";
import DeliveryNotificationPanel from "../components/deliveryNotify.jsx";

const stages = [ "Confirmed", "Preparing", "Out for Delivery", "Delivered" ];

export default function OrderDetails() {
	const { orderId } = useParams();
	const [searchParams] = useSearchParams();
	const { data: order, isLoading } = useOrder(orderId);
	usePageMeta(`Order ${orderId}`, "Follow your boutique delivery progress.");
	if (isLoading)
		return (
			<div className="content-shell py-12">
				<div className="h-80 animate-pulse bg-fitique-paper" />
			</div>
		);
	if (!order)
		return (
			<div className="content-shell py-12">
				{/* Fix-me: missing internal import */}
                {/* <EmptyState
					icon={RefreshCw}
					title="We can’t find that order."
					description="Return to your orders to select an existing delivery record."
					action="View orders"
					to="/orders"
				/> */}
                <h2>Missing internal import EmptyState here !</h2>
			</div>
		);
	const progress = stages.indexOf(order.status);
	const index = progress < 0 ? 0 : progress;
	return (
		<div className="content-shell py-6 lg:py-10">
			<Link
				to="/orders"
				className="focus-ring inline-flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-widest text-fitique-brown hover:text-fitique-plum">
				<ArrowLeft size={15} /> All orders
			</Link>
			{searchParams.get("new") && (
				<div className="mt-5 border border-[#bdd5c0] bg-[#edf6ee] p-4 text-sm text-[#315d37]">
					<span className="font-extrabold">
						Your order is confirmed.
					</span>{" "}
					Your selected delivery alert channels are ready for provider
					connection.
				</div>
			)}
			<div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
				<section>
					<div className="border-b border-fitique-line pb-6">
						<p className="eyebrow text-fitique-brown">
							Order {order.id}
						</p>
						<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
							<h1 className="serif text-4xl text-fitique-plum">
								On its way to you.
							</h1>
							<OrderStatus status={order.status} />
						</div>
						<p className="mt-3 text-sm text-fitique-ink/65">
							{order.delivery.window}
						</p>
					</div>
					<section className="mt-7 bg-fitique-paper p-5">
						<div className="flex gap-3">
							<Truck
								size={20}
								className="shrink-0 text-fitique-plum"
							/>
							<div>
								<p className="font-extrabold">
									{order.delivery.method}
								</p>
								<p className="mt-1 text-sm leading-6 text-fitique-ink/65">
									{order.delivery.address}
								</p>
							</div>
						</div>

						<div className="mt-8 grid grid-cols-4">
							{stages.map((stage, stageIndex) => (
								<div key={stage} className="relative">
									<span
										className={`relative z-10 grid h-7 w-7 place-items-center rounded-full ${stageIndex <= index ? "bg-fitique-plum text-white" : "bg-white text-fitique-line"}`}>
										{stageIndex < index ? (
											<Check size={15} />
										) : (
											<Circle
												size={9}
												fill="currentColor"
											/>
										)}
									</span>
									{stageIndex < stages.length - 1 && (
										<span
											className={`absolute left-7 right-0 top-3.5 h-px ${stageIndex < index ? "bg-fitique-plum" : "bg-fitique-line"}`}
										/>
									)}
								</div>
							))}
						</div>

						<div className="mt-3 grid grid-cols-4 gap-2 text-[.58rem] font-extrabold uppercase leading-4 tracking-[.06em] text-fitique-ink/55">
							{stages.map((stage) => (
								<span key={stage}>{stage}</span>
							))}
						</div>

					</section>
					<section className="mt-8">
						<p className="eyebrow text-fitique-brown">
							Pieces in this order
						</p>
						<div className="mt-4 grid gap-4">
							{order.items.map((item) => (
								<Link
									to={`/products/${item.productId}`}
									key={`${item.productId}-${item.size}`}
									className="focus-ring flex gap-4 border-b border-fitique-line pb-4">
									<img
										src={item.image}
										alt=""
										className="h-20 w-16 object-cover"
									/>
									<div className="flex-1">
										<p className="text-sm font-extrabold">
											{item.name}
										</p>
										<p className="mt-1 text-xs text-fitique-ink/55">
											{item.color} · {item.size} ·
											Quantity {item.quantity}
										</p>
									</div>
									<p className="text-sm font-bold text-fitique-plum">
										{formatCurrency(
											item.price * item.quantity,
										)}
									</p>
								</Link>
							))}
						</div>
					</section>
				</section>
				<aside className="grid h-fit gap-5 lg:sticky lg:top-24">
					<section className="bg-fitique-paper p-5">
						<p className="eyebrow text-fitique-brown">
							Order summary
						</p>
						<dl className="mt-5 grid gap-3 text-sm">
							<div className="flex justify-between">
								<dt className="text-fitique-ink/65">
									Order placed
								</dt>
								<dd>{order.date}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-fitique-ink/65">Total</dt>
								<dd className="font-extrabold text-fitique-plum">
									{formatCurrency(order.total)}
								</dd>
							</div>
						</dl>
						<div className="mt-6 border-t border-fitique-line pt-5">
							<p className="flex items-center gap-2 text-sm font-bold">
								<MapPin
									size={16}
									className="text-fitique-plum"
								/>{" "}
								Delivery notes
							</p>
							<p className="mt-2 text-xs leading-5 text-fitique-ink/60">
								You can return a piece that does not feel right
								after you have tried it at home.
							</p>
						</div>
					</section>
					<DeliveryNotificationPanel order={order} />
				</aside>
			</div>
		</div>
	);
}
