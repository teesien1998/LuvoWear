import ProductContent from "./ProductContent";
import { useFetchBestSellerQuery } from "@/redux/api/productApiSlice";
import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";

const ProductHighlight = () => {
  const {
    data: selectedProduct = [],
    isLoading,
    error,
  } = useFetchBestSellerQuery();

  return (
    <motion.section
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      id="best-seller"
      className="container mx-auto px-6 py-10"
    >
      <div className="flex space-x-2 items-center mb-10">
        <h2 className="text-3xl font-bold text-nowrap">Best Sellers</h2>
        <p className="w-20 bg-custom h-[2px]"></p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
        </div>
      ) : (
        <ProductContent selectedProduct={selectedProduct} />
      )}
    </motion.section>
  );
};

export default ProductHighlight;
