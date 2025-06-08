// import { dbConnect } from "@/utils/dbconnect";
// import { Category } from "@/models/Category";
// import { NextApiRequest, NextApiResponse } from 'next';

// async function getCategories(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   try {
//     const categories = await Category.find({});
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch categories' });
//   }
// }

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     return getCategories(req, res);
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// // Export the handler function as a named export for each HTTP method
// export { getCategories };


import { dbConnect } from "@/utils/dbconnect";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({});
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
