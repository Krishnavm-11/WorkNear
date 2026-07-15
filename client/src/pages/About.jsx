import { FaUsers, FaCheckCircle, FaTools, FaHandshake } from "react-icons/fa";

function About() {

  return (

    <div className="bg-gray-100 min-h-screen">

      <div className="bg-black text-white py-20">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            About <span className="text-orange-500">WorkNear</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            WorkNear helps customers find trusted local workers quickly,
            safely, and at affordable prices.
          </p>

        </div>

      </div>

      <div className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">

        <div>

          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
            alt="Workers"
            className="rounded-xl shadow-lg"
          />

        </div>

        <div>

          <h2 className="text-4xl font-bold mb-6">
            Who We Are
          </h2>

          <p className="text-gray-600 leading-8">

            WorkNear is a worker-finding platform where users can hire
            trusted electricians, plumbers, carpenters, painters,
            cleaners, tutors and many other professionals.

            Our mission is to make hiring local workers simple and secure.

          </p>

        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold text-center mb-12">

          Why Choose Us

        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">

            <FaUsers className="text-orange-500 text-5xl mx-auto" />

            <h3 className="text-xl font-bold mt-5">

              Trusted Workers

            </h3>

            <p className="text-gray-500 mt-3">

              Verified and experienced professionals.

            </p>

          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">

            <FaCheckCircle className="text-orange-500 text-5xl mx-auto" />

            <h3 className="text-xl font-bold mt-5">

              Easy Booking

            </h3>

            <p className="text-gray-500 mt-3">

              Book workers within minutes.

            </p>

          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">

            <FaTools className="text-orange-500 text-5xl mx-auto" />

            <h3 className="text-xl font-bold mt-5">

              Multiple Services

            </h3>

            <p className="text-gray-500 mt-3">

              20+ professional services available.

            </p>

          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">

            <FaHandshake className="text-orange-500 text-5xl mx-auto" />

            <h3 className="text-xl font-bold mt-5">

              Customer Support

            </h3>

            <p className="text-gray-500 mt-3">

              We are always here to help.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default About;