import React from "react";

const Features = () => {
  const features = [
    {
      title: "Secure Storage",
      description: "Your files are stored safely with advanced encryption.",
      icon: "https://via.placeholder.com/100",
    },
    {
      title: "Easy Sharing",
      description: "Share your files with anyone in just a few clicks.",
      icon: "https://via.placeholder.com/100",
    },
    {
      title: "Quick Search",
      description: "Find your files instantly with our powerful search tool.",
      icon: "https://via.placeholder.com/100",
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <img src={feature.icon} alt={feature.title} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
