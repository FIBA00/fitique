/* Lavender Lookbook home: an asymmetric editorial spread that turns boutique discovery into a sequence of confident choices. */
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function SectionHeading({ label, title, copy, action, to }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow text-fitique-brown">{label}</p>
        <h2 className="serif mt-2 text-4xl leading-none tracking-[-.035em] text-fitique-plum sm:text-5xl">
          {title}
        </h2>
        {copy && (
          <p className="mt-3 max-w-xl text-sm leading-6 text-fitique-ink/65">
            {copy}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={to}
          className="focus-ring inline-flex w-fit items-center gap-2 border-b border-fitique-plum pb-1 text-[.68rem] font-extrabold uppercase tracking-[.1em] text-fitique-plum hover:gap-3"
        >
          {action}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
