import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Alert,
} from "@heroui/react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { productApiSlice } from "@/redux/api/productApiSlice";

const CartDrawer = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCounts =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const userId = user ? user?._id : null;

  const handleCheckout = () => {
    if (!userId) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
    onClose();
  };

  return (
    <>
      <button onClick={onOpen} className="relative">
        <HiOutlineShoppingBag className="h-6 w-6 text-gray-600 hover:text-black" />
        <span className="absolute -bottom-1.5 -right-1.5 bg-custom text-white rounded-full text-xs px-1">
          {cartItemCounts > 0 && cartItemCounts}
        </span>
      </button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        radius="none"
        className="max-w-full w-full sm:w-3/4 md:w-3/5 lg:w-1/2 xl:w-[36rem] 2xl:w-1/3 h-full p-0 font-inter" //must set max-w-full then only can set width size responsively
        classNames={{
          closeButton:
            "hover:bg-gray-200 hover:text-gray-900 rounded-md p-1 transition text-xl right-4 top-4",
        }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              transition: {
                duration: 0.4, // Change this value to adjust enter animation duration (in seconds)
                ease: "easeOut",
              },
            },
            exit: {
              x: "100%",
              transition: {
                duration: 0.4, // Change this value to adjust exit animation duration (in seconds)
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <div className="p-6">
                <DrawerHeader className="flex flex-col gap-1 text-xl font-bold mb-4 p-0">
                  Your Cart
                </DrawerHeader>
                <DrawerBody className="p-0">
                  {/* Cart Content with scrollable area */}
                  <div className="overflow-y-auto">
                    {cart && cart?.products?.length > 0 ? (
                      <CartContents />
                    ) : (
                      <Alert color="primary" title="You have no orders" />
                    )}
                  </div>
                </DrawerBody>
              </div>
              {cart && cart && cart?.products?.length > 0 && (
                <div className="bg-white p-6 border-t mt-auto">
                  <div className="flex justify-between mb-4 font-semibold">
                    <p>Total</p>
                    <p>${cart.totalPrice.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-custom text-white py-3 rounded-lg font-semibold hover:bg-customHover transition"
                  >
                    Checkout
                  </button>
                  <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
                    Shipping, taxes and discounted codes calculated at checkout.
                  </p>
                </div>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CartDrawer;
