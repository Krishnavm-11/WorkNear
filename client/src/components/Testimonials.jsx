import { useRef } from "react";
import {
  FaStar,
  FaQuoteRight,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Testimonials() {
  const sliderRef = useRef(null);

  const reviews = [
    {
      name: "Rahul Sharma",
      job: "Electrician Service",
      initials: "RS",
      review:
        "Booking an electrician was incredibly easy. The professional arrived on time, worked efficiently, and completed everything perfectly.",
    },
    {
      name: "Priya Singh",
      job: "House Cleaning",
      initials: "PS",
      review:
        "A smooth and professional experience from start to finish. The service was excellent, and my home looked wonderful afterward.",
    },
    {
      name: "Amit Kumar",
      job: "Plumbing Service",
      initials: "AK",
      review:
        "WorkNear made finding a plumber simple. I found the service I needed quickly, and the pricing was reasonable.",
    },
    {
      name: "Sneha Nair",
      job: "Home Cleaning",
      initials: "SN",
      review:
        "The booking process was simple and convenient. I found a suitable professional without wasting time searching everywhere.",
    },
    {
      name: "Arjun Menon",
      job: "Carpentry Service",
      initials: "AM",
      review:
        "Finding a carpenter for a home repair was much easier than expected. The platform made discovering local services convenient.",
    },
  ];

  // Duplicate the reviews to create a looping carousel.
  const carouselReviews = [...reviews, ...reviews];

  const moveSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector("[data-review-card]");
    if (!card) return;

    const gap = parseFloat(
      window.getComputedStyle(slider).columnGap
    ) || 24;

    const cardWidth = card.getBoundingClientRect().width;
    const step = cardWidth + gap;
    const loopWidth = slider.scrollWidth / 2;
    const currentPosition = slider.scrollLeft;

    let nextPosition = currentPosition + direction * step;

    // Continue from the beginning when moving past the end.
    if (direction === 1 && nextPosition >= loopWidth) {
      nextPosition -= loopWidth;
      slider.scrollLeft = currentPosition - loopWidth;
    }

    // Continue from the end when moving backwards past the beginning.
    if (direction === -1 && nextPosition < 0) {
      nextPosition += loopWidth;
      slider.scrollLeft = currentPosition + loopWidth;
    }

    slider.scrollTo({
      left: nextPosition,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f6f3] py-8 sm:py-10">
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-orange-400/[0.08] blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-orange-400/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Previous arrow */}
          <button
            type="button"
            onClick={() => moveSlider(-1)}
            aria-label="Previous testimonials"
            className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-orange-500 hover:bg-orange-500 hover:text-white sm:h-12 sm:w-12"
          >
            <FaChevronLeft />
          </button>

          {/* Testimonials carousel */}
          <div
            ref={sliderRef}
            className="flex min-w-0 flex-1 gap-6 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {carouselReviews.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                data-review-card
                className="group relative flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-colors duration-300 hover:border-orange-200 sm:w-[calc(50%-12px)] sm:p-7 lg:w-[calc(33.333%-16px)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className="text-sm text-orange-500"
                      />
                    ))}
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 transition group-hover:bg-orange-500 sm:h-10 sm:w-10">
                    <FaQuoteRight className="text-orange-500 transition group-hover:text-white" />
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-7 text-gray-600 sm:mt-5 sm:text-[15px]">
                  “{item.review}”
                </p>

                <div className="my-5 h-px bg-gray-100" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-[#f7f3ed] text-sm font-bold text-orange-600 sm:h-11 sm:w-11">
                    {item.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#171717]">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      {item.job}
                    </p>
                  </div>

                  <FaCheckCircle
                    className="shrink-0 text-base text-green-600"
                    title="Sample customer review"
                  />
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </article>
            ))}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            onClick={() => moveSlider(1)}
            aria-label="Next testimonials"
            className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-orange-500 hover:bg-orange-500 hover:text-white sm:h-12 sm:w-12"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;