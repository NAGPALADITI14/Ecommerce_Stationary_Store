"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleViewCart = () => {
    onClose();
    router.push('/checkout');
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20 max-w-sm">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cart is Empty</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
          
          {/* List of items in the cart */}
          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                
                <div className="flex flex-col justify-between w-full">
                  {/* Title and price */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500">{item.variant}</p>
                      )}
                    </div>
                    <div className="p-1 bg-gray-50 rounded-md text-sm">
                      ₹{item.price}
                    </div>
                  </div>
                  
                  {/* Quantity controls and remove */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        disabled={item.quantity >= item.maxStock}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between font-semibold mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <div className="flex gap-2">
              <button 
                className="flex-1 rounded-md py-2 px-4 ring-1 ring-slate-300 text-sm hover:bg-gray-50"
                onClick={handleViewCart}
              >
                View Cart
              </button>
              <button 
                className="flex-1 rounded-md py-2 px-4 bg-black text-white text-sm hover:bg-gray-800"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
            {items.length > 1 && (
              <button
                onClick={clearCart}
                className="w-full mt-2 text-sm text-gray-500 hover:text-red-500"
              >
                Clear Cart
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;


