"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/models/product";
import { useSearchParams } from "next/navigation";

interface ProductListProps {
  type: "featured" | "latest" | "category";
}

const ProductList: React.FC<ProductListProps> = ({ type }) => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const categoryname = searchParams.get("cat");

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/products", { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log("Raw product data:", rawData); 
        
        const data: IProduct[] = Array.isArray(rawData.products)
          ? rawData.products
          : Array.isArray(rawData)
          ? rawData
          : Object.values(rawData.products || {});

        console.log("Processed product data:", data); 
        console.log("Category filter:", categoryname); 

        let filteredProducts: IProduct[] = [];

        if (type === "category" && categoryname) {
          filteredProducts = data.filter((product) => {
            const productCategory = product.category?.toLowerCase()?.trim();
            const searchCategory = categoryname.toLowerCase().trim();
            console.log(`Comparing: "${productCategory}" === "${searchCategory}"`); 
            return productCategory === searchCategory;
          });
          console.log("Filtered products for category:", filteredProducts); 
        } else if (type === "latest") {
          filteredProducts = data.filter((product) => product.isLatest);
        } else if (type === "featured") {
          filteredProducts = data
            .sort(() => 0.5 - Math.random()) // shuffle
            .slice(0, 4); // pick 4 random
        } else {
          filteredProducts = data;
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, categoryname, hydrated]);

  if (!hydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-12 flex justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 flex justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mt-12 flex justify-center">
        <p className="text-gray-500">
          {type === "category" && categoryname
            ? `No products found in "${categoryname}" category.`
            : "No products found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {products.map((product: IProduct, index: number) => (
        <Link
          key={product.productId || product._id || product.slug || index}
          href={`/products/${product.slug}`}
          className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.items?.[0]?.url || "/placeholder.jpg"}
              alt={product.media?.items?.[0]?.alt || `Image of ${product.name}`}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
            {product.media?.items?.[1]?.url && (
              <Image
                src={
                  product.media?.items?.length > 1 &&
                  !product.media.items[1].url.endsWith(".mp4")
                    ? product.media.items[1].url
                    : product.media.items[0].url || "/placeholder.jpg"
                }
                alt={
                  product.media?.items?.length > 1 &&
                  !product.media.items[1].url.endsWith(".mp4")
                    ? product.media.items[1].alt || `Alternate view of ${product.name}`
                    : product.media.items[0].alt || `Image of ${product.name}`
                }
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md transition-opacity duration-500"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-black">{product.name}</span>
            <span className="font-semibold text-black">
              ₹{product.price?.price || "N/A"}
            </span>
          </div>
          <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
          <button className="rounded-2xl text-red-600 ring-1 ring-red-600 w-max py-2 px-4 text-xs hover:bg-red-600 hover:text-white transition-colors duration-200">
            Add to Cart
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;









