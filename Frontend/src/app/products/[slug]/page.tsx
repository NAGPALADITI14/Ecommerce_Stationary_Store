import { notFound } from "next/navigation";
import ProductPage from "@/components/Productpage"; 
import { IProduct } from "@/models/product";

const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  console.log("=== CLIENT FETCH DEBUG START ===");
  console.log("Input slug:", slug);
  
  // Validate input
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    console.error("❌ Invalid slug provided to getProductBySlug");
    return null;
  }
  
  const getBaseUrl = () => {
    // For server-side rendering, use the full domain
    if (typeof window === 'undefined') {
      // Server-side
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
      }
      return 'http://localhost:3000';
    } else {
      // Client-side
      return window.location.origin;
    }
  };

  const baseUrl = getBaseUrl();
  const cleanSlug = slug.trim().toLowerCase();
  const apiUrl = `${baseUrl}/api/products/${encodeURIComponent(cleanSlug)}`;
  
  console.log("Base URL:", baseUrl);
  console.log("Clean slug:", cleanSlug);
  console.log("Full API URL:", apiUrl);

  try {
    console.log("Making fetch request...");
    const res = await fetch(apiUrl, { 
      method: 'GET',
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NextJS-App'
      }
    });
    
    console.log("Response received:");
    console.log("Status:", res.status);
    console.log("Status text:", res.statusText);
    console.log("Content-Type:", res.headers.get('content-type'));
    
    // Check if response is HTML (indicating auth redirect)
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      console.error("❌ Received HTML response instead of JSON - likely authentication issue");
      const htmlContent = await res.text();
      console.error("HTML content preview:", htmlContent.substring(0, 200) + "...");
      return null;
    }
    
    if (!res.ok) {
      console.error(`❌ HTTP Error: ${res.status} ${res.statusText}`);
      
      // Try to get error details
      const errorText = await res.text();
      console.error("Error response body:", errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Parsed error:", errorJson);
      } catch (e) {
        console.error("Could not parse error as JSON");
      }
      
      return null;
    }

    const data = await res.json();
    console.log("✅ Success! Response data keys:", Object.keys(data));
    console.log("Response success:", data.success);
    console.log("Product exists:", !!data.product);
    console.log("=== CLIENT FETCH DEBUG END ===");
    
    return data.product || null;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    console.log("=== CLIENT FETCH DEBUG END (ERROR) ===");
    return null;
  }
};

export default async function Page({ params }: { params: { slug: string } }) {
  console.log("=== PAGE COMPONENT DEBUG ===");
  console.log("Raw params:", params);
  
  const resolvedParams = await Promise.resolve(params);
  console.log("Resolved params:", resolvedParams);
  console.log("Slug from params:", resolvedParams.slug);
  
  const product = await getProductBySlug(resolvedParams.slug);
  console.log("Final product result:", !!product);

  if (!product) {
    console.log("Product not found, returning 404");
    return notFound();
  }

  console.log("Rendering ProductPage component");
  return <ProductPage product={product} />;
}

