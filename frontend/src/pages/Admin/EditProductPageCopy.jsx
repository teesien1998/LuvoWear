import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUpload } from "react-icons/io5";
import { Select, SelectItem, Input, Textarea } from "@heroui/react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchProductDetailsQuery } from "@/redux/api/productApiSlice";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";
import {
  useUploadImagesMutation,
  useDeleteImagesMutation,
  useUpdateProductMutation,
} from "@/redux/api/adminProductApiSlice";
import {
  colorNameOptions,
  genderOptions,
  materialOptions,
  categoryOptions,
  availableSizes,
} from "@/constants/productOptions";

const EditProductPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [], // return cloundinary images URL
  });
  const [selectedHexColor, setSelectedHexColor] = useState("#aabbcc");
  const [selectedNameColor, setSelectedNameColor] = useState("");
  const [otherNameColor, setOtherNameColor] = useState("");
  const [colorError, setColorError] = useState(false);
  const [customColorError, setCustomColorError] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // for actual image FileList for backend upload
  const [removedImages, setRemovedImages] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product } = useFetchProductDetailsQuery(id);
  const [uploadImages, { isLoading: isUploadingImages }] =
    useUploadImagesMutation();
  const [deleteImages, { isLoading: isDeletingImages }] =
    useDeleteImagesMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();

  console.log(product);

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description,
        price: product.price,
        countInStock: product.countInStock,
        sku: product.sku,
        category: product.category,
        brand: product.brand,
        sizes: product.sizes,
        colors: product.colors,
        collections: product.collections,
        material: product.material,
        gender: product.gender,
        images: product.images || [],
      });
      setImages(product.images || []);
    }
  }, [product]);

  // console.log(images);
  console.log(imageFiles);

  // React-dropzone for image uploading
  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      altText: file.name,
    }));

    setImages((prev) => [...prev, ...newImages]);
    setImageFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // append files, not replace
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  // const handleImageUpload = async (e) => {
  //   let files = Array.from(e.target.files); // Convert FileList to array
  //   // console.log(files);

  //   // 1. Create new image previews from uploaded files
  //   const newImages = files.map((file) => ({
  //     url: URL.createObjectURL(file), // ✅ create local URL for preview
  //     altText: file.name,
  //   }));

  //   // 2. Append new previews to existing images in state
  //   setImages((prevImages) => [...prevImages, ...newImages]);

  //   setImageFiles((prevFiles) => [...prevFiles, ...files]); // append files, not replace
  // };

  const handleRemoveImage = (index) => {
    const imagesToRemove = images[index];

    // If the removed image is an existing Cloudinary image, save its public_id
    if (imagesToRemove.public_id) {
      setRemovedImages((prevId) => [...prevId, imagesToRemove.public_id]);
    }
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // append files, not replace
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Delete removed images from Cloudinary
      if (removedImages.length > 0) {
        await deleteImages(removedImages);
      }

      // 2️⃣ Upload new images to Cloudinary
      let newUploadedImages = [];
      if (imageFiles.length > 0) {
        newUploadedImages = await uploadImages().unwrap();
      }

      // 3️⃣ Prepare final images array (what’s left + new uploads)
      const finalImages = images
        .filter(
          (img) => img.public_id || !removedImages.includes(img.public_id)
        )
        .concat(newUploadedImages);

      // 4️⃣ Update product
      const updatedProductData = {
        productId: id,
        productData: {
          ...productData,
          images: finalImages,
        },
      };

      await updateProduct(updatedProductData).unwrap();
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(
        `Failed to update product: ${err?.data?.message || "Unknown error"}`
      );
      toast.error(
        `Failed to update product: ${err?.data?.message || "Unknown error"}`
      );
    }
  };

  // Update Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Automatically convert to number if the field expects it
    const parsedValue = ["price", "countInStock"].includes(name)
      ? Number(value)
      : value;

    setProductData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleAddSizeToggle = (e, size) => {
    e.preventDefault();
    const updatedSizes = productData.sizes.includes(size)
      ? productData.sizes.filter((s) => s !== size) // Remove if selected
      : [...productData.sizes, size]; // Add if not selected

    setProductData({ ...productData, sizes: updatedSizes });
  };

  const handleAddColor = () => {
    setColorError(false);
    setCustomColorError(false);

    // Validation
    if (!selectedNameColor) {
      setColorError(true);
      return;
    }

    if (selectedNameColor === "Others" && !otherNameColor.trim()) {
      setCustomColorError(true);
      return;
    }

    const exists = productData.colors.find(
      (c) =>
        c.hex.toLowerCase() === selectedHexColor.toLowerCase() &&
        c.name.toLowerCase() === selectedNameColor.toLowerCase()
    );

    if (!exists) {
      setProductData;
      setProductData((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          {
            name:
              selectedNameColor === "Others"
                ? otherNameColor || "Custom"
                : selectedNameColor,
            hex: selectedHexColor,
          },
        ],
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-md border">
      <div className="flex space-x-2 items-center justify-center mb-14">
        <p className="w-12 bg-custom h-[2px]"></p>
        <h2 className="text-3xl font-bold text-nowrap">Edit Product</h2>
        <p className="w-12 bg-custom h-[2px]"></p>
      </div>

      <form onSubmit={handleUpdateProduct}>
        {/* Product Name */}
        <div className="mb-4">
          <Input
            isRequired
            variant="bordered"
            key="outside"
            label="Product Name"
            labelPlacement="outside"
            placeholder="Enter product name"
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium", // medium text size for label
              inputWrapper: "group-data-[focus=true]:border-custom text-xl",
              input: "text-base",
            }}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <Textarea
            isRequired
            isClearable
            variant="bordered"
            key="outside"
            label="Product Description"
            labelPlacement="outside"
            placeholder="Write product description here..."
            name="description"
            value={productData.description}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium", // Add margin-bottom to description
              inputWrapper: "group-data-[focus=true]:border-custom",
              input: "text-base",
            }}
            onClear={() => console.log("textarea cleared")}
          />
        </div>

        <div className="mb-12 flex items-center justify-center gap-4">
          <Select
            isRequired
            variant="bordered"
            key="outside"
            label="Product Gender"
            labelPlacement="outside"
            placeholder="Select a Gender"
            name="gender"
            selectedKeys={[productData.gender]} // Important! Wrap in array
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium", // medium text size for label
              trigger:
                "data-[open=true]:border-custom data-[focus=true]:border-custom ",
              value: "text-base",
            }}
            placement="bottom"
          >
            {genderOptions.map((gender) => (
              <SelectItem
                key={gender}
                classNames={{
                  title: "text-base", // ✅ this targets the text
                }}
              >
                {gender}
              </SelectItem>
            ))}
          </Select>

          <Select
            isRequired
            variant="bordered"
            label="Product Category"
            labelPlacement="outside"
            placeholder="Select a category"
            name="category"
            selectedKeys={[productData.category]}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium",
              trigger:
                "data-[open=true]:border-custom data-[focus=true]:border-custom",
              value: "text-base",
              listbox: "text-base",
            }}
          >
            {categoryOptions.map((cat) => (
              <SelectItem key={cat} classNames={{ title: "text-base" }}>
                {cat}
              </SelectItem>
            ))}
          </Select>

          <Select
            isRequired
            variant="bordered"
            label="Material"
            labelPlacement="outside"
            placeholder="Select a material"
            name="material"
            selectedKeys={[productData.material]}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium",
              trigger:
                "data-[open=true]:border-custom data-[focus=true]:border-custom",
              value: "text-base",
              listbox: "text-base",
            }}
          >
            {materialOptions.map((mat) => (
              <SelectItem key={mat} classNames={{ title: "text-base" }}>
                {mat}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Price */}
        <div className="mb-12">
          <Input
            isRequired
            variant="bordered"
            key="outside"
            label="Product Price"
            labelPlacement="outside"
            placeholder="Enter product price"
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium", // medium text size for label
              inputWrapper: "group-data-[focus=true]:border-custom",
              input: "text-base",
            }}
          />
        </div>

        {/* Count in Stock */}
        <div className="mb-12">
          <Input
            isRequired
            variant="bordered"
            key="outside"
            label="Count in Stock"
            labelPlacement="outside"
            placeholder="Enter quantity in stock"
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium", // medium text size for label
              inputWrapper: "group-data-[focus=true]:border-custom",
              input: "text-base",
            }}
          />
        </div>

        {/* SKU */}
        <div className="mb-4">
          <Input
            isRequired
            variant="bordered"
            key="outside"
            label="SKU"
            labelPlacement="outside"
            placeholder="Enter SKU (e.g., UNIQLO12345)"
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            classNames={{
              label: "text-base font-medium", // medium text size for label
              inputWrapper: "group-data-[focus=true]:border-custom",
              input: "text-base",
            }}
          />
        </div>

        {/* Sizes */}
        <div className="mb-12">
          <label className="block font-medium mb-2">Product Sizes</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = productData.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={(e) => handleAddSizeToggle(e, size)}
                  className={`px-4 py-2   transition ${
                    isSelected
                      ? "bg-custom/30 text-black "
                      : "bg-slate-200 text-black  hover:bg-slate-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Product Color</label>
          <div className="flex gap-8">
            <div className="flex flex-col gap-4 items-center">
              <HexColorPicker
                color={selectedHexColor}
                onChange={setSelectedHexColor}
                style={{ width: "200px" }}
              />
              <div className="flex items-center gap-4 ">
                <HexColorInput
                  color={selectedHexColor.toLocaleUpperCase()}
                  onChange={setSelectedHexColor}
                  prefixed
                  className="border rounded p-2 w-28 text-sm outline-custom "
                />
                <div
                  className="w-8 h-8 border rounded p-2"
                  style={{ backgroundColor: selectedHexColor }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-[200px]">
              <Select
                isInvalid={colorError}
                errorMessage="Please select a color name"
                variant="bordered"
                label="Color Name"
                placeholder="Select a color name"
                name="material"
                selectedKeys={[selectedNameColor]}
                onChange={(e) => {
                  setColorError(false);
                  const selectedValue = e.target.value;
                  setSelectedNameColor(selectedValue);

                  // Clear input if not Others
                  if (selectedValue !== "Others") setOtherNameColor("");
                }}
                classNames={{
                  label: "font-medium text-sm !text-black",
                  trigger:
                    "data-[open=true]:border-custom data-[focus=true]:border-custom",
                  value: "",
                }}
              >
                {colorNameOptions.map((colorName) => (
                  <SelectItem key={colorName}>{colorName}</SelectItem>
                ))}
              </Select>
              {selectedNameColor === "Others" && (
                <Input
                  isInvalid={customColorError}
                  errorMessage="Please enter custom color name"
                  label="Custom Color Name"
                  variant="bordered"
                  className="my-3"
                  value={otherNameColor}
                  onChange={(e) => {
                    setCustomColorError(false);
                    const input = e.target.value;
                    const capitalized =
                      input.charAt(0).toUpperCase() +
                      input.slice(1).toLowerCase();

                    setOtherNameColor(capitalized);
                  }}
                  classNames={{
                    inputWrapper: "group-data-[focus=true]:border-custom",
                    label: "font-medium",
                  }}
                />
              )}

              <button
                type="button"
                className="text-sm bg-custom hover:bg-customHover text-white px-2 py-1 rounded"
                onClick={() => handleAddColor()}
              >
                Add Color
              </button>
            </div>
          </div>

          {/* Preview and Add */}
          {/* Show added colors */}
          <div className="flex flex-wrap gap-2 mt-3">
            {productData.colors.map((color, colorIndex) => (
              <div
                key={colorIndex}
                className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 border rounded-full"
              >
                <span
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.hex }}
                ></span>
                {color.name}
                <button
                  onClick={(e) => {
                    // e.preventDefault();
                    setProductData((prev) => ({
                      ...prev,
                      colors: prev.colors.filter(
                        (_, idx) => idx !== colorIndex
                      ),
                    }));
                  }}
                  className="ml-1 text-red-500 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload*/}
        <div>
          <label className="block font-medium mb-2">Upload Images</label>
          <div
            {...getRootProps()}
            className="p-6 border-2 border-dashed border-slate-300 rounded-md text-center cursor-pointer mb-6"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-slate-700">
                  Drop the images here...
                </p>
                <IoCloudUpload size={60} className="text-slate-300 mt-8" />
              </div>
            ) : (
              images.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                  <p className="font-semibold text-slate-700">
                    Drag & drop some images here, or click to select files
                  </p>
                  <IoCloudUpload size={60} className="text-slate-300 mt-8" />
                </div>
              )
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              {images.length > 0 && (
                <>
                  <h3 className="w-full  font-semibold text-center">
                    Uploaded Images
                  </h3>
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="w-24 h-32 object-cover rounded-md shadow border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <RxCross2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white  py-2 rounded-lg active:scale-97 transition mt-2"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
