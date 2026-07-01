import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";
import Spinner from "../components/ui/Spinner";
import logo from "../assets/logo1.png";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Phone validation
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      toast.error(
        "Password must contain at least 8 characters, a letter, a number, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "/api/auth/register",
        form
      );

      dispatch(
        setCredentials({
          token: data.token,
          user: data.user,
        })
      );

      toast.success("Account created successfully!");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-beige-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-beige-200 shadow-sm p-10">

          <div className="mb-8 text-center">
            <img
              src={logo}
              alt="Sweetly Sweet"
              className="w-16 h-16 mx-auto mb-4"
            />

            <p className="section-eyebrow text-center">
              Join us
            </p>

            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
              Create account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label-luxury">
                Full Name
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Your Name"
                className="input-luxury"
              />
            </div>

            <div>
              <label className="label-luxury">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="you@example.com"
                className="input-luxury"
              />
            </div>

            <div>
              <label className="label-luxury">
                Phone Number
              </label>

              <input
                type="tel"
                required
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="9876543210"
                className="input-luxury"
              />
            </div>

            <div>
              <label className="label-luxury">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Minimum 8 characters"
                  className="input-luxury w-full pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Password must contain at least 8 characters,
                one letter, one number, and one special character.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#8a8a8a] mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-forest-600 hover:text-forest-800 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}