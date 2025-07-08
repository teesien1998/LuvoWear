import ProductContent from "@/components/Products/ProductContent";
import ProductListGrid from "@/components/Products/ProductListGrid";
import {
  useFetchProductDetailsQuery,
  useFetchSimilarProductsQuery,
} from "@/redux/api/productApiSlice";
import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/spinner";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const { data: selectedProduct = [], isLoading: isProductDetailsLoading } =
    useFetchProductDetailsQuery(id);
  const { data: similarProducts, isLoading: isSimilarProductsLoading } =
    useFetchSimilarProductsQuery(id);

  return (
    <section id="product-details" className="container mx-auto px-6 py-10">
      {/* <div className="flex space-x-2 items-center mb-10">
        <h2 className="text-3xl font-bold text-nowrap">Best Sellers</h2>
        <p className="w-20 bg-custom h-[2px]"></p>
      </div> */}
      {isProductDetailsLoading || isSimilarProductsLoading ? (
        <div className="flex justify-center items-center h-40 mt-20">
          <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
        </div>
      ) : (
        <>
          <div className="my-5">
            <ProductContent selectedProduct={selectedProduct} />
          </div>
          <div className="mt-32 mb-10 container mx-auto max-w-6xl">
            <div className="flex space-x-2 items-center mb-10 justify-center">
              <p className="w-20 bg-custom h-[2px]"></p>
              <h2 className="text-2xl font-bold text-nowrap">
                You May Also Like
              </h2>
              <p className="w-20 bg-custom h-[2px]"></p>
            </div>
            <ProductListGrid products={similarProducts} />
          </div>
        </>
      )}
    </section>
  );
};

export default ProductDetailsPage;
