/* Lavender Lookbook catalogue: controlled filtering without a generic dashboard, keeping the imagery in command. */
import {
  ArrowUpRight,
  BookmarkCheck,
  BookmarkPlus,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useMemo } from "react";

// ! internal imports
import { HangerMark } from "../../../components/brand.jsx";
import ProductGrid from "../components/product.Grid.jsx";
import ProductSkeleton from "../components/product.Grid.jsx";

// # hooks
import { useProducts } from "../hooks/useProducts.js";
import { useDiscoveryStore } from "../hooks/useDiscovery.js";
import { usePageMeta } from "../../../hooks/usePageMeta.hs";
import { setQuery, toParams } from "../../../lib/utils.js";


const categories = [ "All", "Women", "Men", "Kids", "Shoes", "Accessories" ];

// Todo: This code is too large break down to small components
export default function Products() {
  usePageMeta(
    "Shop",
    "Browse Fitique’s collection of considered boutique pieces."
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "newest",
      maxPrice: searchParams.get("maxPrice") || "",
      size: searchParams.get("size") || "",
      availability: searchParams.get("availability") === "in-stock",
    }),
    [searchParams]
  );
  const { data: items, isLoading } = useProducts(filters);
  const { savedSearches, saveSearch, removeSearch } = useDiscoveryStore();
  const activeFilters = [
    filters.category,
    filters.size,
    filters.maxPrice,
    filters.availability,
  ].filter(Boolean).length;
  const featuredProduct =
    !filters.category &&
    !filters.search &&
    !filters.size &&
    !filters.maxPrice &&
    !filters.availability
      ? items?.find(product => product.newArrival)
      : null;
  
  function clearFilters() {
    const fresh = new URLSearchParams();
    if (filters.search) fresh.set("search", filters.search);
    fresh.set("sort", "newest");
    setSearchParams(fresh);
  }


  return (
    <div className="content-shell py-8 lg:py-12">
      <div className="border-b border-fitique-line pb-7">
        <p className="eyebrow text-fitique-brown">The current edit</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="serif text-5xl tracking-[-.05em] text-fitique-plum sm:text-6xl">
              The boutique
            </h1>
            <p className="mt-2 text-sm text-fitique-ink/65">
              Pieces chosen for their mood, movement, and place in your
              wardrobe.
            </p>
          </div>
          <span className="text-[.68rem] font-extrabold uppercase tracking-[.12em] text-fitique-ink/55">
            {items?.length ?? 0} pieces
          </span>
        </div>
      </div>

      <div className="py-5 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() =>
                setQuery(
                  setSearchParams,
                  searchParams,
                  "category",
                  category === "All" ? "" : category.toLowerCase()
                )
              }
              className={`focus-ring whitespace-nowrap border px-3 py-2 text-[.65rem] font-extrabold uppercase tracking-[.08em] ${(!filters.category && category === "All") || filters.category.toLowerCase() === category.toLowerCase() ? "border-fitique-plum bg-fitique-plum text-white" : "border-fitique-line bg-white text-fitique-ink"}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
        
      {/* TODO: change this to sidebar component for products page */}
      <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between border-b border-fitique-line pb-3">
              <p className="eyebrow text-fitique-plum">Filter collection</p>
              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="focus-ring text-xs font-bold text-fitique-brown hover:text-fitique-plum"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="border-b border-fitique-line py-5">
              <p className="text-sm font-bold">Department</p>
              <div className="mt-3 grid gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() =>
                      setQuery(
                        setSearchParams,
                        searchParams,
                        "category",
                        category === "All" ? "" : category.toLowerCase()
                      )
                    }
                    className={`focus-ring text-left text-sm ${(!filters.category && category === "All") || filters.category.toLowerCase() === category.toLowerCase() ? "font-extrabold text-fitique-plum" : "text-fitique-ink/65 hover:text-fitique-plum"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>


            <div className="border-b border-fitique-line py-5">
              <label className="field-label" htmlFor="price">
                Price
              </label>
              <select
                id="price"
                value={filters.maxPrice}
                onChange={event =>
                  setQuery(
                    setSearchParams,
                    searchParams,
                    "maxPrice",
                    event.target.value
                  )
                }
                className="field-input text-sm"
              >
                <option value="">Any price</option>
                <option value="75">Under $75</option>
                <option value="125">Under $125</option>
                <option value="175">Under $175</option>
              </select>
            </div>


            <div className="border-b border-fitique-line py-5">
              <label className="field-label" htmlFor="size">
                Size
              </label>
              <select
                id="size"
                value={filters.size}
                onChange={event =>
                  setQuery(
                    setSearchParams,
                    searchParams,
                    "size",
                    event.target.value
                  )
                }
                className="field-input text-sm"
              >
                <option value="">Any size</option>
                {["XS", "S", "M", "L", "XL", "38", "39", "40"].map(size => (
                  <option key={size}>{size}</option>
                ))}
              </select>
              <label className="mt-5 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={event =>
                    setQuery(
                      setSearchParams,
                      searchParams,
                      "availability",
                      event.target.checked ? "in-stock" : ""
                    )
                  }
                  className="accent-fitique-plum"
                />{" "}
                Available now
              </label>
            </div>


            <div className="paper-noise mt-7 border border-fitique-line bg-fitique-lilac/55 p-4">
              <HangerMark
                strokeWidth={1.35}
                className="h-7 w-7 text-fitique-plum"
              />
              <p className="serif mt-4 text-2xl leading-6 text-fitique-plum">
                Every edit begins with a feeling.
              </p>
              <p className="mt-3 text-xs leading-5 text-fitique-ink/65">
                Choose fewer, better pieces you can imagine wearing again and
                again.
              </p>
            </div>

          </div>
        </aside>


        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form
              onSubmit={event => event.preventDefault()}
              className="relative max-w-sm flex-1"
            >
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-fitique-ink/50"
              />
              <input
                value={filters.search}
                onChange={event =>
                  setQuery(
                    setSearchParams,
                    searchParams,
                    "search",
                    event.target.value
                  )
                }
                placeholder="Search the boutique"
                aria-label="Search the boutique"
                className="field-input pl-9 text-sm"
              />
            </form>

            <div className="flex gap-2">
              <button className="focus-ring flex items-center gap-2 border border-fitique-line bg-white px-3 text-[.65rem] font-extrabold uppercase tracking-[.08em] lg:hidden">
                <Filter size={14} />
                Filter{activeFilters > 0 && ` (${activeFilters})`}
              </button>
              <button
                onClick={() => saveSearch(filters)}
                className="focus-ring inline-flex items-center gap-1 border border-fitique-line bg-white px-3 text-[.65rem] font-extrabold uppercase tracking-[.08em] text-fitique-plum hover:border-fitique-plum"
              >
                <BookmarkPlus size={14} />
                Save
              </button>
              <label className="flex items-center gap-2 border border-fitique-line bg-white px-2 text-[.65rem] font-extrabold uppercase tracking-[.08em]">
                <SlidersHorizontal size={14} />
                <select
                  value={filters.sort}
                  onChange={event =>
                    setQuery(
                      setSearchParams,
                      searchParams,
                      "sort",
                      event.target.value
                    )
                  }
                  className="bg-transparent py-2 outline-none"
                >
                  <option value="newest">Newest arrivals</option>
                  <option value="fit-match">Best for my saved fit</option>
                  <option value="value">Best value</option>
                  <option value="price-low">Price low to high</option>
                  <option value="price-high">Price high to low</option>
                  <option value="name">A–Z</option>
                </select>
              </label>
            </div>
          </div>


          {savedSearches.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2 border-y border-fitique-line py-3">
              <span className="eyebrow mr-1 text-fitique-brown">Saved</span>
              {savedSearches.map(item => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 border border-fitique-line bg-fitique-paper text-xs"
                >
                  <button
                    onClick={() => setSearchParams(toParams(item.filters))}
                    className="focus-ring px-2 py-1.5 text-fitique-plum hover:underline"
                  >
                    <BookmarkCheck className="mr-1 inline" size={12} />
                    {item.label}
                  </button>
                  <button
                    onClick={() => removeSearch(item.id)}
                    className="focus-ring border-l border-fitique-line px-1.5 py-1.5 text-fitique-brown hover:text-fitique-plum"
                    aria-label={`Remove saved search ${item.label}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {filters.sort === "fit-match" && (
            <p className="mb-5 border-l-2 border-fitique-plum bg-fitique-lilac/35 px-3 py-2 text-xs text-fitique-ink/65">
              Fit-aware sorting brings pieces available in your saved preferred
              size to the front.
            </p>
          ) }
          

          {featuredProduct && (
            <Link
              to={`/products/${featuredProduct.id}`}
              className="group mb-9 grid overflow-hidden border border-fitique-line bg-fitique-paper text-fitique-ink no-underline md:grid-cols-[1.15fr_.85fr]"
            >
              <div className="relative min-h-72 overflow-hidden">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="absolute inset-0 h-full w-full object-cover brightness-[.97] saturate-[.65] sepia-[.08] transition duration-500 group-hover:scale-[1.02]"
                />
                <span className="absolute left-4 top-4 bg-fitique-ivory/90 px-3 py-1.5 text-[.6rem] font-extrabold uppercase tracking-[.12em] text-fitique-plum">
                  The featured fitting
                </span>
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className="eyebrow text-fitique-brown">
                    A fresh point of view · {featuredProduct.category}
                  </p>
                  <h2 className="serif mt-3 max-w-sm text-4xl leading-none text-fitique-plum">
                    {featuredProduct.name}
                  </h2>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-fitique-ink/65">
                    {featuredProduct.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-fitique-line pt-4">
                  <span className="text-lg font-extrabold text-fitique-plum">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(featuredProduct.price)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-[.08em] text-fitique-brown group-hover:text-fitique-plum">
                    Explore the piece <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ) }
          
          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : items?.length ? (
            <ProductGrid
              products={
                featuredProduct
                  ? items.filter(product => product.id !== featuredProduct.id)
                  : items
              }
              priority
            />
          ) : (
            <div className="paper-noise border border-fitique-line bg-fitique-paper px-6 py-20 text-center">
              <X className="mx-auto text-fitique-plum" />
              <h2 className="serif mt-4 text-3xl text-fitique-plum">
                Nothing quite right, yet.
              </h2>
              <p className="mt-2 text-sm text-fitique-ink/65">
                Try another filter or see the entire current edit.
              </p>
              <button
                onClick={clearFilters}
                className="ghost-button focus-ring mt-6"
              >
                Clear filters
              </button>
            </div>
          ) }
          
        </section>
      </div>
    </div>
  );
}
