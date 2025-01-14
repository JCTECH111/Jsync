const Testimonials = () => {
    const testimonials = [
      {
        name: "Jane Doe",
        role: "Tech Enthusiast",
        feedback:
          "Jsync has transformed how I manage my files. It's fast, secure, and user-friendly!",
      },
      {
        name: "John Smith",
        role: "Developer",
        feedback:
          "The sharing features are fantastic. I love how intuitive the platform is!",
      },
    ];
  
    return (
      <section className="py-16 bg-white p-2">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {testimonials.map((testimony, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 shadow-md rounded-lg w-full md:w-1/3"
              >
                <p className="text-gray-600 mb-4">{testimony.feedback}</p>
                <h3 className="text-lg font-semibold">{testimony.name}</h3>
                <p className="text-gray-500 text-sm">{testimony.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  export default Testimonials;
  