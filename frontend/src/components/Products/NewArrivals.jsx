import React, { useEffect, useState, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
// import { newArrivals } from "@/data/homeProductData";
import { useFetchNewArrivalsQuery } from "@/redux/api/productApiSlice";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const navigate = useNavigate();

  const { data: newArrivals, isLoading, error } = useFetchNewArrivalsQuery();

  const handleMouseDown = (e) => {
    setIsDragging(false); // Reset dragging state
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!startX) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 5) setIsDragging(true); // Detect dragging, if move
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUporLeave = (e) => {
    setTimeout(() => {
      setIsDragging(false); // ✅ Ensure isDragging resets properly
      setStartX(null);
    }, 50);
  };

  // useEffect(() => {
  //   console.log("Outside", isDragging);
  // }, [isDragging]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButton = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScrollable = container.scrollLeft > 0;
      const rightScrollable =
        container.scrollWidth > container.scrollLeft + container.clientWidth;
      setCanScrollLeft(leftScrollable);
      setCanScrollRight(rightScrollable);

      console.log({
        scrollLeft: container.scrollLeft,
        clientWidth: container.clientWidth,
        containerScrollWidth: container.scrollWidth,
        offSetLeft: container.offsetLeft, // the gap between the most left edge page and the scrollable container
      });
    }
  };

  const handleRedirect = (id) => {
    if (!isDragging) {
      // console.log("Navigating to:", `/product/${id}`); // ✅ Debug log
      navigate(`/product/${id}`); // ✅ Redirect
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButton); // ✅ Scroll listener added
      updateScrollButton(); // ✅ Initial state check to ensure buttons are correct on mount when the component first mounts
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", updateScrollButton);
      }
    }; // 🔥 Cleanup function - removes listener, runs when component unmounts
  }, []);

  return (
    <section id="new-arrivals">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 py-10 relative"
      >
        <div className="flex space-x-2 items-center mb-10">
          <h2 className="text-3xl font-bold text-nowrap">
            Explore New Arrivals
          </h2>
          <p className="w-20 bg-custom h-[2px]"></p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <Spinner color="primary" size="lg" />
          </div>
        )}
        {/* Scroll Buttons */}
        {/* <div className="absolute right-0 -bottom-6 flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border border-gray-300 ${
                canScrollLeft
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } `}
            >
              <FiChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border border-gray-300 ${
                canScrollRight
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div> */}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="overflow-x-auto flex space-x-6 relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUporLeave}
          onMouseLeave={handleMouseUporLeave}
        >
          {newArrivals?.map((product) => (
            <div
              key={product._id}
              className="min-w-[55%] md:min-w-[35%] lg:min-w-[25%] relative hover:cursor-pointer"
              draggable="false"
              onClick={() => handleRedirect(product._id)}
            >
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-full aspect-[4/4.7] object-cover rounded-lg"
                draggable="false"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 bg-black text-white p-4 rounded-b-lg">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1">{`$${product.price.toLocaleString()}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`p-2 rounded-full border border-gray-300 absolute left-0 top-1/2 ${
            canScrollLeft
              ? "bg-white text-black hover:bg-gray-100 transition duration-150"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          } `}
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`p-2 rounded-full border border-gray-300 absolute right-0 top-1/2 ${
            canScrollRight
              ? "bg-white text-black hover:bg-gray-100 transition duration-150"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </motion.div>
    </section>
  );
};

export default NewArrivals;
