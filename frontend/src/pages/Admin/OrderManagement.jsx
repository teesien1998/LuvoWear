import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Spinner,
} from "@heroui/react";
import { GrDeliver } from "react-icons/gr";
import {
  useFetchAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/adminOrderApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OrderManagement = () => {
  const { data, isLoading } = useFetchAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const navigate = useNavigate();

  const orders = data?.orders || [];

  console.log(orders);

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex space-x-2 items-center mb-6">
        <h2 className="text-3xl font-bold text-nowrap">Order Management</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>

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
              aria-label="Order Items Table"
              classNames={{
                th: "bg-custom/10 text-sm text-black", // header (th) styling
                td: "font-medium text-sm text-gray-600 py-2.5", // body (td) styling
                tr: "hover:bg-gray-100",
                wrapper: "border border-custom/50 max-h-[680px]",
              }}
            >
              <TableHeader>
                <TableColumn>Order ID</TableColumn>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Total Price</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell  
                      className="text-blue-600 font-semibold hover:underline cursor-pointer"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      #{order._id}
                    </TableCell>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>
                      ${order.totalPrice.toFixed(2).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <select
                        className="bg-gray-50 border-2 border-gray-300 font-medium rounded-lg outline-none focus:border-custom p-2 cursor-pointer"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Delivered")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg active:scale-97 transition flex items-center gap-2"
                      >
                        <GrDeliver size={20} />
                        Mark as Delivered
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert
              color="primary"
              variant="flat"
              title="No recent orders found"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
