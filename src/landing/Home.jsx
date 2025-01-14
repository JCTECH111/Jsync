import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import PrivacySecurity from "./components/PrivacySecurity";
import NoteFromCreator from "./components/NoteFromCreator";

// import Testimonials from "./components/Testimonials";
// import Pricing from "./components/Pricing";
// import FAQ from "./components/FAQ";
// import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div className="scroll-smooth p-[1rem] bg-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <PrivacySecurity />
      <NoteFromCreator />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      {/* <FAQ /> */}
      {/* <CallToAction /> */}
      <Footer />
    </div>
  );
};

export default Home;
