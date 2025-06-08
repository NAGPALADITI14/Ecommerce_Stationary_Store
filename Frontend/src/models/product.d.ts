export interface Product {
    _id: string;
    productId:string;
    name: string;
    description: string;
    price: {
      price: number;
      discountedPrice?: number;
    };
    stock: {
      quantity: number;
    };
    media: {
      items: Array<{url:string; alt?:string}>;
    };
    variants: {
      variantId: string;
      variantName: string;
      variantPrice: number;
    }[];
    productOptions: {
      optionName: string;
      optionValues: string[];
    }[];
    additionalInfoSections: {
      title: string;
      description: string;
    }[];
    category: string;
    slug: string;
  }