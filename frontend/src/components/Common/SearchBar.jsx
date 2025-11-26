import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FiSearch } from "react-icons/fi";
import { HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/collections?search=${searchTerm}`);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.form
            ref={searchRef}
            onSubmit={handleSearch}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
            className="absolute top-0 right-0 left-0 z-50 flex items-center justify-center bg-gray-50 border-t border-b h-28"
          >
            <div className="relative w-1/2">
              <input
                type="text"
                value={searchTerm}
                className="w-full bg-inherit border border-gray-400 px-4 py-2 rounded-full focus:outline-none"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-600 hover:text-black" />
              </button>
              <button type="button" onClick={() => setIsOpen(!isOpen)}>
                <HiMiniXMark className="absolute -right-20 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-600 hover:text-black" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)}>
        <FiSearch className="h-6 w-6 text-gray-600 hover:text-black" />
      </button>
    </>
  );
};

export default SearchBar;
