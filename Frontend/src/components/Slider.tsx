"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Notebook Collections",
    description: "Sale! Up to 5% off!",
    img: "https://i.pinimg.com/736x/0a/d6/d4/0ad6d49291b5b646e491e858f153c573.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-purple-50 to-pink-50",
  },
  {
    id: 2,
    title: "The Art Collections",
    description: "Sale! Up to 10% off!",
    img: "https://i.pinimg.com/736x/c0/9f/25/c09f255e338753d2ba8b9345cbbec83c.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-pink-50 to-blue-50",
  },
  {
    id: 3,
    title: "Sports Collections",
    description: "Sale! Up to 10% off!",
    img: "https://i.pinimg.com/736x/61/f0/c8/61f0c815d8859fc20cbd215a5765d4be.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
  },
  {
    id: 4,
    title: "Bottles Collections",
    description: "Sale! Up to 5% off!",
    img: "https://i.pinimg.com/736x/04/61/91/04619102daf3c142f4a73c66d5347e0d.jpg",
    url: "/",
    bg: "bg-gradient-to-r from-yellow-50 to-purple-50",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-100"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT-CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-4 2xl:gap-12 text-black">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl font-semibold">
                {slide.description}
              </h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold text-center">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-4 px-5">
                  SHOP NOW
                </button>
              </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt=""
                fill
                sizes="100%"
                className="object-cover"
              ></Image>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
        {slides.map((slide, index) => (
          <div
            className={`w-3 h-3 rounded-full ring 1 ring-gray-600 cursor-pointer flex items-center justify-center
                    ${current === index ? "scale-150" : ""}`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Slider;


