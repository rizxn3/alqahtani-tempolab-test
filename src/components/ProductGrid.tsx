import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface ProductGridProps {
  bikeTypeId?: string;
  madeTypeId?: string;
  onAddToCart?: (product: Product) => void;
}

const ProductGrid = ({
  bikeTypeId,
  madeTypeId,
  onAddToCart,
}: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from("products").select("*");

      if (bikeTypeId) {
        query = query.eq("bike_type_id", bikeTypeId);
      }

      if (madeTypeId) {
        query = query.eq("made_type_id", madeTypeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [bikeTypeId, madeTypeId]);

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto bg-gray-50 p-6 text-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description || ""}
            part_number={product.part_number}
            imageUrl={product.image_url || ""}
            onAddToCart={() => onAddToCart?.(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
