import { ShieldCheckIcon, LockClosedIcon, KeyIcon } from "@heroicons/react/24/outline";

const PrivacySecurity = () => {
  const points = [
    {
      title: "End-to-End Encryption",
      description: "All your files are encrypted during upload, storage, and sharing, ensuring complete security.",
      icon: <ShieldCheckIcon className="w-14 h-14 text-blue-400 mx-auto" />,
    },
    {
      title: "Zero Knowledge Policy",
      description: "Only you have access to your files. We cannot view or share your data.",
      icon: <LockClosedIcon className="w-14 h-14 text-blue-400 mx-auto" />,
    },
    {
      title: "Secure Access Keys",
      description: "Your account is protected with advanced multi-factor authentication and secure keys.",
      icon: <KeyIcon className="w-14 h-14 text-blue-400 mx-auto" />,
    },
  ];

  return (
    <section id="privacy" className="py-16 bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Privacy & Security Built-In</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Jsync prioritizes your privacy and security. With cutting-edge encryption and a commitment to zero knowledge, your data is always protected.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 shadow-lg rounded-lg text-center hover:shadow-xl transition"
            >
              <div className="mb-4">{point.icon}</div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">{point.title}</h3>
              <p className="text-gray-400">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacySecurity;
