import { Gift, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ! internal import
import { useCartStore } from "../hooks/useCart.js";

export default function CartSupportPanel() {
  const {
    promotionCode,
    setPromotionCode,
    orderNote,
    setOrderNote,
    deliveryPreference,
    setDeliveryPreference,
  } = useCartStore();
  const [draftCode, setDraftCode] = useState(promotionCode);

  function saveCode() {
    setPromotionCode(draftCode);
    toast(
      draftCode.trim()
        ? "Your offer code is saved for secure checkout review."
        : "Offer code removed.",
    );
  }

  return (
    <section className="mt-8 grid gap-5 border-t border-fitique-line pt-7 md:grid-cols-2">
      <div className="border border-fitique-line bg-fitique-paper p-5">
        <div className="flex gap-3">
          <Tag size={19} className="mt-0.5 text-fitique-plum" />
          <div>
            <p className="eyebrow text-fitique-brown">
              An offer, if you have one
            </p>
            <h2 className="serif mt-1 text-2xl text-fitique-plum">
              Keep the code close.
            </h2>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <input
            value={draftCode}
            onChange={(event) => setDraftCode(event.target.value)}
            placeholder="Offer code"
            className="field-input min-w-0 flex-1 text-sm uppercase"
            aria-label="Offer code"
          />
          <button
            onClick={saveCode}
            className="ghost-button focus-ring shrink-0"
          >
            Save
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-fitique-ink/60">
          The final offer eligibility and value are confirmed securely at
          checkout when your promotion service is connected.
        </p>
      </div>
      <div className="border border-fitique-line bg-fitique-ivory p-5">
        <div className="flex gap-3">
          <Gift size={19} className="mt-0.5 text-fitique-plum" />
          <div>
            <p className="eyebrow text-fitique-brown">A small note</p>
            <h2 className="serif mt-1 text-2xl text-fitique-plum">
              Make it personal.
            </h2>
          </div>
        </div>
        <textarea
          value={orderNote}
          onChange={(event) => setOrderNote(event.target.value)}
          maxLength={240}
          placeholder="A gift note or delivery instruction"
          className="field-input mt-5 min-h-24 resize-y text-sm"
        />
        <p className="mt-2 text-right text-[.65rem] text-fitique-ink/50">
          {orderNote.length}/240
        </p>
      </div>
      <div className="border border-fitique-line bg-fitique-ivory p-5 md:col-span-2">
        <div className="flex gap-3">
          <MapPin size={19} className="mt-0.5 text-fitique-plum" />
          <div>
            <p className="eyebrow text-fitique-brown">Delivery preference</p>
            <h2 className="serif mt-1 text-2xl text-fitique-plum">
              Choose the pace that suits you.
            </h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["Standard delivery", "Express delivery", "Collect when ready"].map(
            (option) => (
              <label
                key={option}
                className={`cursor-pointer border p-3 text-sm ${deliveryPreference === option ? "border-fitique-plum bg-fitique-lilac/40" : "border-fitique-line bg-white"}`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={option}
                  checked={deliveryPreference === option}
                  onChange={() => setDeliveryPreference(option)}
                />
                <span className="block font-extrabold text-fitique-plum">
                  {option}
                </span>
                <span className="mt-1 block text-xs leading-5 text-fitique-ink/60">
                  {option === "Standard delivery"
                    ? "A calm, considered arrival window."
                    : option === "Express delivery"
                      ? "The fastest eligible option, confirmed securely."
                      : "We’ll let you know when your edit is ready."}
                </span>
              </label>
            ),
          )}
        </div>
        <p className="mt-4 text-xs leading-5 text-fitique-ink/60">
          Delivery availability, price, and arrival times are confirmed with
          your address during secure checkout.
        </p>
      </div>
    </section>
  );
}
