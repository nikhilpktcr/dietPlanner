import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ILogin } from "../../interface/interface";
import { useRegisterMutation } from "../../redux/services/authApi";
import FormInput from "../../components/FormFields/FormInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid Format").required("Email is required"),
    password: Yup.string().required("Password is required"),
    age: Yup.number().required("age is required"),
    gender: Yup.string().required("gender is required"),
  });

  const handleSubmit = async (
    values: ILogin & { name: string; role: string }
  ) => {
    try {
      await registerUser(values).unwrap();
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed");
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
          Register
        </h2>
        <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          Create your account
        </p>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name: "",
            email: "",
            password: "",
            age: "",
            gender: "",
            role: "user",
          }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values }) => (
            <Form className="space-y-4 sm:space-y-5 w-full">
              <FormInput
                name="name"
                labelName="Name"
                placeHolder="Enter your name"
                data-testid="nameInput"
                onChange={handleChange}
                type="text"
                value={values.name}
              />
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
              <FormInput
                name="age"
                labelName="Age"
                placeHolder="Enter your age"
                data-testid="ageInput"
                onChange={handleChange}
                type="number"
                value={values.age}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  onChange={handleChange}
                  value={values.gender}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  data-testid="genderInput"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-center transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm sm:text-base"
                data-testid="registerBtn"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm sm:text-base">
            Already have an account?
          </span>
          <a
            href="/login"
            className="ml-2 text-indigo-600 hover:underline font-medium text-sm sm:text-base"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
