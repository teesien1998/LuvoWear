import { FaTrashAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/redux/api/cartApiSlice";
import { setCart } from "@/redux/slices/cartSlice";

const CartContents = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cartProducts = cart?.products;

  const handleUpdateQuantity = async (
    productId,
    delta,
    currentQty,
    size,
    color
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      const updatedCart = await updateCartItem({
        productId,
        quantity: newQty,
        size,
        color,
        guestId,
        userId: user?._id,
      }).unwrap();

      dispatch(setCart(updatedCart)); // 🔁 trigger re-render
    } catch (err) {
      console.error(
        "Error updating cart item:",
        err?.data?.message || "Unknown error"
      );
    }
  };

  const handleRemoveFromCart = async (productId, size, color) => {
    try {
      const updatedCart = await removeFromCart({
        productId,
        size,
        color,
        guestId,
        userId: user?._id,
      }).unwrap();

      dispatch(setCart(updatedCart)); // 🔁 trigger re-render
    } catch (err) {
      console.error(
        "Error removing cart item:",
        err?.data?.message || "Unknown error"
      );
    }
  };

  return (
    <>
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-auto object-cover mr-4 rounded"
            />
            <div className="flex flex-col gap-1">
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex gap-1 items-center">
                <p className="text-sm text-gray-500">
                  Size: {product.size} | Color: {product.color.name}
                </p>
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 ring-1"
                  style={{ backgroundColor: product.color.hex }}
                />
              </div>

              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleUpdateQuantity(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="px-2.5 border border-gray-300 rounded text-xl  hover:bg-gray-200"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQuantity(
                      product.productId,
                      +1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="px-2 border border-gray-300 rounded text-xl hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start font-semibold">
            <span className="whitespace-nowrap">
              ${(product?.price ?? 0).toLocaleString()}
            </span>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <FaTrashAlt className="h-5 w-5 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default CartContents;
