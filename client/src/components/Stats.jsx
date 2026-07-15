import { FaUsers, FaTools, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

function Stats() {

  const stats = [

    {
      number: "10,000+",
      title: "Happy Customers",
      icon: <FaUsers className="text-5xl text-orange-500" />
    },

    {
      number: "500+",
      title: "Verified Workers",
      icon: <FaTools className="text-5xl text-orange-500" />
    },

    {
      number: "50+",
      title: "Cities Covered",
      icon: <FaMapMarkerAlt className="text-5xl text-orange-500" />
    },

    {
      number: "25+",
      title: "Services",
      icon: <FaCheckCircle className="text-5xl text-orange-500" />
    }

  ];

  return (

    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {

            stats.map((item, index) => (

              <div
                key={index}
                className="bg-gray-100 rounded-xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-2 duration-300"
              >

                <div className="flex justify-center">

                  {item.icon}

                </div>

                <h1 className="text-4xl font-bold mt-5">

                  {item.number}

                </h1>

                <p className="text-gray-500 mt-3">

                  {item.title}

                </p>

              </div>

            ))

          }

        </div>

      </div>

    </section>

  );

}

export default Stats;