import { dbConnect } from "@/utils/dbconnect";
import ProductModel from "@/models/product";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { category } = req.query;

  try {
    let query = {};
    if(category){
        query = {category:category};
    }
    const products = await ProductModel.find({ query }).lean();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
