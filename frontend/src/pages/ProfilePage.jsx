import { Avatar } from "@heroui/react";
import MyOrdersPage from "./MyOrdersPage";
import { Button } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";

const ProfilePage = () => {
  function getInitials(name) {
    if (!name) return "";

    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      // Single word: use first two letters
      return parts[0][0].toUpperCase() + (parts[0][1]?.toUpperCase() || "");
    } else {
      // Multiple words: use first letter of first & last word
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
  }

  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string?.length; i++) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).padStart(2, "0");
    }

    return color;
  }

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left Section */}
          <div className="w-full md:w-2/5 lg:w-1/4 shadow-md rounded-lg p-6 text-center border">
            <Avatar
              className="mx-auto text-white mb-4 w-22 h-22"
              name={getInitials(user?.name)}
              style={{
                backgroundColor: stringToColor(user?.name),
              }}
              classNames={{
                name: "text-4xl ", // Bold and larger text
              }}
              showFallback
              src="https://images.unsplash.com/broken"
            />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {user?.name}
            </h2>
            <h2 className="text-lg text-gray-500 mb-4">{user?.email}</h2>
            {/* <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              Logout
            </button> */}
            <Button
              onPress={handleLogout}
              color="danger"
              variant="flat"
              className="w-full text-base font-medium"
            >
              Logout
            </Button>
          </div>

          {/* Right Section: Orders Table */}
          <div className="w-full md:w-3/5 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
