/* Lavender Lookbook not-found state: a graceful editorial escape route back to the boutique rather than a dead end. */
import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router";
import Brand from "../components/Brand";
import { usePageMeta } from "../hooks/usePageMeta";
export default function NotFound() { usePageMeta("Not found", "The Fitique page you requested is not available."); return <main className="grid min-h-screen place-items-center bg-fitique-paper px-6"><div className="max-w-md text-center"><Brand /><SearchX size={34} strokeWidth={1.2} className="mx-auto mt-14 text-fitique-plum" /><p className="eyebrow mt-5 text-fitique-brown">A missing stitch</p><h1 className="serif mt-2 text-5xl text-fitique-plum">That page has moved on.</h1><p className="mt-4 text-sm leading-7 text-fitique-ink/65">The path may have changed, but the boutique is still here whenever you are ready to browse.</p><Link to="/" className="plum-button focus-ring mt-8"><ArrowLeft size={15} /> Return home</Link></div></main>; }
