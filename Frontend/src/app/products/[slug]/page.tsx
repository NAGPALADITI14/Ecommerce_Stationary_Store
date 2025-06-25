import { notFound } from "next/navigation";
import ProductPage from "@/components/Productpage"; 
import { IProduct } from "@/models/product";

const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  console.log("=== CLIENT FETCH DEBUG START ===");
  console.log("Input slug:", slug);
  console.log("Slug type:", typeof slug);
  console.log("Slug length:", slug?.length);
  
  // Validate input
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    console.error("❌ Invalid slug provided to getProductBySlug");
    return null;
  }
  
  const getBaseUrl = () => {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    return 'http://localhost:3000';
  };

  const baseUrl = getBaseUrl();
  const cleanSlug = slug.trim();
  const apiUrl = `${baseUrl}/api/products/${encodeURIComponent(cleanSlug)}`;
  
  console.log("Base URL:", baseUrl);
  console.log("Clean slug:", cleanSlug);
  console.log("Full API URL:", apiUrl);

  try {
    console.log("Making fetch request...");
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App'
      }
    });
    
    console.log("Response received:");
    console.log("Status:", res.status);
    console.log("Status text:", res.statusText);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    
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







// import { notFound } from "next/navigation";
// import ProductPage from "@/components/Productpage"; 
// import { IProduct } from "@/models/product";

// const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
//   // For production deployment, use absolute URL construction
//   const getBaseUrl = () => {
//     // If running on Vercel, use the deployment URL
//     if (process.env.VERCEL_URL) {
//       return `https://${process.env.VERCEL_URL}`;
//     }
//     // If NEXT_PUBLIC_API_BASE_URL is set, use it
//     if (process.env.NEXT_PUBLIC_API_BASE_URL) {
//       return process.env.NEXT_PUBLIC_API_BASE_URL;
//     }
//     // Fallback for local development
//     return 'http://localhost:3000';
//   };

//   const baseUrl = getBaseUrl();
//   const apiUrl = `${baseUrl}/api/products/${slug}`;
  
//   console.log("Fetching from URL:", apiUrl); // Add debugging

//   try {
//     const res = await fetch(apiUrl, { 
//       cache: "no-store",
//       // Add headers for better compatibility
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
    
//     console.log("Response status:", res.status); // Add debugging
    
//     if (!res.ok) {
//       console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
//       return null;
//     }

//     const data = await res.json();
//     console.log("Response data:", data); // Add debugging
    
//     return data.product || null;
//   } catch (error) {
//     console.error("Failed to fetch product:", error);
//     return null;
//   }
// };

// export default async function Page({ params }: { params: { slug: string } }) {
//   // Await params if they're a Promise (Next.js 15+ behavior)
//   const resolvedParams = await Promise.resolve(params);
//   const product = await getProductBySlug(resolvedParams.slug);

//   if (!product) return notFound();

//   return <ProductPage product={product} />;
// }









// import { notFound } from "next/navigation";
// import ProductPage from "@/components/Productpage"; 
// import { IProduct } from "@/models/product";



// const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000' ;
//   const apiUrl = `${baseUrl}/api/products/${slug}`;
//   // Fallback for local development if the env var is missing
//   // const apiUrl = `${baseUrl ?? "http://localhost:3000"}/api/products/${slug}`;
//   // const apiUrl = `/api/products/${slug}`;
//   // const apiUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (baseUrl ?? "http://localhost:3000")}/api/products/${slug}`;

//   try {
//     // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
//     //   cache: "no-store", // avoid caching if you want fresh data
//     // });
//     const res = await fetch(apiUrl, { cache: "no-store" });
//     if (!res.ok) return null;

//     const data = await res.json();
//     return data.product || null;
//   } catch (error) {
//     console.error("Failed to fetch product:", error);
//     return null;
//   }
// };

// export default async function Page({ params }: { params: { slug: string } }) {
//   const product = await getProductBySlug(params.slug);

