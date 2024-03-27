import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const postData = {
        username: username,
        password: password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVERAPI}/login`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const tokenData = await response.data;

      localStorage.setItem("token", tokenData.token); // Storing token in Local Storage
      localStorage.setItem("user", tokenData.username);

      navigate("/blogs");
    } catch (err) {
      console.error("got error: ", err);
      toast.error(err.response.data.message);
    }
  }

  return (
    <>
      <form
        method="post"
        id="adminLoginForm"
        className="min-h-60 min-w-120 flex flex-col rounded-lg bg-slate-100 justify-around align-middle p-5 border shadow-2xl border-gray-500  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2 className="text-lg self-center mb-2">Admin Login</h2>
        <label htmlFor="username" className="flex flex-col">
          Username
          <input
            type="text"
            name="username"
            id="username"
            className="border-2 border-green-500 rounded-md mt-2 p-1 pl-2 pr-2 transition focus:bg-slate-300"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="flex flex-col">
          password
          <input
            type="password"
            name="password"
            id="password"
            className="border-2 border-green-500 rounded-md mt-2 p-1 pl-2 pr-2 transition focus:bg-slate-300"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          className="border w-1/2 self-center mt-2 border-green-700 rounded-md shadow-md shadow-green-950 p-2 bg-green-400 transition-all hover:shadow-sm hover:shadow-green-950"
          onClick={handleLogin}
        >
          login
        </button>
      </form>
      <ToastContainer />
    </>
  );
}
