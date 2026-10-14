import {
  FaArrowRight,
  FaBullseye,
  FaEnvelope,
  FaTools,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const services = [
    "Plumbers",
    "Electricians",
    "Carpenters",
    "Painters",
    "Home Cleaners",
    "Tutors",
  ];

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#090909] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-500/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top CTA */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
              WorkNear · Local Services
            </p>

            <h2 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              The right professional,
              <br className="hidden sm:block" /> right around the corner.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Find reliable local workers for your everyday needs, all in
              one place.
            </p>
          </div>

          <Link
            to="/workers"
            className="inline-flex w-fit items-center gap-3 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-black transition duration-300 hover:bg-orange-400"
          >
            Explore Workers
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-black shadow-lg shadow-orange-500/10">
                <FaTools className="text-lg" />
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Work<span className="text-orange-500">Near</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Connecting people with skilled local professionals. Making
              everyday services simpler, closer, and more convenient.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
              >
                <FaFacebookF className="text-sm" />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
              >
                <FaInstagram className="text-sm" />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                to="/"
                className="w-fit text-sm text-gray-400 transition hover:translate-x-1 hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                to="/workers"
                className="w-fit text-sm text-gray-400 transition hover:translate-x-1 hover:text-orange-400"
              >
                Find Workers
              </Link>

              <Link
                to="/profile"
                className="w-fit text-sm text-gray-400 transition hover:translate-x-1 hover:text-orange-400"
              >
                My Bookings
              </Link>

              <Link
                to="/register"
                className="w-fit text-sm text-gray-400 transition hover:translate-x-1 hover:text-orange-400"
              >
                Join WorkNear
              </Link>
            </div>
          </div>

          {/* Popular services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Popular Services
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {services.map((service) => (
                <Link
                  key={service}
                  to="/workers"
                  className="group flex w-fit items-center gap-2 text-sm text-gray-400 transition hover:text-orange-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500/60 transition group-hover:bg-orange-400" />
                  {service}
                </Link>
              ))}
            </div>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h3>

            <p className="mt-6 text-sm leading-7 text-gray-400">
              Have a question or need assistance? We’re here to help make
              your WorkNear experience smooth and convenient.
            </p>

            <div className="mt-6 space-y-5">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                  <FaEnvelope className="text-sm text-orange-400" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email Us
                  </p>

                  <a
                    href="mailto:support@worknear.com"
                    className="mt-1 block break-all text-sm text-gray-300 transition hover:text-orange-400"
                  >
                    worknear.platform@gmail.com
                  </a>
                </div>
              </div>


              {/* Location / mission */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                  <FaBullseye className="text-sm text-orange-400" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Our Mission
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-300">
                    Bringing local communities and skilled professionals
                    closer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} WorkNear. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 sm:text-sm">
            Made for your neighbourhood,{" "}
            <span className="font-medium text-orange-400">
              built around trust.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;