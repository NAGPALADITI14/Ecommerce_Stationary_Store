"use client"
import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";
import Image from "next/image";
import SignupPage from "./login/page";

export default function Home() {
  return (
    <div>
      
      {/* <div className="text-black">welcome to Students point</div> */}
      <SignupPage/>
    </div>
  );
}

// import dynamic from 'next/dynamic'

// const AuthPage = dynamic(() => import('../app/login/page'), {
//   ssr: false,
// })

// export default function Home() {
//   return (
//     <main>
//       <AuthPage />
//     </main>
//   )
// }


// import dynamic from 'next/dynamic';

// // Dynamically import AuthPage with SSR disabled
// const AuthPage = dynamic(() => import('./login/Auth'), { ssr: false });

// export default function Home() {
//   return <AuthPage />;
// }
