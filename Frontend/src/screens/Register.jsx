import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null); // image file
  const [preview, setPreview] = useState(""); // preview URL
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // optional validation
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  function submitHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);


    // send form data — let the browser set Content-Type (with boundary)
    axios
      .post("/users/register", formData)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        // persist user similar to login flow so UI (and reloads) have access to profilePic
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full p-3 rounded bg-gray-700 text-white"
              placeholder="Enter your name"
            />
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-center mb-6">
              <label htmlFor="profilePic" className="cursor-pointer">
                <img
                  src={preview ? preview : "https://via.placeholder.com/150"}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
                />
              </label>

              <input
                type="file"
                id="profilePic"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>
          <button
            type="submit"
            className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
