/* Lavender Lookbook brand mark: a generous hanger symbol and high-contrast editorial wordmark. */
import { Link } from "react-router";

export function HangerMark({ className = "", strokeWidth = 1.45 }) {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}><path d="M25.3 8.6c0-2.1-1.2-3.7-3.1-3.7-1.8 0-3.1 1.3-3.1 3.1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" /><path d="M22.1 10.4c0 4.7-4.7 6.2-7.4 8.9l-8.1 8.1c-2 2-0.6 5.4 2.2 5.4h30.4c2.8 0 4.1-3.4 2.2-5.4l-8.1-8.1c-2.7-2.7-7.4-4.2-7.4-8.9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Brand({ compact = false }) {
  return <Link to="/" aria-label="Fitique home" className="focus-ring inline-flex items-center gap-2.5 text-fitique-plum no-underline">
    <span className={`relative grid place-items-center border border-fitique-line bg-fitique-ivory ${compact ? "h-7 w-7" : "h-9 w-9"}`}><HangerMark strokeWidth={1.45} className="h-[72%] w-[72%] text-fitique-plum" /><img src="/manus-storage/fitique-logo_ef915542.png" onError={(event) => { event.currentTarget.style.opacity = "0"; }} alt="" className="absolute inset-0 h-full w-full object-contain" /></span>
    {!compact && <span className="serif -mt-1 text-[2.05rem] leading-none tracking-[-.06em]">Fitique</span>}
  </Link>;
}
