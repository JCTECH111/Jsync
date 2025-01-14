import { EnvelopeIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";

const NoteFromCreator = () => {
    return (
        <section id="creator-note" className="py-16 bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto text-center">
                {/* Section Heading */}
                <h2 className="text-4xl font-extrabold text-white mb-8">
                    A Quick Note from the Creator
                </h2>

                {/* Paragraphs */}
                <div className="w-full p-[3rem] bg-gray-800 rounded-2xl">
                    <p className="text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
                        Hi there! My name is Nnamezie Jonathan aso known as JoeCode, and I’m the developer of Jsync. This project has been an exciting journey of merging technical innovation with a user-focused approach. My aim was to craft a platform that is secure, accessible, and intuitive for everyone.
                    </p>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Creating Jsync gave me the opportunity to explore cutting-edge technologies, learn from challenges, and prioritize privacy and security in the digital space. I hope you find it useful and enjoyable to use!
                    </p>
                </div>

                {/* Image */}
                {/* <div className="flex justify-center mb-8">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Developer"
                        className="w-36 h-36 rounded-full shadow-lg"
                    />
                </div> */}

                {/* Contact Links */}
                <div className="flex justify-center space-x-6 pt-6">
                    {/* Gmail Link */}
                    <a
                        href="mailto:your-email@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-red-400 transition-colors"
                    >
                        <EnvelopeIcon className="w-8 h-8 mr-2" />
                        <span className="text-lg font-medium">Gmail</span>
                    </a>

                    {/* WhatsApp Link */}
                    <a
                        href="https://wa.me/your-number"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-green-400 transition-colors"
                    >
                        <ChatBubbleOvalLeftIcon className="w-8 h-8 mr-2" />
                        <span className="text-lg font-medium">WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default NoteFromCreator;
