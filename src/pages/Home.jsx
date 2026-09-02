/* Lavender Lookbook home: an asymmetric editorial spread that turns boutique discovery into a sequence of confident choices. */
import {
  ArrowRight,
  Check,
  Heart,
  PackageCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router";

// ! internal imports 
import { useProducts, useCategories } from "../hooks/useProducts";
import { outfitPieces } from "../data/data.products.js";
import { usePageMeta } from "../hooks/usePageMeta";

import ProductGrid, {
  ProductSkeleton,
} from "../features/products/components/product.Grid.jsx";


import SectionHeading from "../components/heading.jsx";

export default function Home() {
  usePageMeta(
    undefined,
    "Discover boutique fashion, curated outfits, and Fit Check guidance with Fitique."
  );
  const { data: newArrivals, isLoading } = useProducts({ sort: "newest" });
  const { data: categories } = useCategories();
  return (
    <div>
      <section className="content-shell grid gap-8 py-8 lg:grid-cols-[.9fr_1.22fr] lg:items-stretch lg:py-12">
        <div className="flex flex-col justify-between bg-fitique-paper px-6 py-10 sm:px-10 lg:py-14">
          <div>
            <p className="eyebrow text-fitique-brown">
              A more personal way to shop
            </p>
            <h1 className="serif mt-5 max-w-md text-5xl leading-[.94] tracking-[-.05em] text-fitique-plum sm:text-6xl lg:text-7xl">
              Find your
              <br />
              <i>perfect fit.</i>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-fitique-ink/70">
              Boutique pieces, considered pairings, and a fit-check experience
              designed to make the decision feel easier.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/fit-check" className="plum-button focus-ring">
              Start Fit Check <Sparkles size={15} />
            </Link>
            <Link to="/products" className="ghost-button focus-ring">
              Explore collection <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 border-t border-fitique-line pt-5 text-[.66rem] font-extrabold uppercase tracking-[.1em] text-fitique-ink/60">
            <span>Curated edit</span>
            <span>Easy returns</span>
            <span>Delivered to you</span>
          </div>
        </div>
        <div className="relative min-h-[29rem] overflow-hidden bg-fitique-sand sm:min-h-[36rem]">
          <img
            src="/manus-storage/fitique-hero_801cbec7.jpg"
            alt="Model wearing softly tailored neutral fashion"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-fitique-ink/70 via-fitique-ink/20 to-transparent p-5 sm:p-7">
            <div className="max-w-[16rem] text-white">
              <p className="eyebrow text-white/75">Spring chapter 01</p>
              <p className="serif mt-2 text-2xl leading-tight">
                Soft tailoring, easy confidence.
              </p>
            </div>
            <Link
              to="/products?category=women"
              className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-fitique-ivory text-fitique-plum hover:bg-white"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="content-shell py-12 lg:py-20">
        <SectionHeading
          label="Freshly considered"
          title="New arrivals"
          copy="A small edit of pieces worth making room for."
          action="View all arrivals"
          to="/products?sort=newest"
        />
        <div className="mt-8">
          {isLoading ? (
            <ProductSkeleton />
          ) : (
            <ProductGrid products={newArrivals?.slice(0, 4) || []} priority />
          )}
        </div>
      </section>
      <section className="my-4 bg-fitique-lilac/55 py-12 lg:my-10 lg:py-20">
        <div className="content-shell grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div className="relative min-h-[25rem] overflow-hidden bg-fitique-paper">
            <img
              src="/manus-storage/fitique-fit-check_48d7e22a.jpg"
              alt="Woman preparing for a fit check"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 max-w-[15rem] bg-fitique-ivory/95 p-4 soft-shadow">
              <p className="eyebrow text-fitique-brown">
                A considered recommendation
              </p>
              <p className="serif mt-2 text-xl text-fitique-plum">
                Your measurements, your style, a clearer next step.
              </p>
            </div>
          </div>
          <div className="px-1 lg:px-10">
            <p className="eyebrow text-fitique-brown">Meet Fit Check</p>
            <h2 className="serif mt-3 max-w-md text-4xl leading-[.98] tracking-[-.035em] text-fitique-plum sm:text-5xl">
              Not sure what fits? <i>Start with you.</i>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-fitique-ink/70">
              Share a photo, choose the piece you are considering, then explore
              a guided size and outfit recommendation. This MVP demonstrates the
              experience using sample guidance.
            </p>
            <div className="mt-7 grid gap-3 text-sm">
              {[
                "Upload a photo securely in your browser",
                "Select what you are considering",
                "Receive a clear, sample fit recommendation",
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-fitique-plum text-white">
                    <Check size={14} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <Link to="/fit-check" className="plum-button focus-ring mt-8">
              Try Fit Check <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="content-shell py-12 lg:py-20">
        <SectionHeading
          label="The boutique, by mood"
          title="A place for every part of your wardrobe"
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(categories || []).map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className={`focus-ring group relative min-h-[15rem] overflow-hidden bg-fitique-paper ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <img
                src={category.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fitique-ink/80 via-fitique-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="serif text-2xl">{category.name}</p>
                <p className="mt-1 text-xs leading-5 text-white/80">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-fitique-paper py-12 lg:py-20">
        <div className="content-shell">
          <SectionHeading
            label="An easier way to style it"
            title="Complete the look"
            copy="Build an outfit, not just a cart. These pieces were selected to work together."
            action="Shop the edit"
            to="/products"
          />
          <div className="mt-9 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative min-h-[26rem] overflow-hidden">
              <img
                src="/manus-storage/fitique-complete-look_7e7adb5a.jpg"
                alt="A complete outfit arranged on ivory fabric"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="grid content-start gap-0 border-t border-fitique-line">
              {outfitPieces.map((piece, index) => (
                <Link
                  key={piece.id}
                  to={`/products/${piece.id}`}
                  className="focus-ring flex items-center gap-4 border-b border-fitique-line py-4 hover:bg-white/60"
                >
                  <span className="serif w-7 text-2xl text-fitique-brown/70">
                    0{index + 1}
                  </span>
                  <img
                    src={piece.image}
                    alt=""
                    className="h-16 w-12 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{piece.name}</p>
                    <p className="mt-1 text-xs text-fitique-ink/55">
                      {piece.type}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-fitique-plum" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="content-shell grid gap-px bg-fitique-line py-12 sm:grid-cols-3 lg:py-16">
        {[
          [
            Sparkles,
            "Fit Check",
            "A calmer way to narrow down size and styling.",
          ],
          [
            Truck,
            "Boutique delivery",
            "Your selected pieces, delivered to try at home.",
          ],
          [
            PackageCheck,
            "Easy returns",
            "Keep what feels right; return what doesn’t.",
          ],
        ].map(([Icon, title, copy]) => (
          <div key={title} className="bg-fitique-ivory px-6 py-7">
            <Icon size={21} strokeWidth={1.4} className="text-fitique-plum" />
            <p className="serif mt-5 text-2xl text-fitique-plum">{title}</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-fitique-ink/65">
              {copy}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
