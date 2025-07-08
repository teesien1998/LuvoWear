import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("");

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    setSortBy(sortBy);

    if (sortBy === "") {
      // Remove sortBy from the URL if user selects "Default"
      searchParams.delete("sortBy");
    } else {
      // Update sortBy param
      searchParams.set("sortBy", sortBy);
    }

    setSearchParams(searchParams);
  };

  return (
    <div className="flex flex-1 items-center justify-end mb-8">
      <select
        value={sortBy}
        onChange={handleSortChange}
        className="border-2 p-2 rounde-md focus:border-2 focus:border-blue-500 focus:outline-none"
      >
        <option value="">Default</option>
        <option value="high-low">Price: High to Low</option>
        <option value="low-high">Price: Low to High</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
