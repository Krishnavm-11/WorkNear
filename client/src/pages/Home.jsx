import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Categories from "../components/Categories";
import FeaturedWorkers from "../components/FeaturedWorkers";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

function Home() {
  const [search, setSearch] = useState("");
const navigate = useNavigate();

const handleSearch = (e) => {
  e.preventDefault();

  if (search.trim() === "") {
    navigate("/workers");
    return;
  }

  navigate(`/workers?search=${encodeURIComponent(search)}`);
};

  return (
    <div>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedWorkers />
      <WhyChoose />
      <Testimonials />
      <FAQ />
    </div>
  );
}

export default Home;