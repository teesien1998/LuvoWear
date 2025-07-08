import { useState, useRef } from "react";
import logoicon from "@/assets/images/luvowearicon.png";
import { Link } from "react-router-dom";
import login from "@/assets/images/login.jpg";
import { Input } from "@heroui/input";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Password Visibility State
  const [errorMsgPassword, setErrorMsgPassword] = useState([]);

  // const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  // const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState("default");
  const [passwordStatus, setPasswordStatus] = useState("default");

  const emailTimeoutRef = useRef(null); // store new timeout
  const passwordTimeoutRef = useRef(null); // store new timeout

  const dispatch = useDispatch();

  // Toggle Password Visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    console.log("User Login", { email, password });
  };

  // Email validation regex
  const validateEmail = (value) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
  };

  // Password validation logic
  const validatePassword = (value) => {
    const errors = [];

    if (value.length < 4) {
      errors.push("Password must be 4 characters or more.");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Must include at least 1 uppercase letter.");
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors.push("Must include at least 1 special character.");
    }

    return errors;
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailStatus("default"); // Reset while typing
    clearTimeout(emailTimeoutRef.current);

    emailTimeoutRef.current = setTimeout(() => {
      if (!value) return setEmailStatus("default");
      setEmailStatus(validateEmail(value) ? "success" : "danger");
    }, 1000);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStatus("default"); // Reset while typing
    clearTimeout(passwordTimeoutRef.current);

    passwordTimeoutRef.current = setTimeout(() => {
      if (!value) return setPasswordStatus("default");
      const errors = validatePassword(value);
      setErrorMsgPassword(errors);
      setPasswordStatus(errors.length > 0 ? "danger" : "success");
    }, 1000);
  };

  // const handleEmailChange = (value) => {
  //   setEmail(value);
  //   clearTimeout(emailTimeoutRef.current);

  //   emailTimeoutRef.current = setTimeout(() => {
  //     if (!value) return setIsInvalidEmail(false);
  //     setIsInvalidEmail(!validateEmail(value));
  //   }, 1000);
  // };

  // const handlePasswordChange = (value) => {
  //   setPassword(value);
  //   clearTimeout(passwordTimeoutRef.current);

  //   passwordTimeoutRef.current = setTimeout(() => {
  //     if (!value) return setIsInvalidPassword(false);
  //     const errors = validatePassword(value);
  //     setErrorMsgPassword(errors);
  //     setIsInvalidPassword(errors.length > 0);
  //   }, 1000);
  // };

  return (
    <div className="flex">
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 md:p-12 border-r">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-[400px] mx-auto p-8 rounded-lg border shadow-md "
        >
          <div className="flex justify-center mb-6">
            <img src={logoicon} alt="LuvoWear" className="w-36" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {/* <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              value={email}
              className="w-full p-2 border rounded shadow-sm hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              color={emailStatus}
              errorMessage="Please enter a valid email"
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
              classNames={{
                label: "text-md",
              }}
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onValueChange={handlePasswordChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-custom hover:bg-customHover text-white font-medium px-4 py-2 rounded-lg mt-4 transition"
          >
            Login
          </button>
          <p className="text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600">
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
