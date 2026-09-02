/* Lavender Lookbook mobile navigation: a light, tactile bottom dock with compact plum active states. */
import { Grid2X2, Heart, House, ShoppingBag, UserRound } from "lucide-react";
import { NavLink } from "react-router";
import { useCartStore } from "../../features/commerce/hooks/useCart";

const links = [
  { to: "/", label: "Home", icon: House },
  { to: "/products", label: "Browse", icon: Grid2X2 },
  { to: "/cart", label: "Bag", icon: ShoppingBag },
  { to: "/wishlist", label: "Saved", icon: Heart },
  { to: "/profile", label: "Profile", icon: UserRound },
];
export default function MobileNavigation() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-fitique-line bg-fitique-ivory/95 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `focus-ring relative flex flex-col items-center gap-1 py-1 text-[.58rem] font-bold ${isActive ? "text-fitique-plum" : "text-fitique-ink/55"}`
            }
          >
            <span className="relative">
              <Icon size={18} strokeWidth={1.7} />
              {to === "/cart" && count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-3.5 w-3.5 place-items-center rounded-full bg-fitique-plum text-[.52rem] text-white">
                  {count}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
