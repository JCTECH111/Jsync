import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Resources from "./components/Resources";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Resources />
      <Footer />
    </div>
  );
};

export default Home;
