import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";
import logoicon from "@/assets/images/luvowearicon.png"; // ✅ Correct import

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-footer gap-10 px-6 py-10">
        <div>
          <Link to="/">
            <img src={logoicon} alt="LuvoWear" className="w-36 mb-4" />
          </Link>
          <p className="font-semibold mb-6 text-lg text-center">
            Subscribe now & get 20% off your first order
          </p>

          {/* Newsletter form */}
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-1/2 text-sm border-t border-l border-b rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
            />
            <button
              type="submit"
              className="bg-black text-white rounded-r-md uppercase text-xs px-6 py-3 "
            >
              Subscibe
            </button>
          </form>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-custom">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-custom">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-custom">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-custom">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Supports */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-custom">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-custom">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-custom">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-custom">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a href="https://www.facebook.com" target="blank">
              <TbBrandMeta className="w-5 h-5 hover:text-gray-500" />
            </a>
            <a href="https://www.instagram.com" target="blank">
              <IoLogoInstagram className="w-5 h-5 hover:text-gray-500" />
            </a>
            <a href="https://www.twitter.com" target="blank">
              <RiTwitterXFill className="w-5 h-5 hover:text-gray-500" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-sm text-center border-t py-4">
        <p className="text-gray-400">
          © {new Date().getFullYear()} LuvoWear. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
