import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Categories from "../components/Categories";
import FeaturedWorkers from "../components/FeaturedWorkers";
import WhyChoose from "../components/WhyChoose";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

function Home() {
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