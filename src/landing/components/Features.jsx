import { CloudIcon, ShareIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

const Features = () => {
  const features = [
    {
      title: "Secure Cloud Storage",
      description: "Upload and store your files with top-tier security.",
      icon: <CloudIcon className="w-14 h-14 text-blue-400 mx-auto" />,
    },
    {
      title: "Seamless File Sharing",
      description: "Easily share files with public or private links.",
      icon: <ShareIcon className="w-14 h-14 text-blue-400 mx-auto" />,
    },
    {
      title: "Cross-Platform Access",
      description: "Access files anytime, anywhere from any device.",
      icon: <DevicePhoneMobileIcon className="w-14 h-14 text-blue-400 mx-auto" />,
    },
  ];

  return (
    <section id="features" className="py-16 bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Why Choose Jsync?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 shadow-lg rounded-lg text-center hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
