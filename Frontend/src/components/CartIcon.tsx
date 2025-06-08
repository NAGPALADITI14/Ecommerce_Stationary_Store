"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartModal from "./CartModal";

const CartIcon: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        {/* Cart Icon - you can replace this with your preferred icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
          />
        </svg>
        
        {/* Badge */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      <CartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default CartIcon;