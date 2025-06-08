"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartModal from "./CartModal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();
  const { totalItems } = useCart();
  
  // Use auth context with fallback
  let isLoggedIn = false;
  let user = null;
  let logout = null;
  
  try {
    const auth = useAuth();
    isLoggedIn = auth.isLoggedIn;
    user = auth.user;
    logout = auth.logout;
  } catch (error) {
    // Fallback if AuthContext is not available
    console.warn("AuthContext not found, using fallback logic");
    // You can check cookies or localStorage as fallback
    const token = document?.cookie?.includes('token=');
    isLoggedIn = !!token;
  }

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        // Use context logout if available
        await logout();
      } else {
        // Fallback logout logic
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
      
      setIsProfileOpen(false); // Close dropdown
      router.push("/"); // Redirect to home page
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: clear everything anyway
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setIsProfileOpen(false);
      router.push("/");
    }
  };

  return (
    <div className='flex items-center gap-r xl:gap-2 relative'>
      <Image
        src="/user.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 min-w-[150px]">
          {/* Show user info if available */}
          {user && (
            <div className="pb-2 mb-2 border-b border-gray-200">
              <p className="font-semibold text-gray-800">{user.name || user.email}</p>
            </div>
          )}
          
          <Link 
            href="/profile/order" 
            className="block py-1 hover:text-blue-600 transition-colors"
            onClick={() => setIsProfileOpen(false)} // Close dropdown when navigating
          >
            My Orders
          </Link>
          
          <Link 
            href="/homepage" 
            className="block py-1 hover:text-blue-600 transition-colors"
            onClick={() => setIsProfileOpen(false)}
          >
            Homepage
          </Link>
          
          <div 
            className="mt-2 pt-2 border-t border-gray-200 cursor-pointer hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
      
      <Image
        src="/bell.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      
      <div className="relative cursor-pointer" onClick={() => setIsCartOpen((prev) => !prev)}>
        <Image
          src="/shopping-cart.png"
          alt=""
          width={22}
          height={22}
          className="cursor-pointer"
        />
        <div className='absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-white text-sm flex items-center justify-center'>
          {totalItems > 0 ? (totalItems > 99 ? '99+' : totalItems) : null}
        </div>
      </div>
      
      {isCartOpen && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </div>
  );
};

export default NavIcons;