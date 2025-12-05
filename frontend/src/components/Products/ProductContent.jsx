import { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/slices/cartSlice";
import { useAddToCartMutation } from "@/redux/api/cartApiSlice";
import { Chip, Tooltip, Spinner } from "@heroui/react";
import { FaCircleCheck, FaFire } from "react-icons/fa6"; // Changed from FaTrophy to FaFire
import { IoIosWarning } from "react-icons/io";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Rating } from "@mui/material";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const ProductContent = ({ selectedProduct }) => {
  // eslint-disable-next-line no-unused-vars
  const [mainImage, setMainImage] = useState(
    selectedProduct?.images?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 }); // px for circle lens
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 }); // % for circle background zoom
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for custom navigation
  const mainSwiperRef = useRef(null);
  const thumbSwiperRef = useRef(null);
  const mobileThumbSwiperRef = useRef(null);

  const stock = useMemo(() => selectedProduct?.countInStock, [selectedProduct]);

  const LOW_STOCK_THRESHOLD = useMemo(() => 10, []);
  const HOT_PRODUCT_THRESHOLD = useMemo(() => 50, []); // Changed from BEST_SELLER_THRESHOLD

  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const [addToCart, { isLoading }] = useAddToCartMutation();

  // console.log(selectedProduct);

  useEffect(() => {
    setMainImage(selectedProduct?.images?.[0]);
    setSelectedSize("S");
    setSelectedColor(null);
    setQuantity(1);
    setActiveIndex(0);
    // Reset swiper to first slide when product changes
    if (mainSwiperRef.current?.swiper) {
      mainSwiperRef.current.swiper.slideTo(0);
    }
    if (thumbSwiperRef.current?.swiper) {
      thumbSwiperRef.current.swiper.slideTo(0);
    }
    if (mobileThumbSwiperRef.current?.swiper) {
      mobileThumbSwiperRef.current.swiper.slideTo(0);
    }
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

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    // cursor position inside image (in px)
    const positionX = e.clientX - left;
    const positionY = e.clientY - top;

    // Lens size and radius
    const lensSize = 200; // Lens width/height in px
    const lensRadius = lensSize / 2; // 100px - half of lens size

    // Clamp lens position to keep it within bounds (accounting for lens radius)
    // This ensures the lens doesn't overflow the edges
    const clampedX = Math.max(
      lensRadius, // Min: 100px from left edge
      Math.min(positionX, width - lensRadius) // Max: width - 100px from left edge
    );
    const clampedY = Math.max(
      lensRadius, // Min: 100px from top edge
      Math.min(positionY, height - lensRadius) // Max: height - 100px from top edge
    );

    // Where to place the lens (px) - this will be centered via transform
    setLensPos({ x: clampedX, y: clampedY });

    // What part of the image to zoom into (%)
    setZoomPos({
      x: (positionX / width) * 100,
      y: (positionY / height) * 100,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-start justify-center transition-opacity ease-in duration-500 opacity-100">
        {/* Left Thumbnails - Desktop (Vertical) */}
        <div className="hidden md:flex flex-col items-center mr-6">
          {/* Up Navigation Button */}
          <button
            onClick={() => thumbSwiperRef.current?.swiper?.slidePrev()}
            className="mb-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors border border-gray-200 hover:border-custom group"
            aria-label="Previous thumbnail"
          >
            <FaChevronUp
              className="text-gray-500 group-hover:text-custom transition-colors"
              size={14}
            />
          </button>

          <div className="h-[400px] w-24">
            <Swiper
              ref={thumbSwiperRef}
              onSwiper={setThumbsSwiper}
              direction="vertical"
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="h-full w-full thumb-swiper"
            >
              {selectedProduct?.images?.map((image, index) => (
                <SwiperSlide key={index} className="!h-auto">
                  <img
                    src={image?.url}
                    alt={image?.altText || `Thumbnail ${index}`}
                    className={`w-24 h-auto aspect-[4/5] object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                      activeIndex === index
                        ? "border-custom shadow-md opacity-100"
                        : "border-transparent hover:border-gray-300 opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => {
                      setMainImage(image);
                      setActiveIndex(index);
                      mainSwiperRef.current?.swiper?.slideTo(index);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Down Navigation Button */}
          <button
            onClick={() => thumbSwiperRef.current?.swiper?.slideNext()}
            className="mt-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors border border-gray-200 hover:border-custom group"
            aria-label="Next thumbnail"
          >
            <FaChevronDown
              className="text-gray-500 group-hover:text-custom transition-colors"
              size={14}
            />
          </button>
        </div>

        {/* Main Image Carousel */}
        <div className="md:w-[50%] mb-4 relative group">
          {/* Left Navigation Button */}
          <button
            onClick={() => mainSwiperRef.current?.swiper?.slidePrev()}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 px-2.5 py-4 rounded-md bg-gray-300/40 hover:bg-gray-300/70 transition-all duration-400 border border-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-white transition-colors" size={25} />
          </button>

          <Swiper
            ref={mainSwiperRef}
            spaceBetween={10}
            speed={600}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
              setMainImage(selectedProduct?.images?.[swiper.activeIndex]);
            }}
            className="select-none rounded-lg"
          >
            {selectedProduct?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative overflow-hidden"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={image?.url}
                    alt={image?.altText || `Product image ${index + 1}`}
                    className="w-full aspect-[4/5.5] object-cover rounded-lg border cursor-grab active:cursor-grabbing"
                    draggable={false}
                  />
                  {isHovering && activeIndex === index && (
                    <div
                      className="absolute pointer-events-none z-10 rounded-full"
                      style={{
                        width: "200px",
                        height: "200px",
                        left: `${lensPos.x}px`,
                        top: `${lensPos.y}px`,
                        backgroundImage: `url(${image?.url})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: "300%",
                        backgroundRepeat: "no-repeat",
                        transform: "translate(-50%, -50%)",
                        boxShadow:
                          "0 0 0 4px rgba(255, 255, 255, 0.85), 0 0 7px 7px rgba(0, 0, 0, 0.25), inset 0 0 40px 2px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Navigation Button */}
          <button
            onClick={() => mainSwiperRef.current?.swiper?.slideNext()}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 px-2.5 py-4 rounded-md bg-gray-300/40 hover:bg-gray-300/70 transition-all duration-400 border border-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Next image"
          >
            <FaChevronRight
              className="text-white transition-colors"
              size={25}
            />
          </button>

          {/* HOT Badge */}
          {selectedProduct.totalSold >= HOT_PRODUCT_THRESHOLD && (
            <div className="absolute top-3 left-3 z-10">
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

        {/* Mobile Thumbnail Carousel (Horizontal) */}
        <div className="md:hidden w-full mb-4 relative">
          {/* Left Navigation Button - Mobile */}
          <button
            onClick={() => mobileThumbSwiperRef.current?.swiper?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/90 shadow-md hover:bg-white transition-all border border-gray-200"
            aria-label="Previous thumbnail"
          >
            <FaChevronLeft className="text-gray-600" size={12} />
          </button>

          <div className="px-8">
            <Swiper
              ref={mobileThumbSwiperRef}
              direction="horizontal"
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mobile-thumb-swiper"
            >
              {selectedProduct?.images?.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image?.url}
                    alt={image?.altText || `Thumbnail ${index}`}
                    className={`w-full h-auto aspect-square object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                      activeIndex === index
                        ? "border-custom shadow-md opacity-100"
                        : "border-transparent hover:border-gray-300 opacity-60 hover:opacity-100"
                    }`}
                    onClick={() => {
                      setMainImage(image);
                      setActiveIndex(index);
                      mainSwiperRef.current?.swiper?.slideTo(index);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Navigation Button - Mobile */}
          <button
            onClick={() => mobileThumbSwiperRef.current?.swiper?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/90 shadow-md hover:bg-white transition-all border border-gray-200"
            aria-label="Next thumbnail"
          >
            <FaChevronRight className="text-gray-600" size={12} />
          </button>
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
                {`$${(selectedProduct?.price ?? 0).toLocaleString()}`}
              </p>
              <div className="flex items-center justify-between mb-6">
                <p className="text-2xl font-semibold">
                  {`$${(selectedProduct?.discountPrice ?? 0).toLocaleString()}`}
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
                {`$${(selectedProduct?.price ?? 0).toLocaleString()}`}
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
