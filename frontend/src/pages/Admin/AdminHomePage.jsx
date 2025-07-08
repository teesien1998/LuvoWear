import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Alert,
} from "@heroui/react";
import { useFetchAllOrdersQuery } from "@/redux/api/adminOrderApiSlice";
import { useFetchAdminProductsQuery } from "@/redux/api/adminProductApiSlice";
import { MdOutlineAttachMoney, MdInventory } from "react-icons/md";
import { LuFileText } from "react-icons/lu";

const AdminHomePage = () => {
  const { data, isLoading: orderIsLoading } = useFetchAllOrdersQuery();
  const { data: productData, isLoading: productIsLoading } =
    useFetchAdminProductsQuery();

  const orders = data?.orders || [];

  return orderIsLoading || productIsLoading ? (
    <Spinner
      color="primary"
      className="flex justify-center items-center h-40 mt-24"
      classNames={{ wrapper: "w-20 h-20" }}
    />
  ) : (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex space-x-2 items-center mb-6">
        <h2 className="text-3xl font-bold text-nowrap">Dashboard</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 border shadow-md rounded-lg flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <MdOutlineAttachMoney className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-500">Total Revenue</h2>
            <p className="text-2xl font-semibold text-gray-800">
              ${data.totalSales}
            </p>
          </div>
        </div>

        <div className="p-4 border shadow-md rounded-lg flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <LuFileText className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-500">Total Orders</h2>
            <p className="text-2xl font-semibold text-gray-800">
              {data.totalOrders}
            </p>
            <Link
              to="/admin/orders"
              className="text-blue-500 hover:underline text-sm"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="p-4 border shadow-md rounded-lg flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <MdInventory className="text-purple-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-500">
              Total Products
            </h2>
            <p className="text-2xl font-semibold text-gray-800">
              {productData.length}
            </p>
            <Link
              to="/admin/products"
              className="text-blue-500 hover:underline text-sm"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div>
          {orders?.length > 0 ? (
            <Table
              aria-label="Order Items Table"
              classNames={{
                th: "bg-custom/10 text-sm text-black", // header (th) styling
                td: "font-medium text-sm text-gray-600 py-2.5", // body (td) styling
                tr: "hover:bg-gray-100",
                wrapper: "border border-custom/50 max-h-[480px]",
              }}
            >
              <TableHeader>
                <TableColumn>Order ID</TableColumn>
                <TableColumn>User</TableColumn>
                <TableColumn>Total Price</TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="text-black font-semibold">
                      #{order._id}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {order.user.name}
                    </TableCell>
                    <TableCell>
                      ${order.totalPrice.toFixed(2).toLocaleString()}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
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
      </div>
    </div>
  );
};

export default AdminHomePage;
