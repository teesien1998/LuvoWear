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
  useDisclosure,
  Button,
} from "@heroui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  useFetchAdminProductsQuery,
  useDeleteProductMutation,
} from "@/redux/api/adminProductApiSlice";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import { FiBox } from "react-icons/fi";
import { useState } from "react";

const ProductManagement = () => {
  const { data: products = [], isLoading } = useFetchAdminProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteProduct(productIdToDelete).unwrap();
      toast.success("Product deleted successfully!");
      onClose();
    } catch (err) {
      console.error(
        `Failed to delete product ${productIdToDelete}: ${
          err?.data?.message || "Unknown error"
        }`
      );
      toast.error(
        `Failed to delete product: ${err?.data?.message || "Unknown error"}`
      );
    }
  };

  const openDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    onOpen();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FiBox className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Product Management
            </h2>
            <p className="text-gray-500">
              Manage and organize your product inventory
            </p>
          </div>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-custom hover:bg-customHover text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition hover:shadow-md active:scale-97"
        >
          <IoMdAddCircleOutline size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="relative">
        {isDeleting && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex flex-col justify-center items-center z-10">
            <Spinner color="primary" classNames={{ wrapper: "w-20 h-20" }} />
            <p className="text-gray-700 font-medium text-lg mt-4">
              Deleting product...
            </p>
          </div>
        )}

        {isLoading ? (
          <Spinner
            color="primary"
            className="flex justify-center items-center h-40 mt-24"
            classNames={{ wrapper: "w-20 h-20" }}
          />
        ) : (
          <div className="my-12">
            {products.length > 0 ? (
              <Table
                aria-label="User Management Table"
                classNames={{
                  th: "bg-custom/10 text-sm text-black ", // header (th) styling
                  td: "font-medium text-sm text-gray-600 py-2.5", // body (td) styling
                  tr: "hover:bg-gray-100",
                  wrapper: "border border-custom/50 max-h-[680px]",
                }}
              >
                <TableHeader>
                  <TableColumn>Product</TableColumn>
                  <TableColumn>Price</TableColumn>
                  <TableColumn>SKU</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="text-black">
                        <div className="flex items-center">
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-12 aspect-[4/5.5] object-cover rounded-lg mr-4"
                          />
                          <Link
                            to={`/product/${product._id}`}
                            className="text-black hover:underline"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white p-1 rounded active:scale-97 transition"
                          >
                            <MdEdit size={20} />
                          </Link>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded active:scale-97 transition"
                            onClick={() => openDeleteModal(product._id)}
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
              <Alert color="primary" variant="flat" title="No Products Found" />
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
          <ModalBody>Are you sure you want to delete this product?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={handleDelete}
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

export default ProductManagement;
