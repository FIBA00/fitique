/* Lavender Lookbook product grid: irregular-feeling editorial rhythm while maintaining efficient responsive shopping scanability. */
import { useState } from "react";

// ! internal imports
import ProductCard from "./product.card.jsx";
import ProductQuickView from "./product.quickView.jsx";

export default function ProductGrid({ products, priority = false }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={priority && index < 2}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>
      <ProductQuickView
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onOpenChange={open => {
          if (!open) setQuickViewProduct(null);
        }}
      />
    </>
  );
}
