import ProductContent from "./ProductContent";
import { useFetchBestSellerQuery } from "@/redux/api/productApiSlice";
import { Spinner } from "@heroui/spinner";

const ProductHighlight = () => {
  const {
    data: selectedProduct,
    isLoading,
  } = useFetchBestSellerQuery();

  return (
    <section
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
      ) : selectedProduct ? (
        <ProductContent selectedProduct={selectedProduct} />
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No product available</p>
        </div>
      )}
    </section>
  );
};

export default ProductHighlight;
