import { useMemo } from "react";
import FilterSideBar from "@/components/Products/FilterSideBar";
import FilterDrawer from "@/components/Products/FilterDrawer";
import ProductListGrid from "@/components/Products/ProductListGrid";
import SortOptions from "@/components/Products/SortOptions";
import { Spinner } from "@heroui/spinner";
import { useSearchParams, useLocation } from "react-router-dom";
import { useFetchProductsByFiltersQuery } from "@/redux/api/productApiSlice";
import NoResults from "@/components/Products/NoResults";

const parseFiltersFromParams = (params) => ({
  gender: params.get("gender") || "",
  category: params.get("category") || "",
  collection: params.get("collection") || "",
  sortBy: params.get("sortBy") || "",
  search: params.get("search") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  size: params.get("size")?.split(",") || [],
  color: params.get("color")?.split(",") || [],
  brand: params.get("brand")?.split(",") || [],
  material: params.get("material")?.split(",") || [],
});

const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchParams1 = new URLSearchParams(location.search);
  const redirect = searchParams1.get("gender") || "/";

  // Parse filters from URL, useMemo to avoid re-parsing filters on every render
  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams]
  );

  // Fetch data based on filters
  const { data: filteredProducts, isLoading } =
    useFetchProductsByFiltersQuery(filters);

  // Handler to clear all filters
  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block max-w-96 overflow-y-auto border-r min-h-screen">
        <FilterSideBar defaultGender={filters.gender} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-8xl px-6 py-10">
        <div className="flex space-x-2 items-center mb-10 justify-center">
          <p className="w-20 bg-custom h-[2px]"></p>
          <h2 className="text-2xl font-bold text-nowrap">All Collection</h2>
          <p className="w-20 bg-custom h-[2px]"></p>
        </div>

        <div className="flex flex-row">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <FilterDrawer />
          </div>

          {/* Sort Options */}
          <SortOptions />
        </div>

        {isLoading ? (
          <Spinner
            color="primary"
            className="flex justify-center items-center h-40 mt-20"
            classNames={{ wrapper: "w-20 h-20" }}
          />
        ) : filteredProducts?.products?.length === 0 ? (
          <NoResults onClearFilters={handleClearFilters} />
        ) : (
          <ProductListGrid products={filteredProducts?.products} />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
