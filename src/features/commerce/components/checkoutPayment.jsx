import { BadgeInfo, CreditCard, Landmark, Smartphone } from "lucide-react";

// ! internal imports
import { usePaymentMethods } from "../hooks/usePayment.js";

const iconByMethod = { card: CreditCard, wallet: Smartphone, bank: Landmark };

export default function PaymentMethodPlaceholder({ value, onChange }) {
  const { data: methods = [], isLoading } = usePaymentMethods();
  return (
    <section className="border-t border-fitique-line pt-7">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-fitique-plum text-xs font-extrabold text-white">
              4
            </span>
            <h2 className="serif text-2xl text-fitique-plum">Payment</h2>
          </div>
          <p className="mt-2 text-sm text-fitique-ink/65">
            Choose the payment path that suits you. Your secure next step will
            appear after order review.
          </p>
        </div>
        <span className="shrink-0 border border-fitique-plum/30 bg-fitique-lilac/45 px-2 py-1 text-[.58rem] font-extrabold uppercase tracking-[.09em] text-fitique-plum">
          Secure handoff
        </span>
      </div>
      {isLoading ? (
        <div className="grid gap-3">
          <div className="h-20 animate-pulse bg-fitique-paper" />
          <div className="h-20 animate-pulse bg-fitique-paper" />
        </div>
      ) : (
        <div className="grid gap-3">
          {methods.map((method) => {
            const Icon = iconByMethod[method.id] || CreditCard;
            return (
              <label
                key={method.id}
                className={`flex cursor-pointer items-start gap-3 border p-4 transition has-checked:border-fitique-plum has-checked:bg-fitique-lilac/35 ${value === method.id ? "border-fitique-plum bg-fitique-lilac/35" : "border-fitique-line bg-white hover:border-fitique-plum"}`}
              >
                <input
                  type="radio"
                  value={method.id}
                  checked={value === method.id}
                  onChange={() => onChange(method.id)}
                  className="mt-1 accent-fitique-plum"
                />
                <Icon size={19} className="mt-0.5 shrink-0 text-fitique-plum" />
                <span>
                  <span className="block text-sm font-extrabold">
                    {method.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-fitique-ink/60">
                    {method.detail}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
      <p className="mt-4 flex gap-2 border-l-2 border-fitique-brown bg-fitique-paper px-3 py-2 text-xs leading-5 text-fitique-ink/65">
        <BadgeInfo size={15} className="mt-0.5 shrink-0 text-fitique-brown" />{" "}
        <span>
          <strong className="text-fitique-ink">A calm note:</strong> payment
          details are never entered into Fitique. Your chosen provider will
          present its own secure page or embedded fields at the next step.
        </span>
      </p>
    </section>
  );
}
