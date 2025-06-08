import Image from "next/image";
interface ProductImagesProps {
  items: { url: string; alt?: string }[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <Image key={index} src={item.url} alt={item.alt || "Product Image"} className="rounded-lg shadow-md" />
      ))}
    </div>
  );
};

export default ProductImages;
