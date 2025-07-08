import { useState } from "react";
import { Select, SelectItem, Input } from "@heroui/react";
import { Alert, Chip } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { MdDelete } from "react-icons/md";

const users = [
  {
    _id: 123123,
    name: "John Doe",
    email: "zeunese139@gmail.com",
    role: "admin",
  },
];

const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // Reset the form after Submission
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRoleChange = (userId, newRole) => {
    console.log({ id: userId, role: newRole });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting user with ID", userId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex space-x-2 items-center mb-6">
        <h2 className="text-3xl font-bold text-nowrap">User Management</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>

      {/* Add New User Form */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-10">Add New User</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-10">
            <Input
              key="outside"
              variant="bordered"
              label="Name"
              labelPlacement="outside"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              classNames={{
                label: "font-medium",
              }}
            />
          </div>

          <div className="mb-10">
            <Input
              key="outside"
              variant="bordered"
              label="Email"
              labelPlacement="outside"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              classNames={{
                label: "font-medium",
              }}
            />
          </div>
          <div className="mb-10">
            <Input
              key="outside"
              variant="bordered"
              label="Password"
              labelPlacement="outside"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              classNames={{
                label: "font-medium",
              }}
            />
          </div>
          <div className="mb-6">
            <Select
              name="role"
              label="Select a role"
              variant="bordered"
              selectedKeys={[formData.role]} // Important! Wrap in array
              onChange={handleChange}
              classNames={{
                label: "font-medium",
              }}
              placement="bottom"
            >
              <SelectItem key="customer">Customer</SelectItem>
              <SelectItem key="admin">Admin</SelectItem>
            </Select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg active:scale-97 transition"
          >
            Add User
          </button>
        </form>
      </div>

      <div>
        <Table
          aria-label="User Management Table"
          classNames={{
            th: "bg-custom/10 text-sm text-black ", // header (th) styling
            td: "font-medium text-sm text-gray-600", // body (td) styling
            wrapper: "border border-custom/50 max-h-[480px]",
          }}
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="text-black text-nowrap">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <select
                    className="p-2 border rounded"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </TableCell>
                <TableCell>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded active:scale-97 transition"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
