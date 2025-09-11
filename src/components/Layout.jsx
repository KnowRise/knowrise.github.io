import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[url('/img/bg.jpg')] bg-cover min-h-screen flex justify-center font-source-serif-4">
      <div className="md:max-w-[50%] w-full py-[2rem] px-[24px] md:px-0 text-gray-100 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
