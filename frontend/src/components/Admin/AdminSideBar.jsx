import logoicon from "@/assets/images/luvowearicon.png";
import { Link, NavLink } from "react-router-dom";
import { FaClipboardCheck, FaUsers, FaStore } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { GoSignOut } from "react-icons/go";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice"; // Assuming you have a resetCart action

const AdminSideBar = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart()); // Reset the cart when logging out
    navigate("/login");
  };

  return (
    <div className="py-6 pl-6">
      <div className="mr-6">
        <div className="flex items-center md:hidden mt-6 mb-4 gap-2">
          <Link to="/admin">
            <img src={logoicon} alt="LuvoWear" className="w-36" />
          </Link>
          <h2 className="font-medium bg-custom text-white rounded-xl px-2 py-1 text-center text-sm">
            Admin
          </h2>
        </div>
      </div>

      <nav className="flex flex-col space-y-4 mt-6 font-medium">
        <NavLink
          to="/admin/users"
          onClick={onClose}
          className={({ isActive }) =>
            isActive
              ? "text-gray-700 bg-custom/10 py-3 px-4 border-y border-l border-custom rounded-l flex items-center space-x-2"
              : "text-gray-700 hover:bg-custom/10 py-3 px-4 border-y border-l hover:border-custom rounded-l flex items-center space-x-2"
          }
        >
          <FaUsers className="text-lg" />
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          onClick={onClose}
          className={({ isActive }) =>
            isActive
              ? "text-gray-700 bg-custom/10 py-3 px-4 border-y border-l border-custom rounded-l flex items-center space-x-2"
              : "text-gray-700 hover:bg-custom/10 py-3 px-4 border-y border-l hover:border-custom rounded-l flex items-center space-x-2"
          }
        >
          <FaClipboardList className="text-lg" />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          onClick={onClose}
          className={({ isActive }) =>
            isActive
              ? "text-gray-700 bg-custom/10 py-3 px-4 border-y border-l border-custom rounded-l flex items-center space-x-2"
              : "text-gray-700 hover:bg-custom/10 py-3 px-4 border-y border-l hover:border-custom rounded-l flex items-center space-x-2"
          }
        >
          <FaClipboardCheck className="text-lg" />
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) =>
            isActive
              ? "text-gray-700 bg-custom/10 py-3 px-4 border-y border-l border-custom rounded-l flex items-center space-x-2"
              : "text-gray-700 hover:bg-custom/10 py-3 px-4 border-y border-l hover:border-custom rounded-l flex items-center space-x-2"
          }
        >
          <FaStore className="text-lg" />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-6 mr-6">
        <Button
          variant="flat"
          color="danger"
          onPress={handleLogout}
          className="w-full font-medium text-base"
        >
          <GoSignOut size={19} />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default AdminSideBar;
