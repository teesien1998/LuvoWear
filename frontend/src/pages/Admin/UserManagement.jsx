import { useState } from "react";
import { Select, SelectItem, Input, user } from "@heroui/react";
import { Alert, Chip } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  useFetchUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/api/adminApiSlice";
import { toast } from "sonner";

const UserManagement = () => {
  // Add New User Default Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });
  // Edit User
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const { data: users, isLoading, error } = useFetchUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        console.log("Updating user:", editingUserId, formData);
        // Update user
        await updateUser({
          userId: editingUserId,
          userData: formData,
        }).unwrap();
        toast.success("User updated successfully!");
      } else {
        console.log("Adding new user:", formData);
        // Add new user
        await addUser(formData).unwrap();
        toast.success("User added successfully!");
      }

      // Reset the form after submission
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });
      setEditMode(false);
      setEditingUserId(null);
    } catch (error) {
      const action = editMode ? "update" : "add";
      console.error(
        `Failed to ${action} user: ${error?.data?.message || "Unknown error"}`
      );
      toast.error(
        `Failed to ${action} user: ${error?.data?.message || "Unknown error"}`
      );
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log({ id: userId, role: newRole });
      const res = await updateUser({
        userId,
        userData: { role: newRole },
      }).unwrap();
      toast.success(
        `User ${res.name}'s role updated to ${newRole} successfully!`
      );
    } catch (error) {
      console.error(
        `Failed to update user role: ${error?.data?.message || "Unknown error"}`
      );
      toast.error(
        `Failed to update user role: ${error?.data?.message || "Unknown error"}`
      );
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // optional: usually you don't autofill password
      role: user.role,
    });
    setEditMode(true);
    setEditingUserId(user._id);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully!");
      } catch (err) {
        console.error(
          `Failed to delete user: ${err?.data?.message || "Unknown error"}`
        );
        toast.error(
          `Failed to delete user: ${err?.data?.message || "Unknown error"}`
        );
      }
    }
  };

  const handleCancel = () => {
    // Reset the form after cancel updating user
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
    setEditMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex space-x-2 items-center mb-6">
        <h2 className="text-3xl font-bold text-nowrap">User Management</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>

      {/* Add New User Form */}
      <div className="p-6 rounded-lg mb-6 max-w-xl">
        <h3 className="text-lg font-bold mb-10">
          {editMode ? "Edit User" : "Add New User"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              isRequired
              key="outside"
              variant="bordered"
              label="Name"
              labelPlacement="inside"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              classNames={{
                label: "text-base font-medium", // medium text size for label
                inputWrapper: "group-data-[focus=true]:border-custom",
              }}
            />
          </div>

          <div className="mb-6">
            <Input
              isRequired
              variant="bordered"
              label="Email"
              labelPlacement="inside"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              classNames={{
                label: "text-base font-medium", // medium text size for label
                inputWrapper: "group-data-[focus=true]:border-custom",
              }}
            />
          </div>
          <div className="mb-6">
            <Input
              isRequired={!editMode} // Password is required only when adding a new user
              variant="bordered"
              label="Password"
              labelPlacement="inside"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              classNames={{
                label: "text-base font-medium", // medium text size for label
                inputWrapper: "group-data-[focus=true]:border-custom",
              }}
            />
          </div>
          <div className="mb-6">
            <Select
              isRequired
              name="role"
              label="Select a role"
              variant="bordered"
              selectedKeys={[formData.role]} // Important! Wrap in array
              onChange={handleChange}
              classNames={{
                label: "font-medium", // medium text size for label
                trigger:
                  "data-[open=true]:border-custom data-[focus=true]:border-custom ",
              }}
              placement="bottom"
            >
              <SelectItem key="customer">Customer</SelectItem>
              <SelectItem key="admin">Admin</SelectItem>
            </Select>
          </div>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg active:scale-97 transition hover:shadow-md"
          >
            {editMode ? "Update User" : "Add User"}
          </button>
          {editMode && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg active:scale-97 transition ml-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {isLoading ? (
        <Spinner
          color="primary"
          className="flex justify-center items-center h-40 mt-24"
          classNames={{ wrapper: "w-20 h-20" }}
        />
      ) : users?.length === 0 ? (
        <Alert color="primary" title="No users found" />
      ) : (
        <Table
          aria-label="User Management Table"
          classNames={{
            th: "bg-custom/10 text-sm text-black ",
            td: "font-medium text-sm text-gray-600 py-2.5",
            wrapper: "border border-custom/50 max-h-[480px]",
          }}
        >
          <TableHeader>
            <TableColumn className="w-[20%]">Name</TableColumn>
            <TableColumn className="w-[30%]">Email</TableColumn>
            <TableColumn className="w-[30%]">Role</TableColumn>
            <TableColumn className="w-[20%]">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="text-black text-nowrap">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    isRequired
                    name="role"
                    variant="bordered"
                    selectedKeys={[user.role]} // Important! Wrap in array
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    classNames={{
                      label: "font-medium", // medium text size for label
                      trigger:
                        "data-[open=true]:border-custom data-[focus=true]:border-custom ",
                    }}
                    className="w-[160px]" // 👈 fixed width
                    placement="bottom"
                  >
                    <SelectItem key="customer">Customer</SelectItem>
                    <SelectItem key="admin">Admin</SelectItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white p-1 rounded active:scale-97 transition"
                      onClick={() => handleEditUser(user)}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded active:scale-97 transition"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserManagement;
