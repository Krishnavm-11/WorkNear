import { FaStar } from "react-icons/fa";

function Testimonials() {

  const reviews = [

    {
      name: "Rahul Sharma",
      job: "Electrician Service",
      review:
        "Booking an electrician was very easy. The worker arrived on time and completed the job perfectly."
    },

    {
      name: "Priya Singh",
      job: "House Cleaning",
      review:
        "Very professional service. The cleaner was polite and my house looked amazing afterwards."
    },

    {
      name: "Amit Kumar",
      job: "Plumbing",
      review:
        "Excellent platform! I found a plumber within minutes and the pricing was reasonable."
    }

  ];

  return (

    <section className="bg-gray-100 py-20">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">

          What Our Customers Say

        </h2>

        <p className="text-center text-gray-500 mt-4">

          Trusted by hundreds of happy customers.

        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {

            reviews.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl duration-300"
              >

                <div className="flex text-yellow-400 mb-4">

                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />

                </div>

                <p className="text-gray-600">

                  "{item.review}"

                </p>

                <h3 className="text-xl font-bold mt-6">

                  {item.name}

                </h3>

                <p className="text-orange-500">

                  {item.job}

                </p>

              </div>

            ))

          }

        </div>

      </div>

    </section>

  );

}

export default Testimonials;