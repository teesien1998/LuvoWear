import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { Chip } from "@heroui/react";
import { FaFire } from "react-icons/fa6";

const ProductListGrid = ({ products }) => {
  const HOT_PRODUCT_THRESHOLD = 50; // Define the threshold for HOT products

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-10">
      {products?.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`}>
          <div className="mb-3 overflow-hidden relative">
            {/* Product Image */}
            <img
              src={product.images[0].url}
              alt={product.images[0].altText || product.name}
              className="w-full aspect-[4/5.5] object-cover hover:scale-110 transition"
            />

            {/* HOT Tag */}
            {product.totalSold >= HOT_PRODUCT_THRESHOLD && (
              <div className="absolute top-3 left-3">
                <Chip
                  color="danger"
                  startContent={<FaFire size={14} className="ml-1" />}
                  variant="solid"
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold"
                  classNames={{ content: "font-bold text-white" }}
                >
                  HOT
                </Chip>
              </div>
            )}
          </div>

          {/* Product Name */}
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
            <span className="text-sm text-gray-600 font-medium">
              ({product.rating ? product.rating.toFixed(1) : "0.0"})
            </span>
          </div>

          {/* Product Price */}
          <p className="font-semibold">
            ${(product?.price ?? 0).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductListGrid;
