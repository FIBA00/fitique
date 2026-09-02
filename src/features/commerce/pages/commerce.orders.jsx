/* Lavender Lookbook orders: delivery status is presented like a personal record, not a logistics dashboard. */
import { ArrowRight, PackageSearch, RefreshCw } from "lucide-react";
import { Link } from "react-router";

// ! internal imports
//  # hooks
import { useOrders } from "../hooks/useOrders.js";
import { usePageMeta } from "../../../hooks/usePageMeta.js";
import { formatCurrency } from "../../../lib/utils.js";

// # components
import OrderStatus from "../components/orderStatus.jsx";
import EmptyState from "../components/feedback/EmptyState";

export default function Orders() {
  usePageMeta("Orders", "Follow your Fitique orders and delivery progress.");
  const { data: orders, isLoading, isError, refetch } = useOrders();

  if (isLoading)
    return (
      <div className="content-shell py-14">
        <div className="h-12 w-48 animate-pulse bg-fitique-paper" />
        <div className="mt-7 grid gap-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse bg-fitique-paper" />
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="content-shell py-12">
        <EmptyState
          icon={RefreshCw}
          title="We couldn’t load your orders."
          description="The boutique record is taking a moment. Please try again."
          action="Retry"
          to="/orders"
        />
      </div>
    );

  if (!orders?.length)
    return (
      <div className="content-shell py-12">
        <EmptyState
          icon={PackageSearch}
          title="No orders yet."
          description="When a piece is on its way, its delivery story will live here."
        />
      </div>
    );

  return (
    <div className="content-shell py-8 lg:py-12">
      <div className="border-b border-fitique-line pb-6">
        <p className="eyebrow text-fitique-brown">Your delivery record</p>
        <h1 className="serif mt-2 text-5xl tracking-[-.04em] text-fitique-plum">
          Orders
        </h1>
      </div>
      <div className="mt-6 grid gap-3">
        {orders.map((order) => (
          <Link
            to={`/orders/${order.id}`}
            key={order.id}
            className="focus-ring grid gap-4 border border-fitique-line bg-white p-4 hover:border-fitique-plum sm:grid-cols-[1fr_auto_auto] sm:items-center sm:p-5"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-extrabold">Order {order.id}</p>
                <OrderStatus status={order.status} />
              </div>
              <p className="mt-2 text-xs text-fitique-ink/55">
                {order.date} · {order.items.length}{" "}
                {order.items.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <p className="text-sm font-extrabold text-fitique-plum">
              {formatCurrency(order.total)}
            </p>
            <span className="inline-flex items-center gap-2 text-[.67rem] font-extrabold uppercase tracking-widest text-fitique-brown">
              Details <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
