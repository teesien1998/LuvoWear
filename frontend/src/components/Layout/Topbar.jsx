import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";

const TopBar = () => {
  return (
    <div className="bg-[#09b6c8] text-white px-2 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXFill className="w-5 h-5" />
          </a>
        </div>

        <div className="text-sm text-center flex-1">
          We ship worldwide - Fast and reliable shipping!
        </div>

        <div className="hidden md:block text-sm">
          <a href="tel:+61480501832" className="hover:text-gray-300">
            (+61) 0480 501 832
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
