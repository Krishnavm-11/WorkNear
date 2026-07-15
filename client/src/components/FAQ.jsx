import { useState } from "react";

function FAQ() {

  const faqs = [

    {
      question: "How do I book a worker?",
      answer:
        "Go to the Workers page, select a worker, and click the Book Now button."
    },

    {
      question: "Are all workers verified?",
      answer:
        "Yes. Every worker is reviewed by the admin before approval."
    },

    {
      question: "Can I cancel my booking?",
      answer:
        "Yes. You can cancel your booking before the service starts."
    },

    {
      question: "How can I become a worker?",
      answer:
        "Register as a Worker while creating your account and complete your profile."
    },

    {
      question: "How do I submit a complaint?",
      answer:
        "Open your Profile and click Register Complaint."
    }

  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {

    if (openIndex === index) {

      setOpenIndex(null);

    } else {

      setOpenIndex(index);

    }

  };

  return (

    <section className="bg-white py-20">

      <div className="max-w-4xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">

          Frequently Asked Questions

        </h2>

        <p className="text-center text-gray-500 mt-4 mb-12">

          Find answers to common questions.

        </p>

        {

          faqs.map((faq, index) => (

            <div
              key={index}
              className="border rounded-lg mb-4 shadow-sm"
            >

              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold"
              >

                {faq.question}

                <span className="text-2xl text-orange-500">

                  {openIndex === index ? "-" : "+"}

                </span>

              </button>

              {

                openIndex === index && (

                  <div className="px-5 pb-5 text-gray-600">

                    {faq.answer}

                  </div>

                )

              }

            </div>

          ))

        }

      </div>

    </section>

  );

}

export default FAQ;