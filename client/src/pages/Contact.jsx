import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

function Contact() {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Hero Section */}

      <div className="bg-black text-white py-20">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Contact <span className="text-orange-500">Us</span>
          </h1>

          <p className="mt-5 text-lg text-gray-300">
            We'd love to hear from you. Reach out to us anytime.
          </p>

        </div>

      </div>

      {/* Contact Section */}

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">

        {/* Left Side */}

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-3xl font-bold mb-8">
            Get In Touch
          </h2>

          <div className="flex items-center gap-5 mb-8">

            <FaMapMarkerAlt className="text-orange-500 text-3xl"/>

            <div>

              <h3 className="font-bold">
                Address
              </h3>

              <p className="text-gray-500">
                Bengaluru, Karnataka, India
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 mb-8">

            <FaPhoneAlt className="text-orange-500 text-3xl"/>

            <div>

              <h3 className="font-bold">
                Phone
              </h3>

              <p className="text-gray-500">
                +91 9876543210
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5 mb-8">

            <FaEnvelope className="text-orange-500 text-3xl"/>

            <div>

              <h3 className="font-bold">
                Email
              </h3>

              <p className="text-gray-500">
                support@worknear.com
              </p>

            </div>

          </div>

          <div className="flex items-center gap-5">

            <FaClock className="text-orange-500 text-3xl"/>

            <div>

              <h3 className="font-bold">
                Working Hours
              </h3>

              <p className="text-gray-500">
                Monday - Saturday (9 AM - 7 PM)
              </p>

            </div>

          </div>

        </div>

        {/* Contact Form */}

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h2 className="text-3xl font-bold mb-8">
            Send Message
          </h2>

          <form>

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border p-4 rounded-lg mb-5 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border p-4 rounded-lg mb-5 outline-none"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border p-4 rounded-lg mb-5 outline-none"
            />

            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full border p-4 rounded-lg mb-5 outline-none"
            ></textarea>

            <button
              className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 duration-300"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;