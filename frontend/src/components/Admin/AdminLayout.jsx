import { useState } from "react";
import { FaBars } from "react-icons/fa";
import logoicon from "@/assets/images/luvowearicon.png"; // ✅ Correct import
import { Link } from "react-router-dom";
import AdminDrawer from "./AdminDrawer";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="border-b">
        <div className="container mx-auto flex items-center px-6 py-2 text-custom z-20 gap-2">
          {/* Mobile Admin Drawer */}
          <div className="md:hidden">
            <AdminDrawer />
          </div>
          <div className="ml-2">
            <Link to="/admin">
              <img src={logoicon} alt="LuvoWear" className="w-36" />
            </Link>
          </div>
          <h2 className="text-sm font-medium bg-custom text-white rounded-xl px-2 py-1">
            Admin Dashboard
          </h2>
        </div>
      </div>

      <div className="min-h-screen w-full flex flex-col md:flex-row relative">
        <div className="hidden md:block w-72 border-r">
          <AdminSideBar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
