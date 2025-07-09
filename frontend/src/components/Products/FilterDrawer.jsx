import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import FilterSideBar from "@/components/Products/FilterSideBar";
import { FaFilter } from "react-icons/fa";

const FilterDrawer = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className="lg:hidden border rounded-md p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        radius="none"
        placement="left"
        className="max-w-full w-72 h-full p-0 font-inter" //must set max-w-full then only can set width size responsively
        classNames={{
          closeButton:
            "hover:bg-gray-200 hover:text-gray-900 rounded-md p-1 transition text-xl right-4 top-4",
          backdrop: "lg:hidden", // Add this line to hide the backdrop on md screens and above
          wrapper: "lg:hidden", // Add this line to hide the wrapper on md screens and above
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
            <div>
              <FilterSideBar />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
