import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import UserManagement from "./pages/Admin/UserManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import AddProductPage from "./pages/Admin/AddProductPage";
import EditProductPage from "./pages/Admin/EditProductPage";
import OrderManagement from "./pages/Admin/OrderManagement";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/Layout/PrivateRoute";
import AdminRoute from "./components/Admin/AdminRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 👤 User pages */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="collections" element={<CollectionPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />

        {/* 🔒 Authenticated user pages */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="order-confirmation/:id"
            element={<OrderConfirmationPage />}
          />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 👑 Admin pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route element={<AdminRoute />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
