import React, { useEffect, useState, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
// import { newArrivals } from "@/data/homeProductData";
import { useFetchNewArrivalsQuery } from "@/redux/api/productApiSlice";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const startXRef = useRef(null);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const navigate = useNavigate();

  const { data: newArrivals, isLoading, error } = useFetchNewArrivalsQuery();

  const handleMouseDown = (e) => {
    // Don't interfere with scrollbar dragging
    // Check if scrollRef.current exists (safety check - prevents errors if ref not attached)
    if (scrollRef.current) {
      const rect = scrollRef.current.getBoundingClientRect();
      // Calculate scrollbar height (for horizontal scrollbar at bottom)
      // offsetHeight = total height including scrollbar
      // clientHeight = visible height excluding scrollbar
      const scrollbarHeight =
        scrollRef.current.offsetHeight - scrollRef.current.clientHeight;
      // Check if horizontal scrollbar exists AND if click is in the scrollbar area (bottom)
      if (scrollbarHeight > 0 && e.clientY > rect.bottom - scrollbarHeight) {
        // User is clicking on horizontal scrollbar, mark it and let browser handle it
        isScrollbarDragRef.current = true;
        return;
      }
    }

    e.preventDefault(); // Prevent text selection and default drag behavior
    setIsDragging(false); // Reset dragging state
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
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
        rightScrollable: rightScrollable,
        calculation:
          container.scrollWidth -
          (container.scrollLeft + container.clientWidth),
        offSetLeft: container.offsetLeft, // the gap between the most left edge page and the scrollable container
      });
    }
  };

  const handleRedirect = (id) => {
    // Prevent navigation if user was dragging
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

    // 🔥 Cleanup function - removes listener, runs when component unmounts
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", updateScrollButton);
      }
    };
  }, []);

  // Add global mouse move listener for better drag handling
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (scrollRef.current && startXRef.current !== null) {
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startXRef.current;
        // Set dragging immediately on any movement to prevent navigation
        if (Math.abs(walk) > 0) {
          setIsDragging(true);
        }
        // Only start actual scrolling for significant movements (> 5px)
        if (Math.abs(walk) > 5) {
          scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (startXRef.current !== null) {
        // Reset after a delay to allow click handler to check isDragging
        setTimeout(() => {
          setIsDragging(false);
          startXRef.current = null;
        }, 50);
      }
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // Update scroll buttons when data loads
  useEffect(() => {
    if (newArrivals && newArrivals.length > 0) {
      // console.log("Data loaded, updating scroll buttons");
      // Use setTimeout to ensure DOM is updated after data loads
      setTimeout(() => {
        updateScrollButton();
      }, 100);
    }
  }, [newArrivals]);

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

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className={`overflow-x-auto flex space-x-6 relative select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
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
              ? "bg-white text-black hover:bg-gray-100 transition duration-150 block"
              : "bg-gray-200 text-gray-400 hidden"
          } `}
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`p-2 rounded-full border border-gray-300 absolute right-0 top-1/2 ${
            canScrollRight
              ? "bg-white text-black hover:bg-gray-100 transition duration-150 block"
              : "bg-gray-200 text-gray-400 hidden"
          }`}
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </motion.div>
    </section>
  );
};

export default NewArrivals;
