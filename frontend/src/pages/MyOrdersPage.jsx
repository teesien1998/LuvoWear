import { useEffect, useState } from "react";
import { Alert } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useFetchUserOrdersQuery } from "@/redux/api/orderApiSlice";

const MyOrdersPage = () => {
  const { data: orders = [], isLoading } = useFetchUserOrdersQuery();

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      {isLoading ? (
        <Spinner
          color="primary"
          className="flex justify-center items-center h-40"
          classNames={{ wrapper: "w-20 h-20" }}
        />
      ) : (
        <div className="relative shadow-md border rounded-lg max-h-[820px] overflow-y-auto">
          {orders.length > 0 ? (
            <table className="min-w-full text-left text-gray-600">
              <thead className="bg-slate-100 text-sm text-gray-700 sticky top-0 z-10">
                <tr>
                  {/* <th className="px-4 py-2 font-semibold">Image</th> */}
                  <th className="px-4 py-2 font-semibold">Order ID</th>
                  <th className="px-4 py-2 font-semibold">Created</th>
                  <th className="px-4 py-2 font-semibold">Shipping Address</th>
                  <th className="px-4 py-2 font-semibold">Items</th>
                  <th className="px-4 py-2 font-semibold">Price</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-slate-50 cursor-pointer text-sm font-medium group"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    <td className="px-4 py-4 font-medium text-blue-600 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="w-10 h-10 sm:w-12 sm:h-1/5 object-cover rounded-lg mr-4"
                        />
                        <p className="group-hover:underline">#{order._id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4 ">
                      {order.shippingAddress
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4">{order.orderItems.length}</td>
                    <td className="px-4 py-4">${order.totalPrice}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium text-green-600 ${
                          order.isPaid ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Alert color="primary" title="You have no orders" />
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
