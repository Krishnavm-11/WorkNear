import {
  FaUsers,
  FaTools,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

function Stats() {
  const stats = [
    {
      number: "10,000+",
      title: "Happy Customers",
      icon: FaUsers,
      description: "People finding help locally",
    },
    {
      number: "500+",
      title: "Verified Workers",
      icon: FaTools,
      description: "Skilled service professionals",
    },
    {
      number: "50+",
      title: "Cities Covered",
      icon: FaMapMarkerAlt,
      description: "Connecting nearby communities",
    },
    {
      number: "25+",
      title: "Services",
      icon: FaCheckCircle,
      description: "Solutions for everyday needs",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Statistics grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-[#faf9f6] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-black/5 sm:p-7"
              >
                {/* Subtle decorative accent */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-orange-500/[0.04] transition-colors duration-300 group-hover:bg-orange-500/[0.09]" />

                <div className="relative flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 transition-all duration-300 group-hover:bg-orange-500">
                    <Icon className="text-xl text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <span className="h-px w-10 bg-gray-200 transition-all duration-300 group-hover:w-14 group-hover:bg-orange-400" />
                </div>

                <div className="relative mt-7">
                  <h2 className="text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
                    {item.number}
                  </h2>

                  <p className="mt-3 text-base font-semibold text-gray-800">
                    {item.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Stats;