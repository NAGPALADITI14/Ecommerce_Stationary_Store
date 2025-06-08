import { dbConnect } from '@/utils/dbconnect';
import { Category } from '@/models/Category';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();

    const initialCategories = [
      { name: "Books", image: "https://i.pinimg.com/736x/92/f5/5c/92f55c8530b8610d24ea2f788bb045d4.jpg" },
      { name: "Stationary", image: "https://i.pinimg.com/736x/b8/49/5f/b8495f05446e42adf57cde608b4aa8a3.jpg" },
      { name: "Sports", image: "https://i.pinimg.com/736x/6c/35/b2/6c35b2afcc1cf770ed184656905ac519.jpg" },
      { name: "Art", image: "https://i.pinimg.com/736x/95/f4/01/95f401c9b16d3dd3bea9833c67de0ba7.jpg" },
      { name: "Gym and Fitness", image: "https://i.pinimg.com/736x/c5/d1/9a/c5d19abe064db33479726a6f85019f2a.jpg" },
    ];

    try {
      await Category.insertMany(initialCategories);
      res.status(200).json({ message: "Categories seeded successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed categories" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
