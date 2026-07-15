import { FaUserCheck,FaClock,FaStar,FaShieldAlt } from "react-icons/fa";

function WhyChoose() {
  return (
    <section className="bg-gray-100 py-20">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Why Choose WorkNear?
        </h2>

        <p className="text-center text-gray-500 mt-3">
          We connect you with trusted local professionals quickly and safely.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

          <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-xl duration-300 text-center">

            <FaUserCheck className="text-orange-500 mx-auto" size={45} />

            <h3 className="text-xl font-bold mt-5">
              Verified Workers
            </h3>

            <p className="text-gray-500 mt-3">
              Every worker is verified before joining the platform.
            </p>

          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-xl duration-300 text-center">

            <FaClock className="text-orange-500 mx-auto" size={45} />

            <h3 className="text-xl font-bold mt-5">
              Quick Booking
            </h3>

            <p className="text-gray-500 mt-3">
              Book trusted workers in just a few clicks.
            </p>

          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-xl duration-300 text-center">

            <FaStar className="text-orange-500 mx-auto" size={45}  />

            <h3 className="text-xl font-bold mt-5">
              Top Rated
            </h3>

            <p className="text-gray-500 mt-3">
              Choose workers based on ratings and reviews.
            </p>

          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-xl duration-300 text-center">

            <FaShieldAlt className="text-orange-500 mx-auto" size={45} />
            
            <h3 className="text-xl font-bold mt-5">
              Safe & Secure
            </h3>

            <p className="text-gray-500 mt-3">
              Secure bookings and trusted professionals.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WhyChoose;