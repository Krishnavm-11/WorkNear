import { FaSearch } from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center">

          <h1 className="text-5xl font-bold leading-tight">

            Find Trusted

            <span className="text-orange-500">
              {" "}Local Workers
            </span>

          </h1>

          <p className="mt-6 text-lg text-gray-300">

            Book electricians, plumbers, tutors,
            cleaners and many more near your location.

          </p>

          <div className="mt-10 flex justify-center">

            <div className="flex bg-white rounded-xl overflow-hidden shadow-lg w-full max-w-2xl">

              <input
                type="text"
                placeholder="Search worker..."
                className="flex-1 px-5 py-4 text-black outline-none"
              />

              <button
                className="bg-orange-500 px-8 hover:bg-orange-600 duration-300"
              >
                <FaSearch size={22} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;