"use client";
import Slider from "./Slider";
import ProductList from "./ProductList";
import CategoryList from "./CategoryList";
const Homepage = () => {
  return (
    <div>
      <Slider />
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl  text-black">Feature Products</h1>
        <ProductList type="featured"/>
      </div>

      <div className="mt-24 ">
        <h1 className="text-2xl  px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12 text-black">
          Categories{" "}
        </h1>
        <CategoryList />
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl  text-black">New Products</h1>
        <ProductList type="latest"/>
      </div>
    </div>
  );
};
export default Homepage;
