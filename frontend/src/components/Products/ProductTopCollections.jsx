import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const ProductTopCollections = ({ products, gender }) => {
  return (
    <section id="top-collections">
      <div className="container mx-auto px-6 py-10">
        <div className="flex space-x-2 items-center mb-10 justify-center">
          <p className="w-20 bg-custom h-[2px]"></p>
          <h2 className="text-2xl font-bold text-nowrap">
            {`Top Collections for ${gender}`}
          </h2>
          <p className="w-20 bg-custom h-[2px]"></p>
        </div>

        {/* Updated Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center gap-x-10 gap-y-10 2xl:gap-x-0">
          {products?.map((product, index) => (
            <Link
              key={index}
              to={`/product/${product._id}`}
              className="w-full max-w-[320px]"
            >
              <div className="mb-3 overflow-hidden">
                <img
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  className="w-full aspect-[4/5.5] object-cover hover:scale-110 transition"
                />
              </div>
              <h3 className="mb-2">{product.name}</h3>

              {/* MUI Rating Component */}
              <div className="mb-2 flex items-center gap-1">
                <Rating
                  name="product-rating"
                  value={product.rating || 0}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <span className="text-sm text-gray-600 font-medium">
                  ({product.rating ? product.rating.toFixed(1) : "0.0"})
                </span>
              </div>

              <p className="tracking-tighter font-semibold">
                ${product.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTopCollections;
