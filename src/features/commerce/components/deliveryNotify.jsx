import {
  BellRing,
  Check,
  Clock3,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";

// ! internal imports
// ? missing internal import

import { Switch } from "../ui/switch";

import {
  useDeliveryEvents,
  useDeliveryPreferences,
  useDeliveryRecord,
  useSaveDeliveryPreferences,
} from "../hooks/useDelivery.js";

import { timestamp } from "../../../lib/utils.js";

const preferenceOptions = [
  {
    id: "email",
    title: "Email updates",
    detail: "Order confirmations, delivery windows, and arrival notices.",
    icon: Mail,
  },
  {
    id: "sms",
    title: "Text messages",
    detail: "Time-sensitive delivery moments sent to your preferred number.",
    icon: Smartphone,
  },
  {
    id: "push",
    title: "Push alerts",
    detail:
      "In-app and device alerts while Fitique is available on your device.",
    icon: BellRing,
  },
];

export default function DeliveryNotificationPanel({ order }) {
  const recordQuery = useDeliveryRecord(order);
  const eventsQuery = useDeliveryEvents(order);
  const preferencesQuery = useDeliveryPreferences(order.id);
  const savePreferences = useSaveDeliveryPreferences();
  const preferences = preferencesQuery.data || {
    email: true,
    sms: false,
    push: true,
  };
  const events = eventsQuery.data || [];

  function update(channel, checked) {
    savePreferences.mutate({
      orderId: order.id,
      preferences: { ...preferences, [channel]: checked },
    });
  }

  return (
    <section className="border border-fitique-line bg-fitique-ivory p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <BellRing size={21} className="mt-0.5 shrink-0 text-fitique-plum" />
          <div>
            <p className="eyebrow text-fitique-brown">Delivery alerts</p>
            <h2 className="serif mt-1 text-2xl text-fitique-plum">
              Stay close to the delivery.
            </h2>
          </div>
        </div>
        <span className="shrink-0 border border-fitique-plum/30 bg-fitique-lilac/40 px-2 py-1 text-[.58rem] font-extrabold uppercase tracking-[.09em] text-fitique-plum">
          Your choices
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-fitique-ink/65">
        Choose the updates that feel helpful. Your selections stay linked to
        this delivery and will sync as soon as your messaging service is ready.
      </p>
      <div className="mt-5 divide-y divide-fitique-line border-y border-fitique-line">
        {preferenceOptions.map(({ id, title, detail, icon: Icon }) => (
          <div key={id} className="flex items-center gap-3 py-3">
            <Icon size={17} className="shrink-0 text-fitique-brown" />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold">{title}</span>
              <span className="mt-0.5 block text-[.68rem] leading-4 text-fitique-ink/55">
                {detail}
              </span>
            </span>
            <Switch
              checked={Boolean(preferences[id])}
              onCheckedChange={(checked) => update(id, checked)}
              disabled={savePreferences.isPending}
              aria-label={`Toggle ${title}`}
              className="data-[state=checked]:bg-fitique-plum! data-[state=unchecked]:bg-fitique-line!"
            />
          </div>
        ))}
      </div>

      {savePreferences.isPending && (
        <p className="mt-3 text-[.68rem] font-bold text-fitique-brown">
          Saving your delivery choices…
        </p>
      )}

      <div className="mt-6 border-t border-fitique-line pt-5">
        <p className="field-label">Tracking reference</p>
        {recordQuery.isLoading ? (
          <div className="mt-2 h-10 animate-pulse bg-fitique-paper" />
        ) : recordQuery.data?.trackingId ? (
          <div className="mt-2 border-l-2 border-fitique-plum bg-fitique-lilac/30 px-3 py-2 text-xs">
            <strong className="text-fitique-plum">
              {recordQuery.data.carrier || "Delivery partner"}
            </strong>
            <span className="ml-2 text-fitique-ink/65">
              {recordQuery.data.trackingId}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-xs leading-5 text-fitique-ink/60">
            Your carrier and tracking reference will appear here once a delivery
            is assigned.
          </p>
        )}
      </div>

      <div className="mt-6">
        <p className="field-label">A closer look at your delivery</p>
        {eventsQuery.isLoading ? (
          <div className="mt-3 grid gap-2">
            <div className="h-5 animate-pulse bg-fitique-paper" />
            <div className="h-5 animate-pulse bg-fitique-paper" />
          </div>
        ) : events.length ? (
          <ol className="mt-3 grid gap-3">
            {events.map((event, index) => (
              <li
                key={event.id || `${event.status}-${index}`}
                className="flex gap-3 text-xs"
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full ${event.occurredAt ? "bg-fitique-plum text-white" : "bg-fitique-paper text-fitique-brown"}`}
                >
                  {event.occurredAt ? <Check size={12} /> : index + 1}
                </span>
                <span className="min-w-0 pt-0.5">
                  <strong className="text-fitique-ink">{event.status}</strong>
                  <span className="ml-1 text-fitique-ink/55">
                    {event.detail}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[.65rem] text-fitique-brown">
                    <Clock3 size={11} /> {timestamp(event.occurredAt)}
                    {event.trackingId ? ` · ${event.trackingId}` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-xs leading-5 text-fitique-ink/60">
            Your delivery story will begin here when its first update arrives.
          </p>
        )}
      </div>

      <p className="mt-5 border-l-2 border-fitique-brown bg-fitique-paper px-3 py-2 text-[.68rem] leading-5 text-fitique-ink/60">
        <MessageSquare className="mr-1 inline text-fitique-brown" size={13} />{" "}
        Every alert choice, delivery time, tracking reference, and carrier event
        is ready to receive live data from your services.
      </p>
    </section>
  );
}
