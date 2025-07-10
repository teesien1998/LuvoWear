import { Chip } from "@heroui/chip";
import { FaCircleCheck } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useParams } from "react-router-dom";
import { Alert, Spinner } from "@heroui/react";
import { useFetchOrderDetailsQuery } from "@/redux/api/orderApiSlice";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useFetchOrderDetailsQuery(id);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // add 10 days to the order date
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center h-40 mt-32">
          <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
        </div>
      ) : !order ? (
        <div className="mt-5">
          <Alert color="warning" title="No Order Confirmation Found">
            The requested order could not be found.
          </Alert>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <IoMdCheckmarkCircleOutline className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">
                Order Confirmed!
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {order && (
            <div className="shadow-md rounded-lg">
              <div className="bg-gray-100 px-8 py-6 border-t border-x rounded-t-lg">
                <div className="flex flex-col gap-4 md:flex-row justify-between">
                  {/* Order Id and Date */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">
                      Order ID: #{order._id}
                    </h2>
                    <p className="text-gray-500">
                      Order Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <Chip
                      color="success"
                      startContent={
                        <FaCircleCheck size={18} className="ml-0.5" />
                      }
                      variant="flat"
                      className="text-green-600 border border-green-300"
                      classNames={{ content: "font-medium" }}
                    >
                      {order.paymentStatus}
                    </Chip>
                    {/* Estimated Delivery */}
                    <Chip
                      color="primary"
                      variant="flat"
                      className="text-blue-600 border border-blue-300"
                      classNames={{ content: "font-medium" }}
                    >
                      Estimated Delivery:{" "}
                      {calculateEstimatedDelivery(order.createdAt)}
                    </Chip>
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 border rounded-b-lg">
                {/* Ordered Items */}
                <div className="mb-16">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center py-3 border-b"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-auto object-cover rounded-md mr-4"
                      />
                      <div className="">
                        <h4 className="text-md font-semibold">{item.name}</h4>
                        <div className="flex gap-1 items-center">
                          <p className="text-sm text-gray-500">
                            Size: {item.size} | Color: {item.color.name}
                          </p>
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300 ring-1"
                            style={{ backgroundColor: item.color.hex }}
                          />
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-md font-semibold">${item.price}</p>
                        <p className="text-sm text-gray-500 font-medium">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment and Delivery Info */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Payment Info */}
                  <div>
                    <h1 className="text-lg font-semibold mb-2">Payment</h1>
                    <p className="text-gray-500">PayPal</p>
                  </div>
                  {/* Delivery Info */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                    <p className="text-gray-500 leading-relaxed">
                      {order.shippingAddress.address},
                    </p>
                    <p className="text-gray-500">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state},
                      {order.shippingAddress.postalCode},
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
