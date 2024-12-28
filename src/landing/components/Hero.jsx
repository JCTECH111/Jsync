import React from "react";

const Hero = () => {
  return (
    <section className="bg-blue-600 text-white py-20 text-center">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4">Manage Your Files Effortlessly</h1>
        <p className="text-lg mb-6">Organize, share, and access your files anytime, anywhere.</p>
        <a
          href="/signin"
          className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold shadow hover:bg-gray-200"
        >
          Get Started
        </a>
      </div>
    </section>
  );
};

export default Hero;
