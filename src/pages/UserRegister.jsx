import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {
  const navigate = useNavigate()
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
  })
  
  const [errorMsgs, setErrorMsgs] = useState([])
  // Added state for handling success messages
  const [successMsg, setSuccessMsg] = useState("")

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsgs([]);
    setSuccessMsg("");

    try {
      const res = await axios.post("https://newsbackend-3-q0cj.onrender.com/api/create-user", data);
      console.log("Success response:", res.data);

      if (res.data.success) {
        // Show success message and navigate after a brief delay
        setSuccessMsg(res.data.message || "Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        if (Array.isArray(res.data.message)) {
          setErrorMsgs(res.data.message.map((err) => err.msg || err.message || err));
        } else if (typeof res.data.message === "string") {
          setErrorMsgs([res.data.message]);
        } else {
          setErrorMsgs(["Registration failed"]);
        }
      }
    } catch (error) {
      console.error("Registration error object:", error);

      const serverData = error.response?.data;
      const rawErrors = serverData?.errors || serverData?.message || serverData?.error;

      if (Array.isArray(rawErrors)) {
        const extractedMsgs = rawErrors.map((err) => {
          if (typeof err === "string") return err;
          return err.msg || err.message || err.param || JSON.stringify(err);
        });
        setErrorMsgs(extractedMsgs);
      } else if (typeof rawErrors === "string") {
        setErrorMsgs([rawErrors]);
      } else if (typeof rawErrors === "object" && rawErrors !== null) {
        setErrorMsgs(Object.values(rawErrors).flat());
      } else {
        setErrorMsgs([error.message || "An unexpected error occurred. Please try again."]);
      }
    }
  }

  return (
    <>
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scrollUp linear infinite;
        }
        .animate-scroll-down {
          animation: scrollDown linear infinite;
        }
      `}</style>

      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">

        {/* Top Header Banner */}
        <header className="absolute top-0 inset-x-0 z-50 flex justify-center py-5 bg-white shadow-xl border-b-4 border-black">
          <h2 className="text-3xl md:text-5xl font-black tracking-widest text-slate-900 uppercase text-center px-4">
            THE DIGITAL NEWS
          </h2>
        </header>

        {/* Background Image Columns */}
        <div className="absolute inset-0 grid grid-cols-5 gap-4 overflow-hidden opacity-25 pointer-events-none px-2 pt-20">
          <div className="overflow-hidden">
            <div className="animate-scroll-down flex flex-col space-y-6 py-3" style={{ animationDuration: '20s' }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrf5yci3K8tie9XpdEyRaCC8_FiknswJECzoI38aCN0A&s=10" alt="bg-1" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzVlcbrnZSPJoGORacGaAyzGBqoHx-uZBEPCVe2JNYFg&s=10" alt="bg-2" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH89IfKZicudXHh4aNCIW6srwwgQYOXe1Lgn0LGd4uA&s=10" alt="bg-3" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDGcx89VFnQeSMGj9POoLrXj3kzTP6fx__R-bg0kseUw&s=10" alt="bg-4" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="animate-scroll-up flex flex-col space-y-6 py-3" style={{ animationDuration: '25s' }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH89IfKZicudXHh4aNCIW6srwwgQYOXe1Lgn0LGd4uA&s=10" alt="bg-3" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDGcx89VFnQeSMGj9POoLrXj3kzTP6fx__R-bg0kseUw&s=10" alt="bg-4" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrf5yci3K8tie9XpdEyRaCC8_FiknswJECzoI38aCN0A&s=10" alt="bg-1" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzVlcbrnZSPJoGORacGaAyzGBqoHx-uZBEPCVe2JNYFg&s=10" alt="bg-2" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="animate-scroll-down flex flex-col space-y-6 py-3" style={{ animationDuration: '18s' }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzVlcbrnZSPJoGORacGaAyzGBqoHx-uZBEPCVe2JNYFg&s=10" alt="bg-2" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH89IfKZicudXHh4aNCIW6srwwgQYOXe1Lgn0LGd4uA&s=10" alt="bg-3" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDGcx89VFnQeSMGj9POoLrXj3kzTP6fx__R-bg0kseUw&s=10" alt="bg-4" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrf5yci3K8tie9XpdEyRaCC8_FiknswJECzoI38aCN0A&s=10" alt="bg-1" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="animate-scroll-up flex flex-col space-y-6 py-3" style={{ animationDuration: '22s' }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDGcx89VFnQeSMGj9POoLrXj3kzTP6fx__R-bg0kseUw&s=10" alt="bg-4" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrf5yci3K8tie9XpdEyRaCC8_FiknswJECzoI38aCN0A&s=10" alt="bg-1" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzVlcbrnZSPJoGORacGaAyzGBqoHx-uZBEPCVe2JNYFg&s=10" alt="bg-2" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH89IfKZicudXHh4aNCIW6srwwgQYOXe1Lgn0LGd4uA&s=10" alt="bg-3" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="animate-scroll-down flex flex-col space-y-6 py-3" style={{ animationDuration: '24s' }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrf5yci3K8tie9XpdEyRaCC8_FiknswJECzoI38aCN0A&s=10" alt="bg-1" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDGcx89VFnQeSMGj9POoLrXj3kzTP6fx__R-bg0kseUw&s=10" alt="bg-4" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzVlcbrnZSPJoGORacGaAyzGBqoHx-uZBEPCVe2JNYFg&s=10" alt="bg-2" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH89IfKZicudXHh4aNCIW6srwwgQYOXe1Lgn0LGd4uA&s=10" alt="bg-3" className="w-full h-44 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div className="relative z-10 bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mt-20">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            REGISTER
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Register to get started
          </p>

          {/* Render success message */}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

          {/* Render error list */}
          {errorMsgs.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              <ul className="list-disc list-inside space-y-1">
                {errorMsgs.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Enter your name"
                value={data.name}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email"
                value={data.email}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={data.password}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              Register
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline font-medium">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserRegister;