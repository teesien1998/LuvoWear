import { useState, useEffect } from "react";
import logoicon from "@/assets/images/luvowearicon.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import register from "@/assets/images/register.jpg";
import { Input, Button } from "@heroui/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { setCredentials } from "@/redux/slices/authSlice";
import { useRegisterUserMutation } from "@/redux/api/userApiSlice";
import { useMergeGuestCartMutation } from "@/redux/api/cartApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/slices/cartSlice";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMsgName, setErrorMsgName] = useState("");
  const [errorMsgEmail, setErrorMsgEmail] = useState("");
  const [errorMsgPassword, setErrorMsgPassword] = useState([]);
  const [nameStatus, setNameStatus] = useState("default");
  const [emailStatus, setEmailStatus] = useState("default");
  const [passwordStatus, setPasswordStatus] = useState("default");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);

  // const userId = user ? user._id : null;

  // Mutation
  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();
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

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    // Name validation (if you want custom error for Name too)
    if (!name.trim()) {
      setNameStatus("danger");
      setErrorMsgName("Please fill out this field.");
      valid = false;
    } else {
      setNameStatus("success");
      setErrorMsgName("");
    }

    // Email validation
    if (!email.trim()) {
      setEmailStatus("danger");
      setErrorMsgEmail("Please fill out this field.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailStatus("danger");
      setErrorMsgEmail("Please enter a valid email.");
      valid = false;
    } else {
      setEmailStatus("success");
      setErrorMsgEmail("");
    }

    // Password validation
    const passwordErrors = validatePassword(password);
    if (!password.trim()) {
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

    if (!valid) return;

    // console.log("Submitted");
    try {
      const res = registerUser({ name, email, password }).unwrap();
      dispatch(setCredentials(res.user));
      navigate(redirect);
      // console.log("User Registered", { name, email, password });
    } catch (err) {
      console.error(
        `Register failed: ${err?.data?.message || "Unknown error"}`
      );
      toast.error(`Register failed: ${err?.data?.message || "Unknown error"}`);
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

  const handleNameChange = (value) => {
    setName(value);

    if (!value.trim()) {
      setNameStatus("danger");
      setErrorMsgName("Please fill out this field.");
    } else {
      setNameStatus("success");
      setErrorMsgName("");
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    if (!value.trim()) {
      setEmailStatus("danger");
      setErrorMsgEmail("Please fill out this field.");
      return;
    } else if (!validateEmail(value)) {
      setEmailStatus("danger");
      setErrorMsgEmail("Please enter a valid email.");
      return;
    } else {
      setEmailStatus("success");
      setErrorMsgEmail("");
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (!value.trim()) {
      setPasswordStatus("danger");
      setErrorMsgPassword(["Please fill out this field."]);
      return;
    }

    const passwordErrors = validatePassword(value);
    if (passwordErrors.length > 0) {
      setPasswordStatus("danger");
      setErrorMsgPassword(passwordErrors);
    } else {
      setPasswordStatus("success");
      setErrorMsgPassword([]);
    }
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
          className="bg-white w-[400px] mx-auto p-8 rounded-lg border shadow-md"
          noValidate
        >
          <div className="flex justify-center mb-6">
            <img src={logoicon} alt="LuvoWear" className="w-36" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              color={nameStatus}
              errorMessage={errorMsgName}
              isRequired
              isInvalid={nameStatus === "danger"}
              value={name}
              label="Name"
              classNames={{
                label: "text-base",
              }}
              type="text"
              variant="bordered"
              onValueChange={handleNameChange}
            />
          </div>

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              color={emailStatus}
              errorMessage={errorMsgEmail}
              isRequired
              isInvalid={emailStatus === "danger"}
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
              color={passwordStatus}
              errorMessage={() => (
                <ul>
                  {errorMsgPassword.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              isRequired
              isInvalid={passwordStatus === "danger"}
              value={password}
              label="Password"
              type={isVisible ? "text" : "password"}
              classNames={{
                label: "text-md",
              }}
              variant="bordered"
              onValueChange={handlePasswordChange}
            />
          </div>
          <button   
            isLoading={registerLoading || cartLoading}
            disabled={registerLoading || cartLoading}
            type="submit"
            className="w-full text-sm bg-custom hover:bg-customHover text-white font-medium px-4 py-2.5 rounded-lg mt-4 transition"
          >
            {registerLoading || cartLoading ? "Registering in..." : "Register"}
          </button>
          <p className="text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              to={redirect !== "/" ? `/login?redirect=${redirect}` : "/login"}
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden lg:block w-1/2 bg-gray-800">
        <div className="flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
