"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddProps {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  price: number;
  stockNumber: number;
  image?: string;
}

const Add: React.FC<AddProps> = ({ 
  productId, 
  productName,
  variantId, 
  variantName,
  price,
  stockNumber,
  image 
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (stockNumber < 1) return;
    
    addItem({
      productId,
      variantId,
      name: productName,
      price,
      quantity,
      image,
      variant: variantName,
      maxStock: stockNumber
    });

    // Reset quantity after adding
    setQuantity(1);
    
    // Optional: Show success message
    console.log(`Added ${quantity} of ${productName} to cart`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium text-black">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32 text-black">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20 text-black"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber}
            >
              +
            </button>
          </div>
          {stockNumber < 1 ? (
            <div className="text-xs text-red-500">Product is out of stock</div>
          ) : (
            <div className="text-xs text-orange-500">
              Only <span className="text-orange-500">{stockNumber} items</span>{" "}
              left! Don't miss it.
            </div>
          )}
        </div>
        <button
          className="w-36 text-sm rounded-3xl ring-1 ring-red-500 text-red-500 py-2 px-4 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white transition-colors"
          disabled={stockNumber < 1}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
