import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { GrDeliver } from "react-icons/gr";
import {
  useFetchAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/adminOrderApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { HiShoppingBag } from "react-icons/hi2";

const OrderManagement = () => {
  const { data, isLoading } = useFetchAllOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const navigate = useNavigate();

  const orders = data?.orders || [];

  // console.log(orders);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await updateOrderStatus({ orderId, status: orderStatus }).unwrap();
      toast.success(
        `Order #${orderId} status updated to ${orderStatus} successfully`
      );
      console.log(`${orderId}: ${orderStatus}`);
    } catch (err) {
      console.error(
        `Updating order status failed: ${err?.data?.message || "Unknown error"}`
      );
      toast.error(
        `Updating order status failed: ${err?.data?.message || "Unknown error"}`
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Packing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "Delivered":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <HiShoppingBag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Order Management
            </h2>
            <p className="text-gray-500">Track and manage customer orders</p>
          </div>
        </div>
      </div>

      <div className="relative">
        {isUpdating && (
          <motion.div
            className="absolute inset-0 bg-gray-100 bg-opacity-50 flex flex-col justify-center items-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
            <p className="text-gray-700 font-medium text-lg mt-4">
              Updating order status...
            </p>
          </motion.div>
        )}

        {isLoading ? (
          <Spinner
            color="primary"
            className="flex justify-center items-center h-40 mt-24"
            classNames={{ wrapper: "w-20 h-20" }}
          />
        ) : (
          <div className="py-6">
            {orders.length > 0 ? (
              <Table
                aria-label="Order Management Table"
                classNames={{
                  th: "bg-custom/10 text-sm text-black",
                  td: "font-medium text-sm text-gray-600 py-2.5",
                  tr: "hover:bg-gray-100",
                  wrapper: "border border-custom/50 max-h-[680px]",
                }}
              >
                <TableHeader>
                  <TableColumn className="w-[25%]">Order ID</TableColumn>
                  <TableColumn className="w-[25%]">Customer</TableColumn>
                  <TableColumn className="w-[20%]">Total Price</TableColumn>
                  <TableColumn className="w-[20%]">Status</TableColumn>
                  <TableColumn className="w-[10%]">Update Status</TableColumn>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          #{order._id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-black">
                        {order.user.name}
                      </TableCell>
                      <TableCell>
                        ${order.totalPrice.toFixed(2).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          aria-label="Order Status"
                          isRequired
                          name="status"
                          variant="bordered"
                          selectedKeys={[order.status]}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          classNames={{
                            label: "font-medium",
                            trigger:
                              "data-[open=true]:border-custom data-[focus=true]:border-custom",
                          }}
                          className="w-[160px]"
                          placement="bottom"
                        >
                          <SelectItem key="Processing">Processing</SelectItem>
                          <SelectItem key="Packing">Packing</SelectItem>
                          <SelectItem key="Shipped">Shipped</SelectItem>
                          <SelectItem key="Out for Delivery">
                            Out for Delivery
                          </SelectItem>
                          <SelectItem key="Delivered">Delivered</SelectItem>
                          <SelectItem key="Cancelled">Cancelled</SelectItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert color="primary" variant="flat" title="No Orders Found" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
