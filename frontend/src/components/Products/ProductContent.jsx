import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/slices/cartSlice";
import { useAddToCartMutation } from "@/redux/api/cartApiSlice";
import { Chip, Tooltip, Spinner } from "@heroui/react";
import { FaCircleCheck, FaFire } from "react-icons/fa6"; // Changed from FaTrophy to FaFire
import { IoIosWarning } from "react-icons/io";
import { Rating } from "@mui/material";

const ProductContent = ({ selectedProduct }) => {
  const [mainImage, setMainImage] = useState(
    selectedProduct?.images?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const stock = useMemo(() => selectedProduct?.countInStock, [selectedProduct]);

  const LOW_STOCK_THRESHOLD = useMemo(() => 10, []);
  const HOT_PRODUCT_THRESHOLD = useMemo(() => 50, []); // Changed from BEST_SELLER_THRESHOLD

  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const [addToCart, { isLoading, error }] = useAddToCartMutation();

  // console.log(selectedProduct);

  useEffect(() => {
    setMainImage(selectedProduct?.images?.[0]);
    setSelectedSize("S");
    setSelectedColor(null);
    setQuantity(1);
  }, [selectedProduct]);

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a product size and color");
      return;
    }

    if (quantity > selectedProduct.countInStock) {
      toast.error("Not enough stock available");
      return;
    }

    try {
      const res = await addToCart({
        productId: selectedProduct._id,
        quantity,
        color: selectedColor,
        size: selectedSize,
        guestId,
        userId: user?._id,
      }).unwrap();

      dispatch(setCart(res));
      // console.log(res);
      toast.success("Product added to cart");
    } catch (err) {
      toast.error(
        `Failed to add to cart: ${err.data?.message || "Unknown error"}`
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row transition-opacity ease-in duration-500 opacity-100">
        {/* Left Thumbnails */}
        <div className="hidden md:flex flex-col overscroll-y-auto space-y-4 mr-6">
          {selectedProduct?.images?.map((image, index) => (
            <img
              key={index}
              src={image?.url}
              alt={image?.altText || `Thumbnail ${index}`}
              className={`w-24 h-auto object-cover rounded-lg cursor-pointer border ${
                mainImage === image ? "border-2 border-custom" : ""
              } `}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="md:w-[50%] mb-4 relative">
          <img
            src={mainImage?.url}
            alt={mainImage?.altText}
            className="w-full aspect-[4/5.5] object-cover rounded-lg border"
          />
          {/* HOT Badge */}
          {selectedProduct.totalSold >= HOT_PRODUCT_THRESHOLD && (
            <div className="absolute top-3 left-3">
              <Chip
                color="danger"
                startContent={<FaFire size={14} className="ml-1" />}
                variant="solid"
                className="bg-gradient-to-r from-red-500 to-orange-600 "
                classNames={{ content: "font-medium " }}
              >
                HOT
              </Chip>
            </div>
          )}
        </div>

        {/* Mobile Thumbnail */}
        <div className="md:hidden flex overscroll-x-auto space-x-4 mb-4">
          {selectedProduct?.images?.map((image, index) => (
            <img
              key={index}
              src={image?.url}
              alt={image?.altText || `Thumbnail ${index}`}
              className={`w-24 h-auto object-cover rounded-lg cursor-pointer border ${
                mainImage === image ? "border-2 border-custom" : ""
              } `}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>

        {/* Right Side */}
        <div className="md:w-[50%] md:ml-10">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="md:text-2xl font-medium">
                {selectedProduct.name}
              </h1>
            </div>
            <p className="text-gray-600">{selectedProduct.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-3 font-medium">Color:</p>
            <div className="flex gap-2">
              {selectedProduct?.colors?.map((color) => (
                <Tooltip content={color.name} showArrow={true} key={color.hex}>
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border border-gray-300 hover:scale-105 ${
                      selectedColor?.name === color.name
                        ? "ring-2 ring-black"
                        : ""
                    }`}
                    style={{
                      backgroundColor: color.hex,
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-3 font-medium">Size:</p>
            <div className="flex gap-2">
              {selectedProduct?.sizes?.map((size) => (
                <button
                  onClick={() => setSelectedSize(size)}
                  key={size}
                  className={`px-4 py-2 rounded ${
                    selectedSize === size
                      ? "bg-custom text-white border border-custom"
                      : "border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {selectedProduct.discountPrice != null ? (
            <>
              <p className="text-base md:text-lg text-gray-500 line-through">
                {`$${selectedProduct?.price?.toLocaleString()}`}
              </p>
              <div className="flex items-center justify-between mb-6">
                <p className="text-2xl font-semibold">
                  {`$${selectedProduct?.discountPrice?.toLocaleString()}`}
                </p>
                <div className="flex items-center gap-2">
                  <Rating
                    name="product-rating"
                    value={selectedProduct.rating || 0}
                    precision={0.5}
                    size="medium"
                    readOnly
                  />
                  <span className="font-medium text-gray-600">
                    (
                    {selectedProduct.rating
                      ? selectedProduct.rating.toFixed(1)
                      : "0.0"}
                    )
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between mb-6">
              <p className="text-2xl font-semibold">
                {`$${selectedProduct?.price
                  .toLocaleString()}`}
              </p>
              <div className="flex items-center gap-2">
                <Rating
                  name="product-rating"
                  value={selectedProduct.rating || 0}
                  precision={0.5}
                  size="medium"
                  readOnly
                />
                <span className="font-medium text-gray-600">
                  (
                  {selectedProduct.rating
                    ? selectedProduct.rating.toFixed(1)
                    : "0.0"}
                  )
                </span>
              </div>
            </div>
          )}

          {/* Display total sold */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              {selectedProduct.totalSold > 0
                ? `${selectedProduct.totalSold} sold`
                : "New product"}
            </span>
          </div>

          <div className="mb-4">
            {stock > 0 ? (
              <Chip
                color={stock <= LOW_STOCK_THRESHOLD ? "warning" : "success"}
                startContent={
                  stock <= LOW_STOCK_THRESHOLD ? (
                    <IoIosWarning size={18} className="ml-1" />
                  ) : (
                    <FaCircleCheck size={16} className="ml-1 " />
                  )
                }
                variant="flat"
                className={`${
                  stock <= LOW_STOCK_THRESHOLD
                    ? "text-yellow-600 border border-yellow-300"
                    : "text-green-600 border border-green-300"
                } `}
                classNames={{ content: "font-medium" }}
              >
                {stock <= LOW_STOCK_THRESHOLD
                  ? `Low Stock (${stock} left)`
                  : `In Stock (${stock} left)`}
              </Chip>
            ) : (
              <Chip
                color="danger"
                startContent={<IoIosWarning size={18} className="ml-1" />}
                variant="flat"
                className="text-red-600 border border-red-300"
                classNames={{ content: "font-medium" }}
              >
                Out of Stock
              </Chip>
            )}
          </div>

          <div className="mb-8">
            <p className="text-gray-700 mb-3 font-medium">Quantity:</p>

            <div className="flex items-center gap-4">
              <button
                onClick={decrement}
                disabled={quantity === 1}
                className={`px-3.5 py-1 border border-gray-300 rounded text-xl font-medium ${
                  quantity === 1
                    ? "bg-gray-200 text-gray-400"
                    : "hover:bg-gray-200"
                }`}
              >
                -
              </button>
              <p className="font-medium w-4 text-center">{quantity}</p>
              <button
                disabled={quantity === selectedProduct.countInStock}
                onClick={increment}
                className={`px-3 py-1 border border-gray-300 rounded text-xl font-medium ${
                  quantity === selectedProduct.countInStock
                    ? "bg-gray-200 text-gray-400"
                    : "hover:bg-gray-200"
                }`}
              >
                +
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            onClick={handleAddToCart}
            className={`bg-custom text-white px-6 py-3 w-full rounded-lg mb-4 font-medium hover:bg-customHover active:scale-97 transition ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {`${isLoading ? "Adding ..." : "ADD TO CART"}`}
          </button>

          <div className="mt-10 py-5 border-y border-gray-300">
            <h3 className="text-gray-700 text-xl font-bold mb-4">
              Product Info
            </h3>
            <table className="w-full text-left text-sm text-gray-600 ">
              <tbody>
                <tr>
                  <td className="py-1">Brand:</td>
                  <td className="py-1">{selectedProduct.brand}</td>
                </tr>
                <tr>
                  <td className="py-1">Material:</td>
                  <td className="py-1">{selectedProduct.material}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>100% Original product.</p>
            <p>1Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductContent;
