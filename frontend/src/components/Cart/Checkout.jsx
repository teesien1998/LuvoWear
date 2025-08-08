import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PayPalButton from "./PayPalButton";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreateCheckoutMutation,
  usePayCheckoutMutation,
  useFinalizeCheckoutMutation,
} from "@/redux/api/checkoutApiSlice";
import { Alert } from "@heroui/react";
import { clearCart } from "@/redux/slices/cartSlice";

const Checkout = () => {
  const [checkoutID, setCheckoutID] = useState();
  const [shippingAddress, setShippingAddress] = useState({
    email: "zeunesse1938@gmail.com",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "", // REMEMBER ADD POSTAL CODE
    country: "",
    phone: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cart, error } = useSelector((state) => state.cart);

  const [createCheckout] = useCreateCheckoutMutation();
  const [payCheckout] = usePayCheckoutMutation();
  const [finalizeCheckout] = useFinalizeCheckoutMutation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [navigate, user]);

  // console.log(cart);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    try {
      if (cart && cart.products && cart.products.length > 0) {
        const res = await createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "PayPal",
          totalPrice: cart.totalPrice,
        }).unwrap();

        console.log("Checkout created:", res);
        setCheckoutID(res._id);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Checkout failed");
      console.error(err?.data?.message || "Checkout failed");
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await payCheckout({
        id: checkoutID,
        paymentData: { paymentStatus: "Paid", paymentDetails: details },
      }).unwrap();

      handleFinalizeCheckout();
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed");
      console.error(err?.data?.message || "Payment failed");
    }
  };

  const handleFinalizeCheckout = async () => {
    try {
      const res = await finalizeCheckout(checkoutID).unwrap();
      toast.success("Checkout finalized successfully");
      console.log("Checkout finalized:", res);

      dispatch(clearCart());
      navigate(`/order-confirmation/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Finalized Checkout failed");
      console.error(err?.data?.message || "Finalized Checkout failed");
    }
  };

  const [{ isPending, options }, paypalDispatch] = usePayPalScriptReducer();

  // // inside Checkout component
  // useEffect(() => {
  //   if (checkoutID) {
  //     paypalDispatch({
  //       type: "resetOptions",
  //       value: {
  //         "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  //         currency: "USD", // ✅ Now it will update
  //       },
  //     });

  //     paypalDispatch({
  //       type: "setLoadingStatus",
  //       value: "pending",
  //     });
  //   }
  // }, [checkoutID, paypalDispatch]); // 🔁 triggered when checkoutID is set

  // console.log(options);

  if (!cart || !cart?.products || cart?.products?.length === 0) {
    return (
      <>
        <Alert color="primary" title="Cart is empty" />
        <button onClick={() => navigate("/")}>Go to Homepage</button>
      </>
    );
  }
  return (
    <div className="max-w-8xl mx-auto py-10 px-6">
      <div className="flex space-x-2 items-center mb-6">
        <h2 className="text-2xl uppercase font-bold">Checkout</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>
      <div className=" flex flex-col lg:flex-row gap-10 justify-between items-center lg:items-start ">
        {/* Left Section */}
        <div className="bg-white rounded-lg w-full lg:w-1/2">
          <form onSubmit={handleCreateCheckout}>
            <h3 className="text-lg mb-4 font-bold">Delivery Information</h3>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={shippingAddress.email}
                className="w-full p-2 border border-gray-300 rounded outline-custom"
                onChange={(e) => {
                  setShippingAddress({
                    ...shippingAddress,
                    email: e.target.value,
                  });
                }}
                required
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={shippingAddress.firstName}
                  className="w-full p-2 border border-gray-300 rounded outline-custom"
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-medium"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={shippingAddress.lastName}
                  className="w-full p-2 border border-gray-300 rounded outline-custom"
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 font-medium"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                value={shippingAddress.address}
                className="w-full p-2 border border-gray-300 rounded outline-custom"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-gray-700 font-medium"
                >
                  Postal Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={shippingAddress.postalCode}
                  className="w-full p-2 border border-gray-300 rounded outline-custom"
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-gray-700 font-medium"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={shippingAddress.city}
                  className="w-full p-2 border border-gray-300 rounded outline-custom"
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="block text-gray-700 font-medium"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={shippingAddress.state}
                  className="w-full p-2 border border-gray-300 rounded outline-custom"
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      state: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-gray-700 font-medium"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={shippingAddress.country}
                  className="w-full p-2 border border-gray-300 rounded outline-custom"
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      country: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={shippingAddress.phone}
                className="w-full p-2 border border-gray-300 rounded outline-custom"
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mt-6">
              {!checkoutID ? (
                <button
                  type="submit"
                  className="bg-black text-white w-full px-2 py-3 rounded"
                >
                  Continue to Payment
                </button>
              ) : (
                <div>
                  {/* Paypal Component */}
                  <PayPalButton
                    amount={cart.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => toast.error(err.message)}
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="bg-slate-50 p-6 rounded-lg border w-full lg:w-1/2">
          <h3 className="text-lg mb-4 font-bold">Order Summary</h3>
          <div className="border-t">
            {cart.products.map((product, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-6 border-b"
              >
                <div className="flex w-[70%]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-auto object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {product.size}
                    </p>
                    <div className="flex gap-1 items-center">
                      <p className="text-sm text-gray-500">
                        Color: {product.color.name}
                      </p>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300 ring-1"
                        style={{ backgroundColor: product.color.hex }}
                      />
                    </div>
                  </div>
                </div>
                <div className="font-medium text-gray-500 text-center w-[15%]">
                  Qty: {product.quantity}
                </div>
                <div className="text-lg font-semibold w-[15%] text-right">
                  ${product.price?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg mt-4">
            <p className="font-semibold">Subtotal</p>
            <p className="font-semibold">
              $
              {cart.products
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                ?.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center text-lg mt-4">
            <p className="font-semibold">Shipping</p>
            <p className="font-semibold">Free</p>
          </div>
          <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">
              $
              {cart.products
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                ?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
