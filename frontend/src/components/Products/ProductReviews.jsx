import { useState } from "react";
import { Rating } from "@mui/material";
import {
  Button,
  Textarea,
  Card,
  CardBody,
  Avatar,
  Alert,
  Spinner,
} from "@heroui/react";
import { FaRegUser, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useCreateProductReviewMutation } from "@/redux/api/productApiSlice";

const ProductReviews = ({ product }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const [createProductReview, { isLoading }] = useCreateProductReviewMutation();

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await createProductReview({
        productId: product._id,
        rating,
        comment,
      }).unwrap();

      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review");
    } finally {
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleReviewSubmit = async (reviewData) => {
    return await createProductReview({
      productId: id,
      ...reviewData,
    }).unwrap();
  };

  return (
    <div className="mt-16">
      {/* Reviews Header */}
      <div className="flex space-x-2 items-center mb-8 justify-center">
        <p className="w-20 bg-custom h-[2px]"></p>
        <h2 className="text-2xl font-bold text-nowrap">Customer Reviews</h2>
        <p className="w-20 bg-custom h-[2px]"></p>
      </div>

      {/* Overall Rating Summary */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Rating
            value={product?.rating || 0}
            precision={0.1}
            readOnly
            size="large"
          />
          <span className="text-2xl font-bold">
            {product?.rating?.toFixed(1) || "0.0"}
          </span>
        </div>
        <p className="text-gray-600">
          Based on {product?.numReviews || 0} review
          {product?.numReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Write a Review */}
      {user ? (
        <Card className="mb-8">
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Comment
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  minRows={4}
                  maxRows={8}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                className="w-full sm:w-auto"
              >
                Submit Review
              </Button>
            </form>
          </CardBody>
        </Card>
      ) : (
        <Alert
          color="primary"
          variant="flat"
          className="mb-8"
          title="Please login to write a review"
        />
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {product?.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <Card key={review._id} className="shadow-sm">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar icon={<FaRegUser />} className="bg-gray-100" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{review.name}</h4>
                      <Rating value={review.rating} readOnly size="small" />
                    </div>
                    <p className="text-gray-600 mb-3">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody className="p-8 text-center">
              <FaStar className="mx-auto mb-4 text-4xl text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-gray-600">
                Be the first to review this product!
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
