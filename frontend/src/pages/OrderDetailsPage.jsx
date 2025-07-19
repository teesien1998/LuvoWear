import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert, Chip, Spinner } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useFetchOrderDetailsQuery } from "@/redux/api/orderApiSlice";
import { FaCircleCheck } from "react-icons/fa6";

// const getStatusColor = (status) => {
//   switch (status) {
//     case "Processing":
//       return "text-blue-600 bg-blue-100 border border-blue-300";
//     case "Packing":
//       return "text-yellow-600 bg-yellow-100 border border-yellow-300";
//     case "Shipped":
//       return "text-purple-600 bg-purple-100 border border-purple-300";
//     case "Out for Delivery":
//       return "text-orange-600 bg-orange-100 border border-orange-300";
//     case "Delivered":
//       return "text-green-600 bg-green-100 border border-green-300";
//     case "Cancelled":
//       return "text-red-600 bg-red-100 border border-red-300";
//     default:
//       return "text-gray-600 border border-gray-300";
//   }
// };

const statusColor = {
  Processing: "text-blue-600 bg-blue-100 border border-blue-300",
  Packing: "text-yellow-600 bg-yellow-100 border border-yellow-300",
  Shipped: "text-purple-600 bg-purple-100 border border-purple-300",
  "Out for Delivery": "text-orange-600 bg-orange-100 border border-orange-300",
  Delivered: "text-green-600 bg-green-100 border border-green-300",
  Cancelled: "text-red-600 bg-red-100 border border-red-300",
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: orderDetails, isLoading } = useFetchOrderDetailsQuery(id);
  // console.log(orderDetails);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex space-x-2 items-center mb-6">
        <h2 className="text-2xl uppercase font-bold">Order Details</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>

      {isLoading ? (
        <Spinner
          color="primary"
          className="flex justify-center items-center h-40 mt-32"
          classNames={{ wrapper: "w-20 h-20" }}
        />
      ) : !orderDetails ? (
        <Alert color="primary" title="No Order Details Found" />
      ) : (
        <div className="p-6 sm:p-8 rounded-lg border shadow-md">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                Order Date:{" "}
                {new Date(orderDetails.createdAt)
                  .toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  .replace(/,/g, "")}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 space-y-2">
              {orderDetails.isPaid ? (
                <Chip
                  color="success"
                  startContent={<FaCircleCheck size={18} className="ml-0.5" />}
                  variant="flat"
                  className="text-green-600 bg-green-100 border border-green-300"
                  classNames={{ content: "font-medium" }}
                >
                  Paid
                </Chip>
              ) : (
                <Chip
                  color="danger"
                  variant="flat"
                  className="text-red-600 border border-red-300"
                  classNames={{ content: "font-medium" }}
                >
                  Pending
                </Chip>
              )}
              {orderDetails.isDelivered ? (
                <Chip
                  color="success"
                  startContent={<FaCircleCheck size={18} className="ml-0.5" />}
                  variant="flat"
                  className="text-green-600 bg-green-100 border border-green-300"
                  classNames={{ content: "font-medium" }}
                >
                  Delivered
                </Chip>
              ) : (
                <Chip
                  color="default"
                  variant="flat"
                  className={`${statusColor[orderDetails.status]}`}
                  classNames={{ content: "font-medium" }}
                >
                  {orderDetails.status}
                </Chip>
              )}
            </div>
          </div>

          {/*  Customer, Payment & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p className="text-gray-600">
                Payment Method: {orderDetails.paymentMethod}
              </p>
              <p className="text-gray-600">
                Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}
              </p>
            </div>

            {/* Shipping Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p className="text-gray-600">
                Address:{" "}
                {`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state}, ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <Table
              aria-label="Order Items Table"
              removeWrapper
              classNames={{
                th: "bg-slate-100 text-sm text-gray-700", // all TableHeader (th) cells
                td: "font-medium text-sm text-gray-600", // all TableBody (td) cells
                base: "max-h-[480px] overflow-auto w-full", // can try and see min-w-full
              }}
            >
              <TableHeader>
                <TableColumn>Item</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Total</TableColumn>
              </TableHeader>
              <TableBody>
                {orderDetails.orderItems.map((item) => (
                  <TableRow key={item.productId} className="border-b">
                    <TableCell>
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 aspect-[4/5] object-cover rounded-lg mr-4"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toLocaleString()}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      ${(item.price * item.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Back to Orders Link */}
          <Button
            variant="flat"
            className="bg-custom hover:bg-customHover hover:!opacity-100 hover:shadow-md text-white flex items-center"
            onPress={() => {
              navigate("/my-orders");
            }}
          >
            <IoIosArrowBack className="text-medium" />
            Back to Order List
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
