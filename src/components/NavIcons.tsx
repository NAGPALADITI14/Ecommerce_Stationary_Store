"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartModal from "./CartModal";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter();

  const isLoggedIn = true;

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
      // console.log("Profile dropdown toggled:", !isProfileOpen);
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
        <div
          className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm
            shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/">Profile</Link>
          <div className="mt-2 cursor-pointer">Logout</div>
        </div>
      )}
      <Image
        src="/bell.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div className="relative cursor-pointer" onClick={() =>setIsCartOpen((prev)=> !prev)}>
      <Image
        src="/shopping-cart.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        
      />
      <div className='absolute -top-4 -right-4 w-6 h-6 bg-red-400 rounded-full text-wh text-sm flex items-center justify-center'>2</div>
      </div>
      {isCartOpen && (
        <CartModal/>
      )}
    </div>
  );
};
export default NavIcons;
