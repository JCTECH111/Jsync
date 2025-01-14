const Hero = () => {
  return (
    <section id="hero" className="py-20 bg-gray-900">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to <span className="text-blue-400">Jsync</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          The ultimate tool to upload, manage, and share files with ease and
          security.
        </p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
