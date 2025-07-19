import menCollectionImage from "@/assets/images/men_collection.webp";
import womenCollectionImage from "@/assets/images/women_collection.webp";
import kidsCollectionImage from "@/assets/images/kids_collection.webp";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";

const GenderCollection = () => {
  return (
    <section id="gender-collection">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-16"
      >
        <div className="flex space-x-2 items-center mb-10">
          <h2 className="text-3xl font-bold text-nowrap">Collections</h2>
          <p className="w-20 bg-custom h-[2px]"></p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center px-4">
          {/* Men Collection */}
          <Link
            to="/collections?gender=Men"
            className="relative group overflow-hidden w-[80%] md:w-full"
          >
            <img
              src={menCollectionImage}
              alt="Men's Collection"
              className="w-full object-cover group-hover:scale-110 transition"
            />
            <div className="absolute bottom-8 right-8 bg-white group-hover:bg-gray-200 p-4 flex items-center gap-2 z-50 text-lg md:text-base lg:text-lg font-bold">
              <p>Men's Collection</p>
              <IoIosArrowForward className="group-hover:translate-x-1 transition duration-150" />
            </div>
            <div className="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          </Link>
          {/* Women Collection */}
          <Link
            to="/collections?gender=Women"
            className="relative group overflow-hidden w-[80%] md:w-full"
          >
            <img
              src={womenCollectionImage}
              alt="Women's Collection"
              className="w-full object-cover group-hover:scale-110 transition "
            />
            <div className="absolute bottom-8 right-8 bg-white group-hover:bg-gray-200 p-4 flex items-center gap-2 z-50 text-lg md:text-base lg:text-lg font-bold">
              <p>Women's Collection</p>
              <IoIosArrowForward className="group-hover:translate-x-1 transition duration-150 " />
            </div>
            <div className="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          </Link>
          {/* Kids Collection */}
          <Link
            to="/collections?gender=Kids"
            className="relative group overflow-hidden w-[80%] md:w-full"
          >
            <img
              src={kidsCollectionImage}
              alt="Kids' Collection"
              className="w-full object-cover group-hover:scale-110 transition duration-200"
            />
            <div className="absolute bottom-8 right-8 bg-white group-hover:bg-gray-200 p-4 flex items-center gap-2 z-50 text-lg md:text-base lg:text-lg font-bold">
              <p>Kids' Collection</p>
              <IoIosArrowForward className="group-hover:translate-x-1 transition duration-150 " />
            </div>
            <div className="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default GenderCollection;
