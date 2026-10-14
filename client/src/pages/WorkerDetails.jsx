
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaTools,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaRegUserCircle,
  FaQuoteLeft,
  FaShieldAlt,
  FaCalendarCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import api from "../services/api";

function WorkerDetails() {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [workerResult, reviewsResult] = await Promise.allSettled([
          api.get(`/workers/${id}`),
          api.get(`/reviews/${id}`),
        ]);

        if (!isMounted) return;

        if (workerResult.status === "fulfilled") {
          setWorker(workerResult.value.data);
        } else {
          setError(
            workerResult.reason?.response?.data?.message ||
              "We couldn't load this worker's profile."
          );
        }

        if (reviewsResult.status === "fulfilled") {
          const data = reviewsResult.value.data;

          setReviews(Array.isArray(data) ? data : data.reviews || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const workerName =
    worker?.user?.name || worker?.name || "Local Professional";

  const workerImage =
    worker?.profileImage ||
    worker?.user?.profileImage ||
    "https://placehold.co/900x1100?text=Professional";

  const skills = Array.isArray(worker?.skills)
    ? worker.skills
    : typeof worker?.skills === "string"
      ? worker.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];

  const pricing = worker?.pricing ?? worker?.price;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : null;

  // Display two reviews initially, or all reviews when expanded.
  const visibleReviews = showAllReviews
    ? reviews
    : reviews.slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-4 w-32 rounded bg-neutral-200" />

          <div className="grid gap-8 rounded-3xl border border-neutral-200 bg-white p-4 md:grid-cols-2 md:p-6">
            <div className="aspect-[4/5] rounded-2xl bg-neutral-200" />

            <div className="space-y-6 p-4 md:p-8">
              <div className="h-4 w-32 rounded bg-neutral-200" />
              <div className="h-10 w-3/4 rounded bg-neutral-200" />
              <div className="h-4 w-1/2 rounded bg-neutral-100" />
              <div className="h-24 rounded-2xl bg-neutral-100" />
              <div className="h-12 rounded-xl bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#f7f6f3] px-5 py-16">
        <div className="max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <FaRegUserCircle size={25} />
          </div>

          <h2 className="mt-5 text-2xl font-semibold">
            Profile unavailable
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {error || "We couldn't find this worker."}
          </p>

          <Link
            to="/workers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            <FaArrowLeft />
            Back to workers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#191919]">
      {/* MAIN PROFILE */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="grid items-start gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          {/* IMAGE COLUMN */}
          <div>
            <div className="group relative overflow-hidden rounded-3xl bg-neutral-200 shadow-sm">
              <img
                src={workerImage}
                alt={workerName}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/900x1100?text=Professional";
                }}
                className="aspect-[4/4.5] w-full object-cover object-center transition duration-500 group-hover:scale-[1.02] sm:aspect-[4/4.2] lg:aspect-[4/5]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                  <FaCheckCircle className="text-orange-400" />
                  Local professional
                </span>

                <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                  {workerName}
                </h2>

                <p className="mt-1 text-sm text-white/75">
                  {worker.category || "Service professional"}
                </p>
              </div>
            </div>

            {/* TRUST STRIP */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FaShieldAlt />
                </div>

                <div>
                  <p className="text-sm font-semibold">WorkNear</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Professional profile
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FaCalendarCheck />
                </div>

                <div>
                  <p className="text-sm font-semibold">Ready to connect</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Explore booking
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS COLUMN */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                  Get to know your expert
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {workerName}
                </h2>

                <p className="mt-2 text-base font-medium text-orange-600">
                  {worker.category || "Local professional"}
                </p>
              </div>

              {averageRating && (
                <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2">
                  <FaStar className="text-orange-500" />

                  <span className="text-sm font-semibold">
                    {averageRating}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-7 flex items-start gap-3 text-sm text-neutral-600">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-500" />

              <span>{worker.location || "Location not provided"}</span>
            </div>

            <div className="my-7 h-px bg-neutral-100" />

            {/* DETAIL CARDS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-100 bg-[#faf9f7] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <FaMoneyBillWave size={17} />
                </div>

                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Service pricing
                </p>

                <p className="mt-1 break-words text-lg font-semibold">
                  {pricing !== undefined &&
                  pricing !== null &&
                  pricing !== ""
                    ? `₹${pricing}`
                    : "Price on request"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-[#faf9f7] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <FaBriefcase size={17} />
                </div>

                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Experience
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {worker.experience ?? 0} years
                </p>
              </div>
            </div>

            {/* SKILLS */}
            <div className="mt-7">
              <div className="flex items-center gap-2">
                <FaTools className="text-orange-500" />

                <h3 className="text-base font-semibold">
                  Skills & expertise
                </h3>
              </div>

              {skills.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Skills have not been added to this profile yet.
                </p>
              )}
            </div>

            {/* BOOKING CTA */}
            <div className="mt-8 rounded-2xl bg-[#171717] p-5 text-white sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                Ready to get started?
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Let's get your job done.
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Continue to booking to take the next step with this
                professional.
              </p>

              <Link
                to={`/booking/${worker._id}`}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Book this professional
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <section className="mt-14 sm:mt-20">
          <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-orange-500" />

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
                  Customer feedback
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Customer reviews
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                See what customers have shared about their experience.
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 self-start rounded-xl border border-neutral-200 bg-white px-4 py-3 sm:self-auto">
                <FaStar className="text-orange-500" />

                <span className="text-sm font-semibold">
                  {averageRating}/5
                </span>

                <span className="text-xs text-neutral-500">
                  ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <FaQuoteLeft size={21} />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                Customer feedback will appear here when reviews are
                available for this professional.
              </p>
            </div>
          ) : (
            <>
              {/* REVIEW CARDS: TWO INITIALLY */}
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleReviews.map((review, index) => (
                  <article
                    key={review._id || index}
                    className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                          <FaRegUserCircle size={21} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {review.user?.name || "Customer"}
                          </h3>

                          <p className="mt-1 text-xs text-neutral-500">
                            Customer review
                          </p>
                        </div>
                      </div>

                      <FaQuoteLeft className="shrink-0 text-neutral-200" />
                    </div>

                    <div className="mt-5 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={13}
                          className={
                            star <= Number(review.rating || 0)
                              ? "text-orange-400"
                              : "text-neutral-200"
                          }
                        />
                      ))}

                      <span className="ml-2 text-xs font-semibold text-neutral-600">
                        {review.rating ?? 0}/5
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-neutral-600">
                      {review.comment || "No written comment provided."}
                    </p>
                  </article>
                ))}
              </div>

              {/* EXPAND / COLLAPSE REVIEWS */}
              {reviews.length > 2 && (
                <div className="mt-8 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllReviews((previous) => !previous)
                    }
                    aria-expanded={showAllReviews}
                    className="group inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-orange-400 hover:bg-orange-50"
                  >
                    {showAllReviews ? "Show less" : "View all reviews"}

                    {showAllReviews ? (
                      <FaChevronUp className="text-orange-500 transition-transform group-hover:-translate-y-0.5" />
                    ) : (
                      <FaChevronDown className="text-orange-500 transition-transform group-hover:translate-y-0.5" />
                    )}
                  </button>

                  <p className="mt-3 text-xs text-neutral-500">
                    {showAllReviews
                      ? `Showing all ${reviews.length} reviews`
                      : `Showing 2 of ${reviews.length} reviews`}
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* BOTTOM NAVIGATION */}
        <div className="mt-12 flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="font-semibold">
              Still exploring your options?
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Browse other professionals in your area.
            </p>
          </div>

          <Link
            to="/workers"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-600 sm:self-auto"
          >
            Explore workers
            <FaArrowRight />
          </Link>
        </div>
      </main>
    </div>
  );
}

export default WorkerDetails;
