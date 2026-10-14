
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaWrench,
  FaHammer,
  FaBroom,
  FaBook,
  FaPaintRoller,
  FaArrowUp,
} from "react-icons/fa";

function Categories() {
  const categories = [
    {
      name: "Electrician",
      description: "Power and electrical work",
      icon: FaBolt,
    },
    {
      name: "Plumber",
      description: "Pipes and water repairs",
      icon: FaWrench,
    },
    {
      name: "Carpenter",
      description: "Furniture and woodwork",
      icon: FaHammer,
    },
    {
      name: "Cleaner",
      description: "A cleaner, fresher space",
      icon: FaBroom,
    },
    {
      name: "Tutor",
      description: "Learning and education",
      icon: FaBook,
    },
    {
      name: "Painter",
      description: "Refresh your walls",
      icon: FaPaintRoller,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => {
        const Icon = category.icon;

        return (
          <Link
            key={category.name}
            to={`/workers?category=${encodeURIComponent(category.name)}`}
            className="group relative flex min-h-36 items-center gap-5 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/5 sm:p-6"
          >
            <span className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-orange-50 transition duration-300 group-hover:scale-150" />

            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#171717] text-xl text-orange-400 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
              <Icon />
            </span>

            <span className="relative min-w-0 flex-1">
              <span className="block text-base font-bold text-[#171717] transition group-hover:text-orange-600">
                {category.name}
              </span>

              <span className="mt-2 block text-xs leading-5 text-gray-500 sm:text-sm">
                {category.description}
              </span>
            </span>

            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 transition duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
              {index < 6 ? <FaArrowUp className="rotate-45" /> : null}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default Categories;
