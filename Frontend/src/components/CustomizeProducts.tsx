interface CustomizeProductsProps {
  productId: string;
  variants: { variantId: string; variantName: string; variantPrice: number }[];
  productOptions: { optionName: string; optionValues: string[] }[];
}

const CustomizeProducts: React.FC<CustomizeProductsProps> = ({ productId, variants, productOptions }) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Customize Your Product</h3>
      <div className="mt-4">
        {variants.map((variant) => (
          <button key={variant.variantId} className="p-2 border rounded-md mr-2">
            {variant.variantName} - ${variant.variantPrice}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {productOptions.map((option) => (
          <div key={option.optionName} className="mt-2">
            <h4 className="text-md font-semibold">{option.optionName}</h4>
            <div className="flex gap-2">
              {option.optionValues.map((value) => (
                <span key={value} className="p-1 border rounded-md text-sm">
                  {value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizeProducts;


// "use client";
// const CustomizeProducts = () => {
//   return (
//     <div className="flex flex-col gap-6">
//       <h4 className="font-medium text-black">Choose a Color</h4>
//       <ul className="flex items-center gap-3">
//         <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-red-500">
//           <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//         </li>
//         <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-blue-500"></li>
//         <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-not-allowed relative bg-green-500">
//           <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//         </li>
//       </ul>
//       <h4 className="font-medium text-black">Choose a size</h4>
//       <ul className="flex items-center gap-3">
//         <li className="ring-1 ring-red-400 text-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">
//           Single 
//         </li>
//         <li className="ring-1 ring-red-400 text-white bg-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">
//          Pack of 4
//         </li>
//         <li className="ring-1 ring-pink-400 text-white bg-pink-400 rounded-md py-1 px-4 text-sm cursor-not-allowed">
//           Pack of 8
//         </li>
//       </ul>
//     </div>
//   );
// };
// export default CustomizeProducts;

//     "use client";

// import { products } from "@wix/stores";
// import { useEffect, useState } from "react";
// import Add from "./Add";

// const CustomizeProducts = ({
//   productId,
//   variants,
//   productOptions,
// }: {
//   productId: string;
//   variants: products.Variant[];
//   productOptions: products.ProductOption[];
// }) => {
//   const [selectedOptions, setSelectedOptions] = useState<{
//     [key: string]: string;
//   }>({});
//   const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

//   useEffect(() => {
//     const variant = variants.find((v) => {
//       const variantChoices = v.choices;
//       if (!variantChoices) return false;
//       return Object.entries(selectedOptions).every(
//         ([key, value]) => variantChoices[key] === value
//       );
//     });
//     setSelectedVariant(variant);
//   }, [selectedOptions, variants]);

//   const handleOptionSelect = (optionType: string, choice: string) => {
//     setSelectedOptions((prev) => ({ ...prev, [optionType]: choice }));
//   };

//   const isVariantInStock = (choices: { [key: string]: string }) => {
//     return variants.some((variant) => {
//       const variantChoices = variant.choices;
//       if (!variantChoices) return false;

//       return (
//         Object.entries(choices).every(
//           ([key, value]) => variantChoices[key] === value
//         ) &&
//         variant.stock?.inStock &&
//         variant.stock?.quantity &&
//         variant.stock?.quantity > 0
//       );
//     });
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       {productOptions.map((option) => (
//         <div className="flex flex-col gap-4" key={option.name}>
//           <h4 className="font-medium">Choose a {option.name}</h4>
//           <ul className="flex items-center gap-3">
//             {option.choices?.map((choice) => {
//               const disabled = !isVariantInStock({
//                 ...selectedOptions,
//                 [option.name!]: choice.description!,
//               });

//               const selected =
//                 selectedOptions[option.name!] === choice.description;

//               const clickHandler = disabled
//                 ? undefined
//                 : () => handleOptionSelect(option.name!, choice.description!);

//               return option.name === "Color" ? (
//                 <li
//                   className="w-8 h-8 rounded-full ring-1 ring-gray-300 relative"
//                   style={{
//                     backgroundColor: choice.value,
//                     cursor: disabled ? "not-allowed" : "pointer",
//                   }}
//                   onClick={clickHandler}
//                   key={choice.description}
//                 >
//                   {selected && (
//                     <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//                   )}
//                   {disabled && (
//                     <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//                   )}
//                 </li>
//               ) : (
//                 <li
//                   className="ring-1 ring-red-400 text-red-400 rounded-md py-1 px-4 text-sm"
//                   style={{
//                     cursor: disabled ? "not-allowed" : "pointer",
//                     backgroundColor: selected
//                       ? "#f35c7a"
//                       : disabled
//                       ? "#FBCFE8"
//                       : "white",
//                     color: selected || disabled ? "white" : "#f35c7a",
//                     boxShadow: disabled ? "none" : "",

//                   }}
//                   key={choice.description}
//                   onClick={clickHandler}
//                 >
//                   {choice.description}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       ))}
//       <Add
//         productId={productId}
//         variantId={
//           selectedVariant?._id || "00000000-0000-0000-0000-000000000000"
//         }
//         stockNumber={selectedVariant?.stock?.quantity || 0}
//       />
//       {/* COLOR */}
//       {/*
//           <ul className="flex items-center gap-3">
//             <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-red-500">
//               <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//             </li>
//             <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-blue-500"></li>
//             <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-not-allowed relative bg-green-500">
//               <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
//             </li>
//           </ul> */}
//       {/* OTHERS */}
//       {/* <h4 className="font-medium">Choose a size</h4>
//       <ul className="flex items-center gap-3">
//         <li className="ring-1 ring-red-400 text-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">
//           Small
//         </li>
//         <li className="ring-1 ring-red-400 text-white bg-red-400 rounded-md py-1 px-4 text-sm cursor-pointer">
//           Medium
//         </li>
//         <li className="ring-1 ring-pink-200 text-white bg-pink-200 rounded-md py-1 px-4 text-sm cursor-not-allowed">
//           Large
//         </li>
//       </ul> */}
//     </div>
//   );
// };

// export default CustomizeProducts;
