import {
  FaUserCheck,
  FaClock,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";

function WhyChoose() {
  const features = [
    {
      icon: FaUserCheck,
      title: "Verified Professionals",
      description:
        "Find professionals whose profiles have been reviewed by our team.",
    },
    {
      icon: FaClock,
      title: "Easy Scheduling",
      description:
        "Choose a suitable professional and arrange your service conveniently.",
    },
    {
      icon: FaStar,
      title: "Reviews That Help",
      description:
        "Compare available ratings and customer feedback before booking.",
    },
    {
      icon: FaShieldAlt,
      title: "Booking Confidence",
      description:
        "View worker details and booking information before making a decision.",
    },
  ];

  return (
    <section className="bg-[#f7f6f3] px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171717] p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-[#202020] sm:p-8"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={21} />
                </div>

                {/* Feature details */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="mt-auto flex items-center gap-2 pt-7">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 transition-transform duration-300 group-hover:scale-150" />
                  <div className="h-px w-10 bg-white/15 transition-all duration-300 group-hover:w-16 group-hover:bg-orange-500" />
                </div>

                {/* Decorative glow */}
                <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-orange-500/[0.04] blur-2xl transition-all duration-300 group-hover:bg-orange-500/10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;