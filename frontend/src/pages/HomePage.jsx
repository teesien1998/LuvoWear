import Hero from "@/components/Layout/Hero";
import FeaturesSection from "@/components/Products/FeaturesSection";
import GenderCollection from "@/components/Products/GenderCollection";
import NewArrivals from "@/components/Products/NewArrivals";
import ProductHighlight from "@/components/Products/ProductHighlight";
import ProductTopCollections from "@/components/Products/ProductTopCollections";
import { useFetchTopCollectionQuery } from "@/redux/api/productApiSlice";
import { Spinner } from "@heroui/spinner";

const HomePage = () => {
  const {
    data: topCollectionMen,
    isLoading: isMenCollectionLoading,
  } = useFetchTopCollectionQuery({
    gender: "Men",
  });

  const {
    data: topCollectionWomen,
    isLoading: isWomenCollectionLoading,
  } = useFetchTopCollectionQuery({
    gender: "Women",
  });

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />
      <ProductHighlight />
      {isMenCollectionLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
        </div>
      ) : (
        <ProductTopCollections products={topCollectionMen} gender="Men" />
      )}
      {isWomenCollectionLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
        </div>
      ) : (
        <ProductTopCollections products={topCollectionWomen} gender="Women" />
      )}
      <FeaturesSection />
    </div>
  );
};

export default HomePage;
