"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories",{method:"GET"});

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data:Category[] = await response.json();
        console.log(data);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/list?cat=${category.name}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
          >
          
            <div className="relative bg-slate-100 w-full h-96">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide text-black">
              {category.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
