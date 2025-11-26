import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import heroImg1 from "@/assets/images/hero-carousel-1.jpg";
import heroImg2 from "@/assets/images/hero-carousel-2.jpg";
import heroImg3 from "@/assets/images/hero-carousel-3.jpg";
import heroImg4 from "@/assets/images/hero-carousel-4.jpg";
import heroImg5 from "@/assets/images/hero-carousel-5.jpg";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const heroImages = [
  { heroImg: heroImg1, name: "Hero Image 1", textColor: "white" },
  { heroImg: heroImg2, name: "Hero Image 2", textColor: "black" },
  { heroImg: heroImg3, name: "Hero Image 3", textColor: "black" },
  { heroImg: heroImg4, name: "Hero Image 4", textColor: "white" },
  { heroImg: heroImg5, name: "Hero Image 5", textColor: "black" },
];

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-10 top-1/2 transform -translate-y-1/2 z-10 p-1 bg-gray-300/40 hover:bg-gray-300/70 focus:ring-2 focus:ring-white transition-all rounded-full"
      onClick={onClick}
    >
      <FiChevronLeft className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white" />
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10 p-1 bg-gray-300/40 hover:bg-gray-300/70 focus:ring-2 focus:ring-white transition-all rounded-full"
      onClick={onClick}
    >
      <FiChevronRight className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white" />
    </button>
  );
};

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };
  return (
    <section id="carousel-banner" className="mx-auto">
      <Slider {...settings}>
        {heroImages.map((heroImage, index) => (
          <div key={index} className="relative">
            <img
              src={heroImage.heroImg}
              alt={heroImage.name}
              className="w-full h-[400px] md:h-[600px] lg:h-[800px] object-cover"
            />
            <div className="absolute z-100 left-[10%] bottom-[15%] flex flex-col items-start gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              <p
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-${heroImage.textColor} drop-shadow-2xl`}
              >
                New Arrivals. Buy our New Product
              </p>
              <Link
                to="#"
                className={`bg-${heroImage.textColor} ${
                  heroImage.textColor === "white"
                    ? "text-black hover:bg-gray-200"
                    : "text-white hover:bg-gray-800"
                } px-4 py-2 sm:px-5 sm:py-3 rounded-sm text-xs sm:text-sm md:text-base lg:text-lg shadow-xl flex items-center justify-center gap-3 group transition duration-150`}
              >
                Shop Now
                <IoIosArrowForward className="group-hover:translate-x-1 transition duration-150" />
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
