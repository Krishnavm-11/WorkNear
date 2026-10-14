import {
  FaUsers,
  FaHandshake,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function About() {
  const features = [
    {
      number: "01",
      label: "DISCOVER",
      title: "Find local talent",
      description:
        "Explore professionals across different service categories and discover people with the skills you need.",
    },
    {
      number: "02",
      label: "CONNECT",
      title: "Make the connection",
      description:
        "View worker profiles and connect with professionals to arrange the service that suits your requirements.",
    },
    {
      number: "03",
      label: "GET IT DONE",
      title: "Get everyday tasks done",
      description:
        "Make finding help for household repairs, maintenance, and other everyday services simpler and more convenient.",
    },
  ];

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#191919]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-orange-500/20" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="max-w-4xl">

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
                Get to know us
              </p>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-8xl">
              Local work.
              <br />
              Meaningful{" "}
              <span className="text-orange-500">
                connections.
              </span>
            </h1>

            <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                We bring people and local service professionals closer
                together, making it easier to find the right help for
                everyday needs.
              </p>

              <Link
                to="/workers"
                className="group inline-flex w-fit items-center gap-3 border border-white/20 px-6 py-4 text-sm font-medium transition-all duration-300 hover:border-orange-500 hover:bg-orange-500"
              >
                Explore professionals

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-6 border-t border-white/15 pt-7 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Built around
              </p>

              <p className="mt-2 text-lg font-medium">
                Your neighborhood
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Focused on
              </p>

              <p className="mt-2 text-lg font-medium">
                Everyday services
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Connected by
              </p>

              <p className="mt-2 text-lg font-medium">
                Local talent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Image */}
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-24 w-24 border-l-2 border-t-2 border-orange-500 sm:-left-5 sm:-top-5" />

            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&auto=format&fit=crop&q=85"
              alt="Professionals working together"
              loading="lazy"
              className="relative z-10 h-[350px] w-full object-cover sm:h-[480px]"
            />

            <div className="absolute -bottom-5 right-0 z-20 max-w-xs bg-[#191919] p-5 text-white sm:p-7">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-orange-400">
                The idea behind WorkNear
              </p>

              <p className="text-xl font-medium leading-snug sm:text-2xl">
                Bringing local talent closer.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="pt-5 lg:pt-0">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-orange-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                Who we are
              </p>
            </div>

            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Making local services feel{" "}
              <span className="text-orange-600">
                closer.
              </span>
            </h2>

            <p className="mt-7 text-base leading-8 text-[#68635c]">
              WorkNear is a platform designed to connect people who need
              services with local professionals who can help. Whether
              someone needs a household repair, cleaning, carpentry, or
              another everyday service, finding suitable help should feel
              simple.
            </p>

            <p className="mt-5 text-base leading-8 text-[#68635c]">
              Our goal is to make discovering local workers and exploring
              their services more convenient, while helping skilled
              professionals connect with people in their communities.
            </p>

            <div className="mt-9 flex items-start gap-4 border-t border-black/10 pt-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-orange-500 text-white">
                <FaHandshake size={21} />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Connecting people and skills
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#777168]">
                  Creating a simpler way to discover services and connect
                  with local professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT WE DO ================= */}
      <section className="bg-[#ebe8e0] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                What We Do
              </p>

              <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Making everyday work easier to find.
              </h2>
            </div>

            <p className="max-w-lg text-base leading-7 text-[#66615a] md:justify-self-end">
              WorkNear connects people who need reliable local services
              with professionals who have the skills to get the job done.
              From everyday repairs to household tasks, we bring local
              needs and local talent closer together.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group flex min-h-[290px] flex-col bg-[#f5f3ee] p-7 transition-colors duration-300 hover:bg-white sm:p-10"
              >
                <div className="mb-12 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.2em] text-orange-600">
                    {feature.number} / {feature.label}
                  </span>

                  <FaArrowRight className="text-sm text-[#a6a097] transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-600" />
                </div>

                <div className="mt-auto">
                  <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#706b64]">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8 h-0.5 w-10 bg-orange-500 transition-all duration-300 group-hover:w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-orange-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                Our purpose
              </p>
            </div>

            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A closer way to get things done.
            </h2>
          </div>

          <div className="border-l-2 border-orange-500 pl-6 sm:pl-10">
            <p className="text-xl leading-9 text-[#4f4b45] sm:text-2xl sm:leading-10">
              We believe finding help for everyday tasks should not feel
              complicated. WorkNear aims to bring service seekers and
              local professionals together through a more accessible
              and convenient experience.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm font-semibold">
              <FaUsers className="text-orange-600" />

              <span>People, skills, and local connections.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#111111] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              Your neighborhood, connected
            </p>

            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find the right help for your next task.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
              Explore local professionals and discover services that
              match your everyday needs.
            </p>
          </div>

          <Link
            to="/workers"
            className="group inline-flex w-fit shrink-0 items-center gap-4 bg-orange-500 px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-orange-600"
          >
            Find Workers

            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-white/15 pt-6">
          <p className="text-xs tracking-[0.15em] text-white/40">
            WORKNEAR — LOCAL SERVICES, CLOSER TO YOU.
          </p>
        </div>
      </section>

    </main>
  );
}

export default About;