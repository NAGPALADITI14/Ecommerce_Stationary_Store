'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Suspense } from 'react';

// The actual filter logic component
const FilterContent = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value) {
      current.set(key, value);
    } else {
      current.delete(key);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        <select 
          name="type" 
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={(e) => handleFilterChange('type', e.target.value)}
          defaultValue={searchParams.get('type') || ''}
        >
          <option value="">Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        
        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={(e) => handleFilterChange('min', e.target.value)}
          defaultValue={searchParams.get('min') || ''}
        />
        
        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={(e) => handleFilterChange('max', e.target.value)}
          defaultValue={searchParams.get('max') || ''}
        />
        
        <select 
          name="category" 
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={(e) => handleFilterChange('cat', e.target.value)}
          defaultValue={searchParams.get('cat') || ''}
        >
          <option value="">Category</option>
          <option value="new-arrival">New Arrival</option>
          <option value="popular">Popular</option>
        </select>
        
        <select 
          name="sort" 
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          defaultValue={searchParams.get('sort') || ''}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
        </select>
      </div>
    </div>
  );
};

// Loading skeleton for the filter
const FilterSkeleton = () => (
  <div className="mt-12 flex justify-between">
    <div className="flex gap-6 flex-wrap">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 w-24 bg-gray-200 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  </div>
);

// Main Filter component with Suspense boundary
const Filter = () => {
  return (
    <Suspense fallback={<FilterSkeleton />}>
      <FilterContent />
    </Suspense>
  );
};

export default Filter;








// import Filter from "@/components/Filter";
// import ProductList from "@/components/ProductList";

// import Image from "next/image";
// import { Suspense } from "react";


// const ListPage = () =>{
//   return (
//     <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
//       {/* CAMPAIGN */}
//       <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
//         <div className="w-2/3 flex flex-col items-center justify-center gap-8">
//           <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
//             Grab up to 50% off on
//             <br /> Selected Products
//           </h1>
//           <button className="rounded-3xl bg-red-400 text-white w-max py-3 px-5 text-sm">
//             Buy Now
//           </button>
//         </div>
//         {/* <div className="relative w-1/3">
//           <Image src="/woman.png" alt="" fill className="object-contain" />
//         </div> */}
//       </div>
//       {/* FILTER */}
//       <Filter />
//       {/* PRODUCTS */}
//       {/* <h1 className="mt-12 text-xl font-semibold">{cat?.collection?.name} For You!</h1> */}
//       {/* <Suspense fallback={<Skeleton/>}> */}
//         <ProductList
//           // categoryId={
//           //   cat.collection?._id || "00000000-000000-000000-000000000001"
//           // }
//           // searchParams={searchParams}
//         />
//       {/* </Suspense> */}
//     </div>
//   );
// };

// export default ListPage;