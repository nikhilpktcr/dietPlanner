import { ILogin } from "../../interface/interface";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../redux/services/authApi";
import FormInput from "../../components/FormFields/FormInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid format"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values: ILogin) => {
    try {
      const response = await loginUser(values).unwrap();
      localStorage.setItem("user", JSON.stringify(response));
      // Dispatch custom event to notify components about login
      window.dispatchEvent(new CustomEvent("userLogin", { detail: response }));
      const location =
        response.role === "user" ? "/dashboard" : "/admin-dashboard";
      navigate(location);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col items-center">
        <div className="bg-indigo-500 rounded-full p-4 mb-7 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 006 0v-1c0-1.657-1.343-3-3-3zm0 0V6m0 8v2m-6 4h12a2 2 0 002-2v-6a9 9 0 10-18 0v6a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          Sign in to your account
        </p>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values }) => (
            <Form className="space-y-4 sm:space-y-5 w-full">
              <FormInput
                name="email"
                labelName="Email"
                placeHolder="Enter your email"
                data-testid="emailInput"
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              <FormInput
                name="password"
                labelName="Password"
                placeHolder="Enter your password"
                data-testid="passwordInput"
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm sm:text-base"
                data-testid="loginBtn"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm sm:text-base">
            Don't have an account?
          </span>
          <a
            href="/register"
            className="ml-2 text-indigo-600 hover:underline font-medium text-sm sm:text-base"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
