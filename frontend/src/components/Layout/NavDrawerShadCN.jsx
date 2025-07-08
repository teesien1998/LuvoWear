import { Link, NavLink } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HiBars3BottomRight } from "react-icons/hi2";

const NavDrawerShadCN = () => {
  return (
    <Sheet>
      <SheetTrigger className="relative md:hidden">
        <HiBars3BottomRight className="h-7 w-7 text-gray-600 hover:text-black" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col sm:max-w-full w-3/4 md:w-1/3 h-full p-0 font-inter"
      >
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold mb-4">Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-3 space-y-2">
            <Link
              to="#"
              className="block text-gray-600 hover:text-custom py-3 uppercase border-b"
            >
              Men
            </Link>
            <Link
              to="#"
              className="block text-gray-600 hover:text-custom py-3 uppercase border-b"
            >
              Women
            </Link>
            <Link
              to="#"
              className="block text-gray-600 hover:text-custom py-3 uppercase border-b"
            >
              Kids
            </Link>
            <Link
              to="#"
              className="block text-gray-600 hover:text-custom py-3 uppercase border-b"
            >
              Collection
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavDrawerShadCN;
