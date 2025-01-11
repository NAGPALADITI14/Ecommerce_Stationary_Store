"use client"

import Image from "next/image";
import Link from "next/link";

const ProductList = () => {
  return (
    <div className=" mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      <Link
        href="/test"
        className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
        <div className="relative w-full h-80">
          <Image
            src="https://i.pinimg.com/736x/02/00/ff/0200ff351193f9ef63e89605bca64216.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
          />
          <Image
            src="https://i.pinimg.com/736x/d6/b1/6a/d6b16a21f564ddd6a2b36c449101618d.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-black ">Set of 4 Classmate notebooks</span>
          <span className="font-semibold text-black">₹180</span>
        </div>
        <div className="text-sm text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit,
          veritatis vel impedit dolore nesciunt amet consequuntur sit itaque
          consectetur.
        </div>
        <button className="rounded-2xl text-red-600 ring-1 ring-red-600 w-max py-2 px-4 text-xs hover:bg-red-600 hover:text-white">Add to Cart</button>
      </Link>


      <Link
        href="/test"
        className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
        <div className="relative w-full h-80">
          <Image
            src="https://i.pinimg.com/736x/02/00/ff/0200ff351193f9ef63e89605bca64216.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
          />
          <Image
            src="https://i.pinimg.com/736x/d6/b1/6a/d6b16a21f564ddd6a2b36c449101618d.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-black ">Set of 4 Classmate notebooks</span>
          <span className="font-semibold text-black">₹180</span>
        </div>
        <div className="text-sm text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit,
          veritatis vel impedit dolore nesciunt amet consequuntur sit itaque
          consectetur.
        </div>
        <button className="rounded-2xl text-red-600 ring-1 ring-red-600 w-max py-2 px-4 text-xs hover:bg-red-600 hover:text-white">Add to Cart</button>
      </Link>


      <Link
        href="/test"
        className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
        <div className="relative w-full h-80">
          <Image
            src="https://i.pinimg.com/736x/02/00/ff/0200ff351193f9ef63e89605bca64216.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
          />
          <Image
            src="https://i.pinimg.com/736x/d6/b1/6a/d6b16a21f564ddd6a2b36c449101618d.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-black ">Set of 4 Classmate notebooks</span>
          <span className="font-semibold text-black">₹180</span>
        </div>
        <div className="text-sm text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit,
          veritatis vel impedit dolore nesciunt amet consequuntur sit itaque
          consectetur.
        </div>
        <button className="rounded-2xl text-red-600 ring-1 ring-red-600 w-max py-2 px-4 text-xs hover:bg-red-600 hover:text-white">Add to Cart</button>
      </Link>


      <Link
        href="/test"
        className="relative w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
        <div className="relative w-full h-80">
          <Image
            src="https://i.pinimg.com/736x/02/00/ff/0200ff351193f9ef63e89605bca64216.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
          />
          <Image
            src="https://i.pinimg.com/736x/d6/b1/6a/d6b16a21f564ddd6a2b36c449101618d.jpg"
            alt=""
            fill
            sizes="25vw"
            className="absolute object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-black ">Set of 4 Classmate notebooks</span>
          <span className="font-semibold text-black">₹180</span>
        </div>
        <div className="text-sm text-gray-500">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit,
          veritatis vel impedit dolore nesciunt amet consequuntur sit itaque
          consectetur.
        </div>
        <button className="rounded-2xl text-red-600 ring-1 ring-red-600 w-max py-2 px-4 text-xs hover:bg-red-600 hover:text-white">Add to Cart</button>
      </Link>

      
    </div>
  );
};
export default ProductList;
