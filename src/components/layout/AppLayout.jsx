import React from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-[#f0fdf4] to-white">
      <Sidebar />
      <div className="pl-64 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