//   if (!product) return notFound();

//   return <ProductPage product={product} />;
// }





// // import Add from "@/components/Add";
// // import CustomizeProducts from "@/components/CustomizeProducts";
// // import ProductImages from "@/components/ProductImages";
// // import { notFound } from "next/navigation";
// // import { dbConnect } from "@/utils/dbconnect";
// // import ProductModel from "@/models/product";
// // import type { Product } from "@/models/product.d";
// // import ProductPage from "@/components/Productpage";

// // interface Params {
// //   slug: string;
// // }
// // // const SinglePage = async ({ params }: { params: { slug: string } }) => {
// //   const SinglePage = async ({ params }: { params: Params }) => {
// // await dbConnect();

// //   if (!params?.slug) return notFound();

// //   try {
// //     // const product :Product | null=await ProductModel.findOne({
// //     //   // slug: { $regex: new RegExp(`^${params.slug}$`, "i") },
// //     //   slug: params.slug,
// //     // }).lean();
// //     // const product = (await ProductModel.findOne({ slug: params.slug }).lean()) as IProduct | null;
    
    
// //     // const product = JSON.parse(JSON.stringify(await ProductModel.findOne({ slug: params.slug }).lean()));
// //     console.log("Searching for slug:", params.slug);
// //     const product = JSON.parse(JSON.stringify(
// //       await ProductModel.findOne({ slug: { $regex: new RegExp(`^${params.slug}$`, "i") } }).lean()
// //     ));
// //     // console.log("Searching for slug:", params.slug);

    
    
// //     if (!product) 
// //       {
// //         console.log("No product found for slug:", params.slug);
// //         return notFound();
// //       }
// //       console.log("Fetched Product:", product);
// //     // const typedProduct = product as unknown as Product;
// //     //   <ProductPage product={typedProduct} />
// //     // if (!product) return notFound();

// //     return <ProductPage product={product} />;
// //   } catch (error) {
// //     console.error("Error fetching product:", error);
// //     return notFound();
// //   }
// // };

// // export default SinglePage;









// // "use client";

// // import Add from "@/components/Add";
// // import CustomizeProducts from "@/components/CustomizeProducts";
// // import ProductImages from "@/components/ProductImages";
// // import { notFound } from "next/navigation";
// // import { dbConnect } from "@/utils/dbconnect";
// // import ProductModel from "@/models/product";
// // import type { Product } from "@/models/product.d";
// // import { Suspense } from "react";

// // const SinglePage = async ({ params }: { params: { slug: string } }) => {
// //   // Connect to MongoDB
// //   await dbConnect();
// //   console.log("MONGODB_URI in page.tsx:", process.env.MONGODB_URI);

// //   // Ensure slug is provided
// //   if (!params?.slug) {
// //     console.error("Slug is undefined");
// //     return notFound();
// //   }

// //   try {
// //     // Log the slug
// //     console.log("Slug:", params.slug);

// //     // Fetch product from the database
// //     const product: Product | null = await ProductModel.findOne({
// //       slug: { $regex: new RegExp(`^${params.slug}$`, "i") },
// //     })
// //       .lean()
// //       .exec() as Product | null;

// //     // Handle product not found
// //     if (!product) {
// //       console.error("Product not found for slug:", params.slug);
// //       return notFound();
// //     }

// //     // Log the fetched product
// //     console.log("Product found:", product);

// //     return (
// //       <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
// //         {/* Product Images */}
// //         <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
// //           <ProductImages items={product.media?.items || []} />
// //         </div>

// //         {/* Product Details */}
// //         <div className="w-full lg:w-1/2 flex flex-col gap-6">
// //           <h1 className="text-4xl font-medium">{product.name}</h1>
// //           <p className="text-gray-500">{product.description}</p>
// //           <Separator />

// //           {/* Price Display */}
// //           <PriceDisplay price={product.price} />
// //           <Separator />

