import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      <div className="flex-1 flex justify-center md:px-6 md:py-2">
        <div className="w-full max-w-6xl min-h-[80vh] bg-[linear-gradient(180deg,_#E5EEF5_0%,_#E3ECF4_7.34%,_#D0E3F1_43.94%,_#E9F0F4_100%)] px-6">
          <Navbar />
          <Outlet />
     
        </div>
      </div>
    </div>
  );
}
