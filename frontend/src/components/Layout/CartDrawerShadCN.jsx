import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HiOutlineShoppingBag } from "react-icons/hi";
import CartContents from "../Cart/CartContents";

const CartDrawerShadCN = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <HiOutlineShoppingBag className="h-6 w-6 text-gray-600 hover:text-black" />
        <span className="absolute -bottom-1.5 -right-1.5 bg-custom text-white rounded-full text-xs px-1">
          4
        </span>
      </SheetTrigger>
      {/* GOT A BUG ON Adjusting the width size of the SheetContent, have to set sm:max-w-full */}
      <SheetContent
        side="right"
        className="flex flex-col sm:max-w-full w-full sm:w-3/4 md:w-3/5 lg:w-1/2 xl:w-[36rem] 2xl:w-1/3 h-full p-0 font-inter"
      >
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold mb-4">
              Your Cart
            </SheetTitle>
          </SheetHeader>
          {/* Cart Content with scrollable area */}
          <div className="flex-1 overflow-y-auto">
            <CartContents />
          </div>
        </div>
        <div className="bg-white p-6 border-t mt-auto">
          <div className="flex justify-between mb-4 font-semibold">
            <p>Total</p>
            <p>$1250</p>
          </div>
          <button className="w-full bg-custom text-white py-3 rounded-lg font-semibold hover:bg-customHover transition">
            Checkout
          </button>
          <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
            Shipping, taxes and discounted codes calculated at checkout.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawerShadCN;
