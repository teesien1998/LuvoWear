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
import { motion, AnimatePresence } from "framer-motion";
import { HiUsers } from "react-icons/hi2";
import { IoMdAddCircleOutline, IoMdEye, IoMdEyeOff } from "react-icons/io";

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
  const [isVisible, setIsVisible] = useState(false);
  const [errorMsgName, setErrorMsgName] = useState("");
  const [errorMsgEmail, setErrorMsgEmail] = useState("");
  const [errorMsgPassword, setErrorMsgPassword] = useState([]);
  const [nameStatus, setNameStatus] = useState("default");
  const [emailStatus, setEmailStatus] = useState("default");
  const [passwordStatus, setPasswordStatus] = useState("default");

  const { data: users, isLoading, error } = useFetchUsersQuery();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    // Name validation (if you want custom error for Name too)
    if (!formData.name.trim()) {
      setNameStatus("danger");
      setErrorMsgName("Please fill out this field.");
      valid = false;
    } else {
      setNameStatus("success");
      setErrorMsgName("");
    }

    // Email validation
    if (!formData.email.trim()) {
      setEmailStatus("danger");
      setErrorMsgEmail("Please fill out this field.");
      valid = false;
    } else if (!validateEmail(formData.email)) {
      setEmailStatus("danger");
      setErrorMsgEmail("Please enter a valid email.");
      valid = false;
    } else {
      setEmailStatus("success");
      setErrorMsgEmail("");
    }

    // Password validation
    if (!editMode) {
      const passwordErrors = validatePassword(formData.password);
      if (!formData.password.trim()) {
        setPasswordStatus("danger");
        setErrorMsgPassword(["Please fill out this field."]);
        valid = false;
      } else if (passwordErrors.length > 0) {
        setPasswordStatus("danger");
        setErrorMsgPassword(passwordErrors);
        valid = false;
      } else {
        setPasswordStatus("success");
        setErrorMsgPassword([]);
      }
    }

    if (!valid) return;

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

      // Reset status and error messages
      setNameStatus("default");
      setEmailStatus("default");
      setPasswordStatus("default");
      setErrorMsgName("");
      setErrorMsgEmail("");
      setErrorMsgPassword([]);
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

  // Email validation regex
  const validateEmail = (value) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
  };

  // Password validation logic
  const validatePassword = (value) => {
    const errors = [];

    if (value.length < 6) {
      errors.push("Password must be 6 characters or more.");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Must include at least 1 uppercase letter.");
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors.push("Must include at least 1 special character.");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "name") {
      if (!value.trim()) {
        setNameStatus("danger");
        setErrorMsgName("Please fill out this field.");
      } else {
        setNameStatus("success");
        setErrorMsgName("");
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        setEmailStatus("danger");
        setErrorMsgEmail("Please fill out this field.");
      } else if (!validateEmail(value)) {
        setEmailStatus("danger");
        setErrorMsgEmail("Please enter a valid email.");
      } else {
        setEmailStatus("success");
        setErrorMsgEmail("");
      }
    }

    if (name === "password") {
      if (!editMode) {
        const passwordErrors = validatePassword(value);
        if (!value.trim()) {
          setPasswordStatus("danger");
          setErrorMsgPassword(["Please fill out this field."]);
        } else if (passwordErrors.length > 0) {
          setPasswordStatus("danger");
          setErrorMsgPassword(passwordErrors);
        } else {
          setPasswordStatus("success");
          setErrorMsgPassword([]);
        }
      }
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    setShowForm(true);
    setEditMode(true);
    setEditingUserId(user._id);

    // Reset status and error messages
    setNameStatus("default");
    setEmailStatus("default");
    setPasswordStatus("default");
    setErrorMsgName("");
    setErrorMsgEmail("");
    setErrorMsgPassword([]);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userIdToDelete).unwrap();
      toast.success("User deleted successfully!");
      onClose();
    } catch (err) {
      console.error(
        `Failed to delete user: ${err?.data?.message || "Unknown error"}`
      );
      toast.error(
        `Failed to delete user: ${err?.data?.message || "Unknown error"}`
      );
    }
  };

  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId);
    onOpen();
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
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
    setShowForm(true);
    setEditMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
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
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm overflow-hidden"
          >
            <h3 className="text-lg font-bold mb-6">
              {editMode ? "Edit User" : "Add New User"}
            </h3>

            <form noValidate onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    color={nameStatus}
                    errorMessage={errorMsgName}
                    isRequired
                    isInvalid={nameStatus === "danger"}
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
                    color={emailStatus}
                    errorMessage={errorMsgEmail}
                    isRequired
                    isInvalid={emailStatus === "danger"}
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
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none mb-1"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    color={passwordStatus}
                    errorMessage={() => (
                      <ul>
                        {errorMsgPassword.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    )}
                    isRequired={!editMode}
                    isInvalid={passwordStatus === "danger"}
                    variant="bordered"
                    label="Password"
                    labelPlacement="inside"
                    type={isVisible ? "text" : "password"}
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
      </AnimatePresence>

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
                            onClick={() => openDeleteModal(user._id)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        classNames={{
          closeButton:
            "hover:bg-gray-200 hover:text-gray-900 rounded-md p-1 transition text-xl right-2 top-2",
        }}
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={handleDeleteUser}
              className="font-medium"
            >
              Delete
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="font-medium"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;
