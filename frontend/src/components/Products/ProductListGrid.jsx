import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const ProductListGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-10">
      {products?.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`}>
          <div className="mb-3 overflow-hidden">
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="w-full aspect-[4/5.5] object-cover hover:scale-110 transition"
            />
          </div>
          <h3 className="mb-2 font-medium">{product.name}</h3>

          {/* MUI Rating Component */}
          <div className="mb-2 flex items-center gap-1">
            <Rating
              name="product-rating"
              value={product.rating || 0}
              precision={0.5}
              size="small"
              readOnly
            />
            <span className="text-sm text-gray-600">
              ({product.rating ? product.rating.toFixed(1) : "0.0"})
            </span>
          </div>

          <p className="font-semibold">${product.price.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductListGrid;
