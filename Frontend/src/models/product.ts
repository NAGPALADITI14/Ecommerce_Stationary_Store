import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface
export interface IProduct extends Document {
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
    items: Array<{ url: string; alt?: string }>;
  };
  variants: {
    variantId: string;
    variantName: string;
    variantPrice: number;
    stock:{
      quantity:number;
    }
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
  isLatest: boolean;
}

// Define the Mongoose schema
const ProductSchema: Schema = new Schema(
  {
    productId:{type:String,required:true,unique:true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      price: { type: Number, required: true },
      discountedPrice: { type: Number, default: null },
    },
    stock: {
      quantity: { type: Number, required: true },
    },
    media: {
      items: [
        {
          url: { type: String, required: true },
          alt: { type: String },
        },
      ],
    },
    variants: [
      {
        variantId: { type: String, required: true },
        variantName: { type: String, required: true },
        variantPrice: { type: Number, required: true },
        stock:{type:Number,default:0},
      },
    ],
    productOptions: [
      {
        optionName: { type: String, required: true },
        optionValues: { type: [String], required: true },
      },
    ],
    additionalInfoSections: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    category: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isLatest: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

declare global {
  var mongoose: {
    Product?: mongoose.Model<IProduct>;
  };
}
let Product:Model<IProduct>;

try {
  Product = mongoose.model("Product") as Model<IProduct>; 
} catch (e: any) {
  if (e.name === 'MissingSchemaError') {
    Product = mongoose.model<IProduct>("Product", ProductSchema);
  } else {
    throw e; 
  }
}
export default Product;
