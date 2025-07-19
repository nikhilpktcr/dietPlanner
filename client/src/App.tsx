import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer style={{ color: "black" }} autoClose={2000} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
