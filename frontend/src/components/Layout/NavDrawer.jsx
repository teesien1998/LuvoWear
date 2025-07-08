import { Link, NavLink, useSearchParams } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { HiBars3BottomRight } from "react-icons/hi2";

const NavDrawer = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender");

  return (
    <>
      <button onClick={onOpen} className="relative md:hidden">
        <HiBars3BottomRight className="h-7 w-7 text-gray-600 hover:text-black" />
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        radius="none"
        placement="left"
        className="max-w-full w-3/5 h-full p-0 font-inter" //must set max-w-full then only can set width size responsively
        classNames={{
          closeButton:
            "hover:bg-gray-200 hover:text-gray-900 rounded-md p-1 transition text-xl right-4 top-4",
          backdrop: "md:hidden", // Add this line to hide the backdrop on md screens and above
          wrapper: "md:hidden", // Add this line to hide the wrapper on md screens and above
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
              x: "-100%",
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
              <div className="py-6 pl-6">
                <DrawerHeader className="flex flex-col gap-1 text-xl font-bold mb-4 p-0">
                  Menu
                </DrawerHeader>
                <DrawerBody className="p-0 font-medium">
                  <nav className="mt-3 space-y-5">
                    <NavLink
                      onClick={onClose}
                      to="/collections?gender=Men"
                      className={
                        gender === "Men"
                          ? `block bg-custom/10 border-y border-l border-custom text-custom p-3 rounded-l uppercase`
                          : `block text-gray-700 border-y border-l hover:bg-custom/10 hover:border-custom hover:text-custom p-3 uppercase border-b`
                      }
                    >
                      Men
                    </NavLink>
                    <NavLink
                      onClick={onClose}
                      end
                      to="/collections?gender=Women"
                      className={
                        gender === "Women"
                          ? `block bg-custom/10 border-y border-l border-custom text-custom p-3 rounded-l uppercase`
                          : `block text-gray-700 border-y border-l hover:bg-custom/10 hover:border-custom hover:text-custom p-3 rounded-l uppercase border-b`
                      }
                    >
                      Women
                    </NavLink>
                    <NavLink
                      onClick={onClose}
                      to="/collections?gender=Kids"
                      className={
                        gender === "Kids"
                          ? `block bg-custom/10 border-y border-l border-custom text-custom p-3 rounded-l uppercase`
                          : `block text-gray-700 border-y border-l hover:bg-custom/10 hover:border-custom hover:text-custom p-3 rounded-l uppercase border-b`
                      }
                    >
                      Kids
                    </NavLink>
                    <NavLink
                      onClick={onClose}
                      to="/collections"
                      className={
                        !gender
                          ? `block bg-custom/10 border-y border-l border-custom text-custom p-3 rounded-l uppercase`
                          : `block text-gray-700 border-y border-l hover:bg-custom/10 hover:border-custom hover:text-custom p-3 rounded-l uppercase border-b`
                      }
                    >
                      Collection
                    </NavLink>
                  </nav>
                </DrawerBody>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavDrawer;
