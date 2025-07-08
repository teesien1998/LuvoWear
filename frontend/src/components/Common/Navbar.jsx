import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import logoicon from "@/assets/images/luvowearicon.png"; // ✅ Correct import
import { FaRegUser } from "react-icons/fa6";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import NavDrawer from "../Layout/NavDrawer";
import { useSelector } from "react-redux";
import { Avatar } from "@heroui/react";
import { HiOutlineUser, HiBars3BottomRight } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi";
import CartDrawerShadCN from "../Layout/CartDrawerShadCN";
import NavDrawerShadCN from "../Layout/NavDrawerShadCN";

function getInitials(name) {
  if (!name) return "";

  const parts = name.trim().split(" "); // Returns an array of words
  if (parts.length === 1) {
    // Single word: use first two letters
    return parts[0][0].toUpperCase() + (parts[0][1]?.toUpperCase() || "");
  } else {
    // Multiple words: use first letter of first & last word
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  }
}

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string?.length; i++) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

const Navbar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between px-6 py-2">
        {/* Left Logo */}
        <div>
          <Link to="/">
            <img src={logoicon} alt="LuvoWear" className="w-36" />
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center text-sm font-medium uppercase ${
                isActive ? "text-black" : "text-gray-600 hover:text-black"
              }`
            }
          >
            Home
            <hr
              className={`w-2/3 border-none bg-custom h-[1.6px] ${
                location.pathname === "/" ? "block" : "hidden"
              }`}
            />
          </NavLink>

          {/* Men */}
          <NavLink
            to="/collections?gender=Men"
            className={`flex flex-col items-center text-sm font-medium uppercase ${
              searchParams.get("gender") === "Men"
                ? "text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Men
            <hr
              className={`w-2/3 border-none bg-custom h-[1.6px] ${
                searchParams.get("gender") === "Men" ? "block" : "hidden"
              }`}
            />
          </NavLink>

          {/* Women */}
          <NavLink
            to="/collections?gender=Women"
            className={`flex flex-col items-center text-sm font-medium uppercase ${
              searchParams.get("gender") === "Women"
                ? "text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Women
            <hr
              className={`w-2/3 border-none bg-custom h-[1.6px] ${
                searchParams.get("gender") === "Women" ? "block" : "hidden"
              }`}
            ></hr>
          </NavLink>

          {/* Kids */}
          <NavLink
            to="/collections?gender=Kids"
            className={`flex flex-col items-center text-sm font-medium uppercase ${
              searchParams.get("gender") === "Kids"
                ? "text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Kids
            <hr
              className={`w-2/3 border-none bg-custom h-[1.6px] ${
                searchParams.get("gender") === "Kids" ? "block" : "hidden"
              }`}
            ></hr>
          </NavLink>

          {/* Collections */}
          <NavLink
            to="/collections"
            end
            className={`flex flex-col items-center text-sm font-medium uppercase ${
              location.pathname === "/collections" &&
              !searchParams.get("gender")
                ? "text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Collections
            <hr
              className={`w-2/3 border-none bg-custom h-[1.6px] ${
                location.pathname === "/collections" &&
                !searchParams.get("gender")
                  ? "block"
                  : "hidden"
              }`}
            />
          </NavLink>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="px-2 py-1 bg-custom text-white rounded-lg text-sm font-medium"
            >
              Admin
            </Link>
          )}

          <SearchBar />
          {user ? (
            <Link to="/profile">
              <Avatar
                className="mx-auto text-white w-8 h-8"
                name={getInitials(user?.name)}
                style={{
                  backgroundColor: stringToColor(user?.name),
                }}
                classNames={{
                  name: "text-sm", // Bold and larger text
                }}
                showFallback
                src="https://images.unsplash.com/broken"
              />
              {/* <FaRegUser className="h-5 w-5 text-gray-600 hover:text-black" /> */}
            </Link>
          ) : (
            <Link to="/login">
              <FaRegUser className="h-5 w-5 text-gray-600 hover:text-black" />
            </Link>
          )}
          <CartDrawer />
          <div className="block md:hidden">
            <NavDrawer />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
