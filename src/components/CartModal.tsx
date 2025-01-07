"use client";

import Image from "next/image";

const CartModal = () => {
  const CartItems = true;

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {!CartItems ? (
        <div className="">Cart is Empty</div>
      ) : (
        <>
        <h2 className="text-xl">Shopping Cart</h2>
        {/* list of items in the cart */}
          <div className="flex flex-col gap-8">
            {/* ITEMS */}
            <div className="flex gap-4">
              <Image
                //   there was a change made in next.config.ts for images so inorder to remove it remove there as well
                src="https://images.pexels.com/photos/843227/pexels-photo-843227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
                width={72}
                height={120}
                className="object-cover rounded-md"
              />
              <div className="flex flex-col justify-between w-full">
                {/* top-portion */}
                <div className=""></div>
                {/* title */}
                <div className="flex items-center justify-between gap-8">
                  <h3 className="font-semibold">Product Name</h3>
                  <div className="p-1 bg-gray-50 rounded-md">₹300</div>
                </div>
                {/* desc */}
                <div className="text-sm text-gray-500">Available</div>
                {/* bottom-portion */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Qty. 2</span>
                  <span className="text-blue-500">Remove</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Image
                //   there was a change made in next.config.ts for images so inorder to remove it remove there as well
                src="https://images.pexels.com/photos/843227/pexels-photo-843227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
                width={72}
                height={120}
                className="object-cover rounded-md"
              />
              <div className="flex flex-col justify-between w-full">
                {/* top-portion */}
                <div className=""></div>
                {/* title */}
                <div className="flex items-center justify-between gap-8">
                  <h3 className="font-semibold">Product Name</h3>
                  <div className="p-1 bg-gray-50 rounded-md">₹300</div>
                </div>
                {/* desc */}
                <div className="text-sm text-gray-500">Available</div>
                {/* bottom-portion */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Qty. 2</span>
                  <span className="text-blue-500">Remove</span>
                </div>
              </div>
            </div>
          </div>



          {/* BOTTOM */}
          <div className="">
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>₹1200</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 mb-4">
                Shipping and taxes calculated at checkout
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-slate-300">View cart</button>
              <button className="rounded-md py-3 px-4 bg-black text-white">Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CartModal;