// //           {/* Variants or Add to Cart */}
// //           {product.variants?.length > 0 && product.productOptions?.length > 0 ? (
// //             <CustomizeProducts
// //               productId={product._id}
// //               variants={product.variants}
// //               productOptions={product.productOptions}
// //             />
// //           ) : (
// //             <Add
// //               productId={product._id}
// //               variantId="00000000-0000-0000-0000-000000000000"
// //               stockNumber={product.stock?.quantity || 0}
// //             />
// //           )}
// //           <Separator />

// //           {/* Additional Info Sections */}
// //           {product.additionalInfoSections?.map((section) => (
// //             <InfoSection key={section.title} title={section.title} description={section.description} />
// //           ))}
// //           <Separator />

// //           {/* User Reviews */}
// //           <h1 className="text-2xl text-black">User Reviews</h1>
// //           <Suspense fallback="Loading...">
// //             <Reviews productId={product._id} />
// //           </Suspense>
// //         </div>
// //       </div>
// //     );
// //   } catch (error) {
// //     console.error("Error fetching product:", error);
// //     return notFound();
// //   }
// // };

// // export default SinglePage;

// // // Helper Components
// // const Separator = () => <div className="h-[2px] bg-gray-100" />;

// // const PriceDisplay = ({ price }: { price: Product["price"] }) => (
// //   price.discountedPrice && price.price !== price.discountedPrice ? (
// //     <div className="flex items-center gap-4">
// //       <h3 className="text-xl text-gray-500 line-through">${price.price}</h3>
// //       <h2 className="font-medium text-2xl text-black">${price.discountedPrice}</h2>
// //     </div>
// //   ) : (
// //     <h2 className="font-medium text-2xl">${price.price}</h2>
// //   )
// // );

// // const InfoSection = ({ title, description }: { title: string; description: string }) => (
// //   <div className="text-sm">
// //     <h4 className="font-medium mb-4">{title}</h4>
// //     <p className="text-black">{description}</p>
// //   </div>
// // );

// // const Reviews = ({ productId }: { productId: string }) => (
// //   <div>Reviews for product {productId}</div>
// // );




// // "use client"
// // import Add from "@/components/Add";
// // import CustomizeProducts from "@/components/CustomizeProducts";
// // import ProductImages from "@/components/ProductImages";
// // import { notFound } from "next/navigation";
// // import { dbConnect } from "@/utils/dbconnect";
// // import ProductModel from "@/models/product";
// // import { Product } from "@/models/product.d";
// // import { Suspense } from "react";

// // const SinglePage = async ({ params }: { params: { slug: string } }) => {
// //   await dbConnect();
// //   console.log("MONGODB_URI in page.tsx:", process.env.MONGODB_URI);

// //   // Ensure params.slug is defined
// //   if (!params?.slug) {
// //     console.error("Slug is undefined");
// //     return notFound();
// //   }

// //   try {
// //     // Log the slug for debugging
// //     console.log("Slug:", params.slug);

// //     // Query the database
// //     // const product: Product | null = await ProductModel.findOne({ slug: params.slug }).lean() as Product | null;
// //     const product: Product | null = await ProductModel.findOne({
// //       slug: { $regex: new RegExp(`^${params.slug}$`, "i") },
// //     }).lean() as Product | null;
    
// //     // Handle the case where the product is not found
// //     if (!product) {
// //       console.error("Product not found for slug:", params.slug);
// //       return notFound();
// //     }

// //     // Log the product for debugging
// //     console.log("Product found :", product);

// //     return (
// //       <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
// //         {/* Product Images */}
// //         <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
// //           <ProductImages items={product.media?.items || []} />
// //         </div>

// //         {/* Product Details */}
// //         <div className="w-full lg:w-1/2 flex flex-col gap-6">
// //           <h1 className="text-4xl font-medium">{product.name}</h1>
// //           <p className="text-gray-500">{product.description}</p>
// //           <Separator />

