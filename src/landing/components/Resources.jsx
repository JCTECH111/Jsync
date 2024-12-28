import React from "react";

const Resources = () => {
  const resources = [
    {
      title: "Documentation",
      description: "Learn how to use FileMaster effectively.",
      link: "#",
    },
    {
      title: "FAQs",
      description: "Find answers to common questions.",
      link: "#",
    },
    {
      title: "Tutorials",
      description: "Step-by-step guides to get you started.",
      link: "#",
    },
  ];

  return (
    <section id="resources" className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="block p-6 bg-white rounded-lg shadow hover:bg-blue-100"
            >
              <h3 className="text-xl font-bold">{resource.title}</h3>
              <p className="text-gray-600">{resource.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
