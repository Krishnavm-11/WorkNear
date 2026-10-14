import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Categories from "../components/Categories";
import FeaturedWorkers from "../components/FeaturedWorkers";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#171717]">
      {/* Existing Hero component */}
      <Hero />

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Stats />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                EXPLORE OUR SERVICES
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                What can we help you with?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                From quick fixes to important home projects, discover
                professionals with the skills you need.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/workers")}
              className="flex w-fit items-center gap-2 text-sm font-semibold transition hover:text-orange-600"
            >
              All professionals
              <FaArrowRight className="text-orange-500" />
            </button>
          </div>

          <Categories />
        </div>
      </section>

      {/* Featured Workers */}
      <section className="border-y border-gray-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              MEET THE PROFESSIONALS
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Skilled people. Real services.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Explore available workers and find someone suitable for
              your requirements.
            </p>
          </div>

          <FeaturedWorkers />
        </div>
      </section>

      {/* Why Choose WorkNear */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              THE WORKNEAR DIFFERENCE
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Less searching.
              <span className="block text-orange-500">
                More getting done.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              A simpler way to discover local services and connect with
              professionals.
            </p>
          </div>

          <WhyChoose />
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-gray-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              COMMUNITY STORIES
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Made for everyday life.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Discover how WorkNear helps people find services for their
              everyday needs.
            </p>
          </div>

          <Testimonials />
        </div>
      </section>
    </main>
  );
}

export default Home;
