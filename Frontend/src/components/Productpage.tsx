"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import type { IProduct } from "@/models/product";

interface ProductPageProps {
  product: IProduct;
}

const ProductPage = ({ product }: ProductPageProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
  const hasOptions = product.productOptions && product.productOptions.length > 0;

  // Initialize default selections first
  const defaultOptions = useMemo(() => {
    const defaults: Record<string, string> = {};
    if (hasOptions) {
      product.productOptions.forEach(option => {
        const values = Array.isArray(option.optionValues) ? option.optionValues : [option.optionValues];
        if (values.length > 0) {
          defaults[option.optionName] = values[0];
        }
      });
    }
    // Set default variant if available
    if (hasVariants) {
      defaults.selectedVariantId = product.variants[0].variantId;
    }
    return defaults;
  }, [hasOptions, hasVariants, product.productOptions, product.variants]);

  // Track selected options with default values
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(defaultOptions);

  // Find matching variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!hasVariants) {
      return null;
    }

    // If user selected a variant directly
    if (selectedOptions.selectedVariantId) {
      return product.variants.find(v => v.variantId === selectedOptions.selectedVariantId);
    }

    // Default to first variant if no specific selection
    return product.variants[0];
  }, [selectedOptions, hasVariants, product.variants]);

  // Fixed price calculation - use variant price when variants exist, otherwise use product price
  const displayPrice = useMemo(() => {
    if (hasVariants && selectedVariant) {
      // When variants exist, always use variant price
      return selectedVariant.variantPrice;
    }
    
    // When no variants, use product price with discount fallback
    return product.price?.discountedPrice ?? product.price?.price ?? 0;
  }, [hasVariants, selectedVariant, product.price]);

  // Helper function to extract stock quantity from stock object or number
  const getStockQuantity = (stock: any): number => {
    if (typeof stock === 'number') {
      return stock;
    } else if (stock && typeof stock === 'object' && 'quantity' in stock) {
      return stock.quantity;
    }
    return 0;
  };

  // Fixed stock calculation - use selected variant stock or product stock
  const stockQuantity = useMemo(() => {
    console.log("=== STOCK CALCULATION DEBUG ===");
    console.log("hasVariants:", hasVariants);
    console.log("selectedVariant:", selectedVariant);
    
    // If variants exist and selected variant has stock data, use it
    if (hasVariants && selectedVariant && selectedVariant.stock !== undefined) {
      const variantStockQty = getStockQuantity(selectedVariant.stock);
      console.log(`Selected variant ${selectedVariant.variantId} stock:`, selectedVariant.stock);
      console.log(`Selected variant ${selectedVariant.variantId} stock quantity:`, variantStockQty);
      return variantStockQty;
    }
    
    // Otherwise, use product stock (either no variants or variants without individual stock)
    const productStockQty = getStockQuantity(product.stock);
    console.log("Using product stock:", product.stock);
    console.log("Product stock quantity:", productStockQty);
    return productStockQty;
  }, [hasVariants, selectedVariant, product.stock, selectedOptions]);

  const isOutOfStock = stockQuantity <= 0;

  // Handle option selection
  const handleOptionSelect = (optionName: string, optionValue: string) => {
    console.log(`User selected ${optionName}: ${optionValue}`);
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: optionValue
    }));
  };

  // Handle quantity changes
  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "decrease" && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
    if (type === "increase" && quantity < stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const cartItem = {
      productId: product.id || product.name, // Use product.id if available, otherwise fallback to name
      variantId: selectedVariant?.variantId,
      name: product.name,
      price: displayPrice,
      quantity: quantity,
      image: product.media?.items?.[0]?.url,
      variant: selectedVariant?.variantName,
      maxStock: stockQuantity
    };

    addItem(cartItem);
    
    // Reset quantity after adding
    setQuantity(1);
    
    // Optional: Show success feedback
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  // Process unique options - group by option name
  const uniqueOptions = hasOptions
    ? product.productOptions.reduce((acc, opt, index) => {
        const existing = acc.find(item => item.optionName === opt.optionName);
        if (existing) {
          // Add to existing option's values
          const newValues = Array.isArray(opt.optionValues) ? opt.optionValues : [opt.optionValues];
          existing.optionValues = [...existing.optionValues, ...newValues];
        } else {
          // Create new option
          acc.push({
            optionName: opt.optionName,
            optionValues: Array.isArray(opt.optionValues) ? opt.optionValues : [opt.optionValues],
            originalIndex: index
          });
        }
        return acc;
      }, [] as Array<{optionName: string, optionValues: string[], originalIndex: number}>)
    : [];

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* Media Section */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <MediaCarousel items={product.media?.items || []} />
      </div>

      {/* Product Info */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100" />

        {/* Price - Simplified logic */}
        <div className="flex items-center gap-4">
          {hasVariants ? (
            // Show only variant price when variants exist
            <h2 className="font-medium text-2xl">₹{displayPrice}</h2>
          ) : (
            // Show original and discounted price when no variants
            product.price?.discountedPrice && product.price?.discountedPrice !== product.price?.price ? (
              <>
                <h3 className="text-xl text-gray-500 line-through">₹{product.price.price}</h3>
                <h2 className="font-medium text-2xl">₹{displayPrice}</h2>
              </>
            ) : (
              <h2 className="font-medium text-2xl">₹{displayPrice}</h2>
            )
          )}
        </div>
        <div className="h-[2px] bg-gray-100" />

        {/* Options Selector */}
        {hasOptions && uniqueOptions.map((option) => (
          <div key={`option-${option.originalIndex}-${option.optionName}`}>
            <h3 className="text-lg font-medium mb-3">Select {option.optionName}</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {option.optionValues.map((value, valueIndex) => (
                <button
                  key={`${option.optionName}-${value}-${valueIndex}`}
                  onClick={() => handleOptionSelect(option.optionName, value)}
                  className={`px-4 py-2 rounded-md border transition-all ${
                    selectedOptions[option.optionName] === value
                      ? "border-black bg-black text-white font-medium"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="h-[2px] bg-gray-100" />
          </div>
        ))}

        {/* Variant Display - Show variants regardless of options */}
        {hasVariants && (
          <>
            <h3 className="text-lg font-medium">Select a Variant</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {product.variants.map((variant) => {
                // Check if variant has stock data, otherwise assume available
                const stock = variant.stock !== undefined ? getStockQuantity(variant.stock) : 999; // Default to available
                const isDisabled = stock <= 0;
                
                return (
                  <button
                    key={variant.variantId}
                    onClick={() => {
                      console.log("Selecting variant:", variant.variantId);
                      setSelectedOptions(prev => ({ ...prev, selectedVariantId: variant.variantId }));
                    }}
                    className={`px-4 py-2 rounded-md border transition-all ${
                      selectedOptions.selectedVariantId === variant.variantId
                        ? "border-black bg-black text-white font-medium"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isDisabled}
                  >
                    {variant.variantName} - ₹{variant.variantPrice}
                    {isDisabled && " (Out of Stock)"}
                  </button>
                );
              })}
            </div>
            <div className="h-[2px] bg-gray-100" />
          </>
        )}

        {/* Selected Variant Info */}
        {selectedVariant && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{selectedVariant.variantName}</span>
            </p>
            <p className="text-sm text-gray-600">
              Price: <span className="font-medium">₹{selectedVariant.variantPrice}</span>
            </p>
          </div>
        )}

        {/* Add to Cart Section - Updated with working functionality */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex border border-gray-300 rounded-md">
              <button 
                className={`px-4 py-2 text-xl font-medium ${
                  isOutOfStock || quantity <= 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"
                } rounded-l-md`} 
                disabled={isOutOfStock || quantity <= 1}
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </button>
              <input 
                type="number" 
                min="1"
                max={stockQuantity}
                value={quantity} 
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  if (newQuantity >= 1 && newQuantity <= stockQuantity) {
                    setQuantity(newQuantity);
                  }
                }}
                className="w-16 text-center border-x border-gray-300 py-2" 
                disabled={isOutOfStock} 
              />
              <button 
                className={`px-4 py-2 text-xl font-medium ${
                  isOutOfStock || quantity >= stockQuantity ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-50"
                } rounded-r-md`} 
                disabled={isOutOfStock || quantity >= stockQuantity}
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </button>
            </div>

            <button
              className={`flex-1 py-3 px-6 rounded-md font-medium text-white transition-all ${
                isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {isOutOfStock ? (
            <p className="text-red-500">This product is currently out of stock</p>
          ) : (
            <p className="text-green-600">Hurray! Your selected item is in stock</p>
          )}
        </div>

        {/* Additional Info */}
        {product.additionalInfoSections?.length > 0 && (
          <>
            <div className="h-[2px] bg-gray-100" />
            {product.additionalInfoSections.map((section, i) => (
              <div key={i} className="text-sm">
                <h4 className="font-medium mb-4">{section.title}</h4>
                <p>{section.description}</p>
              </div>
            ))}
          </>
        )}

        {/* Reviews */}
        {/* <div className="h-[2px] bg-gray-100" />
        <h1 className="text-2xl">User Reviews</h1> */}
      </div>
    </div>
  );
};

// MediaCarousel component (unchanged)
const MediaCarousel = ({
  items,
}: {
  items: { url: string; alt?: string }[];
}) => {
  const [current, setCurrent] = useState(0);
  if (!items?.length) return <p>No media available</p>;

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  const currentItem = items[current];
  const isVideo = /\.(mp4|webm|ogg)$/i.test(currentItem.url);

  return (
    <div className="relative w-full overflow-hidden rounded-md bg-white">
      {isVideo ? (
        <video key={current} autoPlay muted loop controls className="rounded-md w-full object-cover max-h-[500px]">
          <source src={currentItem.url} type="video/mp4" />
        </video>
      ) : (
        <img
          src={currentItem.url}
          alt={currentItem.alt || `Product image ${current + 1}`}
          className="w-full object-contain h-[500px] transition-opacity duration-500 ease-in-out"
        />
      )}

      {items.length > 1 && (
        <>
          <div className="absolute inset-0 flex justify-between items-center px-2">
            <button onClick={prev} className="bg-white/80 hover:bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md text-xl">‹</button>
            <button onClick={next} className="bg-white/80 hover:bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md text-xl">›</button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {items.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full ${current === idx ? "bg-black" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
