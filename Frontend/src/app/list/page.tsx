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

