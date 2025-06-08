"use client"

import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react";

const Searchbar = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        
        if (name && name.trim()) {
            setIsLoading(true);
            // Navigate to search results page with proper URL encoding
            router.push(`/list?name=${encodeURIComponent(name.trim())}`);
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = e.currentTarget.closest('form');
            if (form) {
                form.requestSubmit();
            }
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        const input = document.querySelector('input[name="name"]') as HTMLInputElement;
        if (input) {
            input.focus();
        }
    };

    return (
        <form 
            className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1 relative" 
            onSubmit={handleSearch}
        >
            <input 
                type="text" 
                name="name" 
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search products..." 
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                disabled={isLoading}
            />
            
            {searchTerm && (
                <button 
                    type="button"
                    onClick={clearSearch}
                    className="cursor-pointer hover:bg-gray-200 rounded-full p-1 transition-colors"
                    aria-label="Clear search"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" className="text-gray-500">
                        <path 
                            d="M6 4.586L10.293.293a1 1 0 111.414 1.414L7.414 6l4.293 4.293a1 1 0 01-1.414 1.414L6 7.414l-4.293 4.293a1 1 0 01-1.414-1.414L4.586 6 .293 1.707A1 1 0 011.707.293L6 4.586z" 
                            fill="currentColor"
                        />
                    </svg>
                </button>
            )}
            
            <button 
                type="submit"
                className={`cursor-pointer hover:bg-gray-200 rounded-full p-1 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
                aria-label="Search"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Image src="/search.png" alt="Search" width={16} height={16} />
                )}
            </button>
        </form>
    );
};

export default Searchbar;

