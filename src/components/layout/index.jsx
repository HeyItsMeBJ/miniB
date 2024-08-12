import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PostList from "./PostList";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
