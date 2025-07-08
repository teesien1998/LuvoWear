import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { useEffect, useState } from "react";

const NotFoundPage = () => {
  const [contentMinHeight, setContentMinHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const navHeight = document.querySelector("header")?.offsetHeight || 0;
      setContentMinHeight(window.innerHeight - navHeight);
    };

    updateHeight(); // ✅ Run on initial load
    window.addEventListener("resize", updateHeight); // ✅ Run on resize

    return () => {
      window.removeEventListener("resize", updateHeight); // cleanup
    };
  }, []);

  console.log("Content min height:", contentMinHeight);
  return (
    <div
      className="px-4 py-10"
      style={{ minHeight: `${contentMinHeight}px` }} // ✅ correct way
    >
      <div className="flex flex-col items-center mt-52">
        <RiErrorWarningLine className="w-24 h-24 text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold mb-2 text-gray-700">
          404 - Not Found
        </h1>
        <p className="mb-6 text-gray-500 text-center">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-custom text-white rounded-lg hover:bg-customHover transition active:scale-97"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
