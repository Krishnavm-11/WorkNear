import { FaBolt,FaHammer,FaPaintRoller,FaBook,FaBroom,FaWrench } from "react-icons/fa";

function Categories() {

    const data = [

        {
            name: "Electrician",
            icon: <FaBolt size={40} />
        },

        {
            name: "Plumber",
            icon: <FaWrench size={40} />
        },

        {
            name: "Carpenter",
            icon: <FaHammer size={40} />
        },

        {
            name: "Cleaner",
            icon: <FaBroom size={40} />
        },

        {
            name: "Tutor",
            icon: <FaBook size={40} />
        },

        {
            name: "Painter",
            icon: <FaPaintRoller size={40} />
        },

    ];

    return (

        <section className="py-20 bg-gray-100">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center mb-14">

                    Categories

                </h2>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">

                    {

                        data.map((item, index) => (

                            <div
                                key={index}
                                className=" bg-white rounded-xl shadow-lg p-6 text-center hover:-translate-y-2 hover:shadow-xl duration-300 cursor-pointer">

                                <div className="text-orange-500 flex justify-center">

                                    {item.icon}

                                </div>

                                <h3 className="mt-4 font-semibold">

                                    {item.name}

                                </h3>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    )

}

export default Categories;