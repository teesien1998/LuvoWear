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
import { motion } from "framer-motion";
import { HiUsers } from "react-icons/hi2";
import { IoMdAddCircleOutline } from "react-icons/io";

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
  const [showForm, setShowForm] = useState(false);

  const { data: users, isLoading, error } = useFetchUsersQuery();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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
      setShowForm(false);
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
    setShowForm(true);
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
    setShowForm(false);
  };

  const handleAddNew = () => {
    setShowForm(true);
    setEditMode(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <HiUsers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              User Management
            </h2>
            <p className="text-gray-500">Manage users and their roles</p>
          </div>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-custom hover:bg-customHover text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition hover:shadow-md active:scale-97"
        >
          <IoMdAddCircleOutline size={20} />
          <span>Add User</span>
        </button>
      </div>

      {/* Add/Edit User Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
        >
          <h3 className="text-lg font-bold mb-6">
            {editMode ? "Edit User" : "Add New User"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
                    label: "text-base font-medium",
                    inputWrapper: "group-data-[focus=true]:border-custom",
                  }}
                />
              </div>

              <div>
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
                    label: "text-base font-medium",
                    inputWrapper: "group-data-[focus=true]:border-custom",
                  }}
                />
              </div>

              <div>
                <Input
                  isRequired={!editMode}
                  variant="bordered"
                  label="Password"
                  labelPlacement="inside"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  classNames={{
                    label: "text-base font-medium",
                    inputWrapper: "group-data-[focus=true]:border-custom",
                  }}
                />
              </div>

              <div>
                <Select
                  isRequired
                  name="role"
                  label="Select a role"
                  variant="bordered"
                  selectedKeys={[formData.role]}
                  onChange={handleChange}
                  classNames={{
                    label: "font-medium",
                    trigger:
                      "data-[open=true]:border-custom data-[focus=true]:border-custom",
                  }}
                  placement="bottom"
                >
                  <SelectItem key="customer">Customer</SelectItem>
                  <SelectItem key="admin">Admin</SelectItem>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={isAdding || isUpdating}
                className="bg-custom hover:bg-customHover marker:hover:shadow-md text-white px-5 py-2.5 rounded-xl active:scale-97 transition"
              >
                {isAdding || isUpdating ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" color="white" />
                    <span>{editMode ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : editMode ? (
                  "Update User"
                ) : (
                  "Add User"
                )}
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-500/90 hover:shadow-md text-white px-5 py-2.5 rounded-xl active:scale-97 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="relative">
        {isDeleting && (
          <motion.div
            className="absolute inset-0 bg-gray-100 bg-opacity-50 flex flex-col justify-center items-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
            <p className="text-gray-700 font-medium text-lg mt-4">
              Deleting user...
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
          <div className="my-12">
            {users?.length > 0 ? (
              <Table
                aria-label="User Management Table"
                classNames={{
                  th: "bg-custom/10 text-sm text-black",
                  td: "font-medium text-sm text-gray-600 py-2.5",
                  tr: "hover:bg-gray-100",
                  wrapper: "border border-custom/50 max-h-[680px]",
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
                          aria-label="User Role"
                          isRequired
                          name="role"
                          variant="bordered"
                          selectedKeys={[user.role]}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          classNames={{
                            label: "font-medium",
                            trigger:
                              "data-[open=true]:border-custom data-[focus=true]:border-custom",
                          }}
                          className="w-[160px]"
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
            ) : (
              <Alert color="primary" variant="flat" title="No Users Found" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
