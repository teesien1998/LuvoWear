import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  categories,
  brands,
  colors,
  materials,
  sizes,
  genders,
} from "@/constants/collectionProductData";
import { Slider, Tooltip } from "@heroui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setFiltersRedux, clearFiltersRedux } from "@/redux/slices/filterSlice";

const FilterSideBar = ({ defaultGender }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: "",
    gender: defaultGender || "",
    color: [],
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 400,
  });
  const [priceRange, setPriceRange] = useState([0, 400]); // Need priceRange state to display the value in [0,300] format

  console.log(Object.fromEntries([...searchParams]));
  const navigate = useNavigate();

  // Load Initial URL query params and set Filters state
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]); // [...searchParams] = [ [category, "Top Wear"], [color, "black"], [size, "M,L"] ]

    // console.log(params); // { category: "Top Wear", color: "black", size: "M,L" }

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color ? params.color.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 400,
    });

    setPriceRange([
      Number(params.minPrice) || 0,
      Number(params.maxPrice) || 400,
    ]);
  }, [searchParams]);

  const clearFilters = () => {
    setFilters({
      category: "",
      gender: "",
      color: [],
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 400,
    });

    setPriceRange([0, 400]);
    setSearchParams({});
    navigate("?"); // remove query string
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    // console.log({ name, value, checked, type });
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value]; // size: [S, M, L]
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value); // size: [S, M]
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (newPrice) => {
    setPriceRange(newPrice);
    const [minPrice, maxPrice] = newPrice;

    const newFilters = {
      ...filters,
      minPrice,
      maxPrice,
    };

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleColorChange = (selectedColor) => {
    const updatedColors = filters.color.includes(selectedColor)
      ? filters.color.filter((color) => color !== selectedColor) // Remove color if already selected
      : [...filters.color, selectedColor]; // Add color if not selected

    const newFilters = { ...filters, color: updatedColors };

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    // for (let key in newFilters) {
    //   if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
    //     params.append(key, newFilters[key].join(",")); // size: "S, M, L"
    //   } else {
    //     params.append(key, newFilters[key]);
    //   }
    // }

    // Object.keys(newFilters).forEach((key) => {
    //   const value = newFilters[key];

    //   if (Array.isArray(value) && value.length > 0) {
    //     params.append(key, value.join(",")); // size: "S, M, L"
    //   } else {
    //     params.append(key, value);
    //   }
    // });

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];

      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","));
      } else if (
        typeof value === "string" &&
        value.trim() !== "" && // trim() only work for string but not number
        value !== "all"
      ) {
        params.append(key, value);
      } else if (typeof value === "number" && Number.isFinite(value)) {
        params.append(key, value);
      }
    });

    // console.log(Object.fromEntries(params));

    setSearchParams(params);
    navigate(`?${params.toString()}`); // ?category=Bottom+Wear&size=XS%2CS
  };

  return (
    <div className="px-5 py-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-medium uppercase">Filters</h3>
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs sm:text-sm text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-50"
        >
          <FiRefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4 pb-4 border-b-1 border-slate-300">
        <label className="block text-gray-800 font-medium mb-2 uppercase text-sm sm:text-base">
          Category
        </label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              id={category}
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-green-500 focus:ring-green-400 border-green-800"
            />
            <label htmlFor={category} className="text-gray-600 text-sm sm:text-base">
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="mb-4 pb-4 border-b-1 border-slate-300">
        <label className="block text-gray-800 font-medium mb-2 uppercase text-sm sm:text-base">
          Gender
        </label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              id={gender}
              name="gender"
              value={gender}
              checked={filters.gender.toLowerCase() === gender.toLowerCase()}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor={gender} className="text-gray-600 text-sm sm:text-base">
              {gender}
            </label>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className="mb-4 pb-4 border-b-1 border-slate-300">
        <label className="block text-gray-800 font-medium mb-2 uppercase text-sm sm:text-base">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Tooltip content={color} showArrow={true} key={color.hex}>
              <button
                title={color}
                key={color}
                name="color"
                value={color}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-full border border-slate-300 cursor-pointer transition hover:scale-105 
                ${filters.color.includes(color) ? "ring-2 ring-black" : ""}`}
                style={{
                  backgroundColor: color.toLowerCase().replace(/\s/g, ""),
                }}
              />
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-4 pb-4 border-b-1 border-slate-300">
        <label className="block text-gray-800 font-medium mb-2 uppercase text-sm sm:text-base">
          Size
        </label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={size}
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="mr-2 h-4 w-4 accent-red-500"
            />
            <label htmlFor={size} className="text-gray-600 text-sm sm:text-base">
              {size}
            </label>
          </div>
        ))}
      </div>

      {/* Material Filter */}
      <div className="mb-4 pb-4 border-b-1 border-slate-300">
        <label className="block text-gray-800 font-medium mb-2 uppercase text-sm sm:text-base">
          Material
        </label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={material}
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="mr-2 h-4 w-4 accent-red-500"
            />
            <label htmlFor={material} className="text-gray-600 text-sm sm:text-base">
              {material}
            </label>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-4 pb-4 border-b-1 border-slate-300">
        <label className="block text-gray-800 font-medium mb-2 uppercase text-sm sm:text-base">
          Brand
        </label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={brand}
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="mr-2 h-4 w-4 accent-red-500"
            />
            <label htmlFor={brand} className="text-gray-600 text-sm sm:text-base">
              {brand}
            </label>
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <Slider
        className="max-w-md"
        value={priceRange}
        onChange={handlePriceChange}
        formatOptions={{ style: "currency", currency: "USD" }}
        label="Price Range"
        maxValue={1000}
        minValue={0}
        step={50}
        showTooltip={true}
        classNames={{
          label:
            "text-sm sm:text-base text-gray-800 font-medium mb-2 uppercase text-nowrap",
          value: "text-xs sm:text-sm text-gray-600 mb-2",
          filler: "bg-custom", // filled portion
          thumb: "bg-custom",
        }}
        tooltipProps={{
          placement: "bottom",
          className: "bg-custom",
        }}
      />
    </div>
  );
};

export default FilterSideBar;
