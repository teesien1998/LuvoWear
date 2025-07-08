import { FaShippingFast } from "react-icons/fa";
import { HiMiniArrowPath } from "react-icons/hi2";
import { MdOutlineCreditScore } from "react-icons/md";

const FeaturesSection = () => {
  return (
    <section className=" bg-gray-50 mt-10">
      <div className="container mx-auto px-6 py-24 flex flex-col md:flex-row gap-16 text-sm md:text-base md:gap-40 justify-center items-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center">
          <FaShippingFast className="text-4xl mb-4" />
          <h3 className="font-semibold mb-2 uppercase">
            Free International Shipping
          </h3>
          <p className="text-gray-400">On all orders over $100</p>
        </div>
        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center">
          <HiMiniArrowPath className="text-4xl mb-4" />
          <h3 className="font-semibold mb-2 uppercase">7 Days Return Policy</h3>
          <p className="text-gray-400">Full refund within 7 days</p>
        </div>
        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center">
          <MdOutlineCreditScore className="text-4xl mb-4" />
          <h3 className="font-semibold mb-2 uppercase">Secure Checkout</h3>
          <p className="text-gray-400">Safe payments with secured protection</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
