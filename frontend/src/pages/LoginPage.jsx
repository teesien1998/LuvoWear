import { useState, useEffect } from "react";
import logoicon from "@/assets/images/luvowearicon.png";
import { Link } from "react-router-dom";
import login from "@/assets/images/login.jpg";
import { Input, Button } from "@heroui/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setCredentials } from "@/redux/slices/authSlice";
import { useLoginUserMutation } from "@/redux/api/userApiSlice";
import { useMergeGuestCartMutation } from "@/redux/api/cartApiSlice";
import { setCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Password Visibility <State></State>
  const [emailStatus, setEmailStatus] = useState("default");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);

  // const userId = user ? user._id : null;

  // Mutation
  const [loginUser, { isLoading: userLoading }] = useLoginUserMutation();
  const [mergeGuestCart, { isLoading: cartLoading }] =
    useMergeGuestCartMutation();

  useEffect(() => {
    const handleRedirect = async () => {
      if (user) {
        try {
          if (guestId) {
            const updatedCart = await mergeGuestCart(guestId).unwrap();
            dispatch(setCart(updatedCart)); // Update Redux store with merged cart
          }
        } catch (error) {
          console.error(
            `Error merging guest cart: ${
              error?.data?.message || "Unknown error"
            }`
          );
        } finally {
          navigate(redirect);
        }
      }
    };

    handleRedirect();
  }, [navigate, user, guestId, mergeGuestCart, redirect]);

  // Toggle Password Visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }).unwrap();
      dispatch(setCredentials(res.user)); // store in Redux + localStorage
      // navigate(redirect);
    } catch (err) {
      console.error(`Login failed: ${err?.data?.message || "Unknown error"}`);
      toast.error(`Login failed: ${err?.data?.message || "Unknown error"}`);
    }
  };

  // Email validation regex
  const validateEmail = (value) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailStatus("default"); // Reset while typing

    if (!value.trim()) {
      setEmailStatus("danger");
    } else if (!validateEmail(value)) {
      setEmailStatus("danger");
    } else {
      setEmailStatus("success");
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  return (
    <div className="flex">
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 md:p-12 border-r">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "enter") {
              handleSubmit(e);
            }
          }}
          className="bg-white w-[400px] mx-auto p-8 rounded-lg border shadow-md "
        >
          <div className="flex justify-center mb-6">
            <img src={logoicon} alt="LuvoWear" className="w-36" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              color={emailStatus}
              errorMessage={
                !email.trim()
                  ? "Please fill out this field."
                  : "Please enter a valid email"
              }
              isRequired
              value={email}
              label="Email"
              classNames={{
                label: "text-md",
              }}
              type="email"
              variant="bordered"
              onValueChange={handleEmailChange}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
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
              isRequired
              value={password}
              label="Password"
              classNames={{
                label: "text-md",
              }}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onValueChange={handlePasswordChange}
            />
          </div>
          <Button
            isLoading={userLoading || cartLoading}
            disabled={userLoading || cartLoading}
            type="submit"
            className="w-full bg-custom hover:bg-customHover text-white font-medium px-4 py-2 rounded-lg mt-4 transition"
          >
            {userLoading || cartLoading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link
              to={
                redirect !== "/"
                  ? `/register?redirect=${redirect}`
                  : "/register"
              }
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block w-1/2 bg-gray-800">
        <div className="flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
