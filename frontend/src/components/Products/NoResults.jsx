import React from "react";

const NoResults = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center my-32">
      <p className="text-2xl font-semibold mb-2 text-black text-center">
        No results found
      </p>
      <p className="text-base text-gray-400 mb-6 text-center">
        Try changing or removing some of your filters
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2 border-2 border-custom rounded-lg text-custom hover:bg-custom hover:text-white transition active:scale-97"
      >
        Remove all filters
      </button>
    </div>
  );
};

export default NoResults;
