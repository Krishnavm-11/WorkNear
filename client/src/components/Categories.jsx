import { Link } from "react-router-dom";
import {
  FaBolt,
  FaWrench,
  FaHammer,
  FaBroom,
  FaBook,
  FaPaintRoller,
} from "react-icons/fa";

function Categories() {
  const categories = [
    {
      name: "Electrician",
      icon: <FaBolt />,
    },
    {
      name: "Plumber",
      icon: <FaWrench />,
    },
    {
      name: "Carpenter",
      icon: <FaHammer />,
    },
    {
      name: "Cleaner",
      icon: <FaBroom />,
    },
    {
      name: "Tutor",
      icon: <FaBook />,
    },
    {
      name: "Painter",
      icon: <FaPaintRoller />,
    },
  ];

  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-14">
          Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/workers?category=${encodeURIComponent(
                category.name
              )}`}
              className="group bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center gap-4 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-4xl text-orange-500 transition duration-300 group-hover:scale-110">
                {category.icon}
              </div>

              <h3 className="text-lg font-semibold text-black">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;