// //           {/* Price Display */}
// //           <PriceDisplay price={product.price} />
// //           <Separator />

// //           {/* Variants or Add to Cart */}
// //           {product.variants?.length > 0 && product.productOptions?.length > 0 ? (
// //             <CustomizeProducts
// //               productId={product._id}
// //               variants={product.variants}
// //               productOptions={product.productOptions}
// //             />
// //           ) : (
// //             <Add
// //               productId={product._id}
// //               variantId="00000000-0000-0000-0000-000000000000"
// //               stockNumber={product.stock?.quantity || 0}
// //             />
// //           )}
// //           <Separator />

// //           {/* Additional Info */}
// //           {product.additionalInfoSections?.map((section) => (
// //             <InfoSection key={section.title} title={section.title} description={section.description} />
// //           ))}
// //           <Separator />

// //           {/* User Reviews */}
// //           <h1 className="text-2xl text-black">User Reviews</h1>
// //           <Suspense fallback="Loading...">
// //             <Reviews productId={product._id} />
// //           </Suspense>
// //         </div>
// //       </div>
// //     );
// //   } catch (error) {
// //     console.error("Error fetching product:", error);
// //     return notFound();
// //   }
// // };

// // export default SinglePage;

// // // Helper Components
// // const Separator = () => <div className="h-[2px] bg-gray-100" />;

// // const PriceDisplay = ({ price }: { price: Product["price"] }) => (
// //   price.price === price.discountedPrice ? (
// //     <h2 className="font-medium text-2xl">${price.price}</h2>
// //   ) : (
// //     <div className="flex items-center gap-4">
// //       <h3 className="text-xl text-gray-500 line-through">${price.price}</h3>
// //       <h2 className="font-medium text-2xl text-black">${price.discountedPrice}</h2>
// //     </div>
// //   )
// // );

// // const InfoSection = ({ title, description }: { title: string; description: string }) => (
// //   <div className="text-sm">
// //     <h4 className="font-medium mb-4">{title}</h4>
// //     <p className="text-black">{description}</p>
// //   </div>
// // );

// // const Reviews = ({ productId }: { productId: string }) => (
// //   <div>Reviews for product {productId}</div>
// // );




// // import Add from "@/components/Add";
// // import CustomizeProducts from "@/components/CustomizeProducts";
// // import ProductImages from "@/components/ProductImages";
// // import { notFound } from "next/navigation";
// // import { dbConnect } from "@/utils/dbconnect";
// // import { Product as ProductModel } from "@/models/product";
// // import { Product } from "@/models/product.d";
// // import { Suspense } from "react";

// // const SinglePage = async ({ params }: { params: { slug: string } }) => {
// //   await dbConnect();

// //   console.log("Slug:", params.slug);
// //   const product: Product | null = await ProductModel.findOne({ slug: params.slug }).lean() as Product | null;
// //   console.log("Product:", product);
// //   if (!product) return notFound();

// //   return (
// //     <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
// //       {/* Product Images */}
// //       <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
// //         <ProductImages items={product.media?.items || []} />
// //       </div>

// //       {/* Product Details */}
// //       <div className="w-full lg:w-1/2 flex flex-col gap-6">
// //         <h1 className="text-4xl font-medium">{product.name}</h1>
// //         <p className="text-gray-500">{product.description}</p>
// //         <Separator />

// //         {/* Price Display */}
// //         <PriceDisplay price={product.price} />
// //         <Separator />

// //         {/* Variants or Add to Cart */}
// //         {product.variants.length > 0 && product.productOptions.length > 0 ? (
// //           <CustomizeProducts
// //             productId={product._id}
// //             variants={product.variants}
// //             productOptions={product.productOptions}
// //           />
// //         ) : (
// //           <Add productId={product._id} variantId="00000000-0000-0000-0000-000000000000" stockNumber={product.stock?.quantity || 0} />
// //         )}
// //         <Separator />

