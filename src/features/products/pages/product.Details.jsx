/* Lavender Lookbook product detail: an image-led, decisive product story with Fit Check always within reach. */
import {
  ArrowLeft,
  Heart,
  Package,
  Ruler,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ! internal imports
// # components
import ProductGrid, { ProductSkeleton } from "../components/product.Grid.jsx";
import ProductDecisionSupport from "../components/product.DecisionSupport.jsx";

// ? missing component import
// import QuantitySelector from "../components/commerce/QuantitySelector";

// # hooks
import { useProduct, useProducts } from "../hooks/useProducts.js";
import { usePageMeta } from "../../../hooks/usePageMeta.js";
import { formatCurrency } from "../../../lib/utils.js";
import { useCart } from "../../commerce/hooks/useCart.js";

// ? missing hook import
import { useWishlistStore } from "../store/wishlistStore";

// Todo: break down this large code into components for maintenance purposes.
export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId);
  const { data: related } = useProducts({});
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart(state => state.addItem);
  const wishlist = useWishlistStore(state => state.productIds);
  const toggleWishlist = useWishlistStore(state => state.toggle);
  usePageMeta(product?.name || "Piece", product?.description);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setSize(product.sizes[0]);
      setColor(product.colors[0]);
      setQuantity(1);
    }
  }, [product?.id]);

  if (isLoading)
    return (
      <div className="content-shell py-10">
        <ProductSkeleton count={4} />
      </div>
    );

  if (!product)
    return (
      <div className="content-shell py-10">
        <Link to="/products" className="ghost-button focus-ring">
          <ArrowLeft size={15} /> Back to the edit
        </Link>
        <h1 className="serif mt-10 text-5xl text-fitique-plum">
          This piece has moved on.
        </h1>
      </div>
    );

  const saved = wishlist.includes(product.id);

  function addToBag() {
    if (!product.inStock) return;
    addItem(product, { size, color, quantity });
    toast(`${product.name} added to your bag`);
  }

  return (
    <div className="content-shell py-6 lg:py-10">
      <Link
        to="/products"
        className="focus-ring inline-flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.1em] text-fitique-brown hover:text-fitique-plum"
      >
        <ArrowLeft size={15} /> Back to the edit
      </Link>
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.8fr] lg:gap-14">
        <div className="grid gap-3 sm:grid-cols-[5rem_1fr]">
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
            {product.images.map((src, index) => (
              <button
                onClick={() => setActiveImage(index)}
                aria-label={`View ${product.name} image ${index + 1}`}
                key={src}
                className={`focus-ring h-20 w-16 overflow-hidden border ${activeImage === index ? "border-fitique-plum" : "border-fitique-line"}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 aspect-[.78] overflow-hidden bg-fitique-paper sm:order-2">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="lg:pt-3">
          <p className="eyebrow text-fitique-brown">
            {product.category} · {product.type}
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="serif max-w-md text-5xl leading-none tracking-[-.05em] text-fitique-plum">
              {product.name}
            </h1>
            <button
              onClick={() => {
                toggleWishlist(product.id);
                toast(
                  saved ? "Removed from your saved edit" : "Saved to your edit"
                );
              }}
              aria-label="Save this product"
              className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border border-fitique-line bg-white text-fitique-plum"
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xl font-extrabold text-fitique-plum">
              {formatCurrency(product.price)}
            </span>
            {product.previousPrice && (
              <span className="text-sm text-fitique-ink/45 line-through">
                {formatCurrency(product.previousPrice)}
              </span>
            )}
          </div>
          <p className="mt-6 text-sm leading-7 text-fitique-ink/70">
            {product.description}
          </p>
          <div className="my-7 editorial-rule" />
          <div>
            <span className="field-label">Size</span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(item => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={`focus-ring min-w-11 border px-3 py-2.5 text-sm font-bold ${size === item ? "border-fitique-plum bg-fitique-plum text-white" : "border-fitique-line bg-white text-fitique-ink hover:border-fitique-plum"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <span className="field-label">Colour — {color}</span>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(item => (
                <button
                  key={item}
                  onClick={() => setColor(item)}
                  className={`focus-ring border px-3 py-2.5 text-sm font-bold ${color === item ? "border-fitique-plum bg-fitique-lilac/60 text-fitique-plum" : "border-fitique-line bg-white text-fitique-ink hover:border-fitique-plum"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* Fix-me: component missing */}
          {/* <div className="mt-6">
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div> */}

          {product.inStock ? (
            <>
              <button
                onClick={addToBag}
                className="plum-button focus-ring mt-7 w-full"
              >
                Add to bag — {formatCurrency(product.price * quantity)}
              </button>
              <button
                onClick={() => navigate(`/fit-check?product=${product.id}`)}
                className="focus-ring mt-3 flex w-full items-center justify-center gap-2 border border-fitique-lilac bg-fitique-lilac/60 px-4 py-3.5 text-[.7rem] font-extrabold uppercase tracking-[.09em] text-fitique-plum hover:bg-fitique-lilac"
              >
                <Sparkles size={16} /> Check my fit first
              </button>
            </>
          ) : (
            <button
              disabled
              className="mt-7 w-full bg-fitique-line px-4 py-3.5 text-[.7rem] font-extrabold uppercase tracking-[.09em] text-fitique-ink/50"
            >
              Currently unavailable
            </button>
          )}
          <div className="mt-8 grid gap-4 border-t border-fitique-line pt-6 text-sm">
            <div className="flex gap-3">
              <Ruler size={18} className="shrink-0 text-fitique-plum" />
              <div>
                <p className="font-bold">Fit notes</p>
                <p className="mt-1 leading-6 text-fitique-ink/60">
                  {product.fitNote}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Truck size={18} className="shrink-0 text-fitique-plum" />
              <div>
                <p className="font-bold">Boutique delivery</p>
                <p className="mt-1 leading-6 text-fitique-ink/60">
                  Select delivery at checkout. You’ll receive a clear arrival
                  window.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Package size={18} className="shrink-0 text-fitique-plum" />
              <div>
                <p className="font-bold">Easy returns</p>
                <p className="mt-1 leading-6 text-fitique-ink/60">
                  Try at home, then keep what feels like you.
                </p>
              </div>
            </div>
          </div>
          <ProductDecisionSupport product={product} selectedSize={size} />
        </div>
      </div>
      <section className="mt-16 border-t border-fitique-line pt-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow text-fitique-brown">More to consider</p>
            <h2 className="serif mt-2 text-4xl text-fitique-plum">
              Keep the feeling going.
            </h2>
          </div>
          <Link
            to="/products"
            className="focus-ring hidden text-[.68rem] font-extrabold uppercase tracking-widest text-fitique-plum sm:block"
          >
            See the boutique
          </Link>
        </div>
        <div className="mt-7">
          <ProductGrid
            products={(related || [])
              .filter(item => item.id !== product.id)
              .slice(0, 4)}
          />
        </div>
      </section>
    </div>
  );
}