// //         {/* Additional Info */}
// //         {product.additionalInfoSections?.map((section) => (
// //           <InfoSection key={section.title} title={section.title} description={section.description} />
// //         ))}
// //         <Separator />
// //       </div>
// //     </div>
// //   );
// // };

// // export default SinglePage;

// // // Helper Components
// // const Separator = () => <div className="h-[2px] bg-gray-100" />;

// // const PriceDisplay = ({ price }: { price: Product["price"] }) => (
// //   price.price === price.discountedPrice ? (
// //     <h2 className="font-medium text-2xl">${price.price}</h2>
// //   ) : (
// //     <div className="flex items-center gap-4">
// //       <h3 className="text-xl text-gray-500 line-through">${price.price}</h3>
// //       <h2 className="font-medium text-2xl text-black">${price.discountedPrice}</h2>
// //     </div>
// //   )
// // );

// // const InfoSection = ({ title, description }: { title: string; description: string }) => (
// //   <div className="text-sm">
// //     <h4 className="font-medium mb-4">{title}</h4>
// //     <p className="text-black">{description}</p>
// //   </div>
// // );



// // import Add from "@/components/Add";
// // import CustomizeProducts from "@/components/CustomizeProducts";
// // import ProductImages from "@/components/ProductImages";
// // import { notFound } from "next/navigation";
// // import { dbConnect } from "@/utils/dbconnect";
// // import { Product as ProductModel } from "@/models/product";
// // import { Product } from "@/models/product.d";
// // import { Suspense } from "react";

// // const SinglePage = async ({ params }: { params: { slug: string } }) => {
// //   await dbConnect();
  
// //   const product: Product | null = await ProductModel.findOne({ slug: params.slug }).lean() as Product | null;

// //   if (!product) return notFound();

// //   return (
// //     <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
// //       {/* Product Images */}
// //       <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
// //         <ProductImages items={product.media?.items} />
// //       </div>
      
// //       {/* Product Details */}
// //       <div className="w-full lg:w-1/2 flex flex-col gap-6">
// //         <h1 className="text-4xl font-medium">{product.name}</h1>
// //         <p className="text-gray-500">{product.description}</p>
// //         <Separator />
        
// //         {/* Price Display */}
// //         <PriceDisplay price={product.price} />
// //         <Separator />
        
// //         {/* Variants or Add to Cart */}
// //         {product.variants && product.productOptions ? (
// //           <CustomizeProducts
// //             productId={product._id}
// //             variants={product.variants}
// //             productOptions={product.productOptions}
// //           />
// //         ) : (
// //           <Add productId={product._id} variantId="00000000-0000-0000-0000-000000000000" stockNumber={product.stock?.quantity || 0} />
// //         )}
// //         <Separator />
        
// //         {/* Additional Info */}
// //         {product.additionalInfoSections?.map((section) => (
// //           <InfoSection key={section.title} title={section.title} description={section.description} />
// //         ))}
// //         <Separator />
        
// //       </div>
// //     </div>
// //   );
// // };

// // export default SinglePage;

// // // Helper Components
// // const Separator = () => <div className="h-[2px] bg-gray-100" />;

// // const PriceDisplay = ({ price }: { price: Product["price"] }) => (
// //   price.price === price.discountedPrice ? (
// //     <h2 className="font-medium text-2xl">${price.price}</h2>
// //   ) : (
// //     <div className="flex items-center gap-4">
// //       <h3 className="text-xl text-gray-500 line-through">${price.price}</h3>
// //       <h2 className="font-medium text-2xl text-black">${price.discountedPrice}</h2>
// //     </div>
// //   )
// // );

// // const InfoSection = ({ title, description }: { title: string; description: string }) => (
// //   <div className="text-sm">
// //     <h4 className="font-medium mb-4">{title}</h4>
// //     <p className="text-black">{description}</p>
// //   </div>
// // );

