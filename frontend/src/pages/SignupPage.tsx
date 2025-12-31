import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  MapPin,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { registerUser, RegisterData } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { COUNTRIES, searchCountries } from "../data/countries";
import { US_UNIVERSITIES, searchUniversities } from "../data/universities";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    country: "",
    university: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const universityDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = formData.country
    ? searchCountries(formData.country)
    : COUNTRIES.slice(0, 20);

  const filteredUniversities = formData.university
    ? searchUniversities(formData.university)
    : US_UNIVERSITIES.slice(0, 20);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
      if (
        universityDropdownRef.current &&
        !universityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUniversityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountrySelect = (country: string) => {
    setFormData((prev) => ({ ...prev, country }));
    setShowCountryDropdown(false);
  };

  const handleUniversitySelect = (university: string) => {
    setFormData((prev) => ({ ...prev, university }));
    setShowUniversityDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const registerData: RegisterData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        country: formData.country,
        university: formData.university,
      };

      const response = await registerUser(registerData);

      if (response.success && response.user) {
        await login(response.user);
        navigate("/");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Join Our Community
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full p-3 border rounded"
            />
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full p-3 border rounded"
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full p-3 border rounded"
            />

            {/* Country */}
            <div ref={countryDropdownRef}>
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Country"
                className="w-full p-3 border rounded"
              />
              {showCountryDropdown && (
                <div className="border mt-1 rounded bg-white max-h-40 overflow-y-auto">
                  {filteredCountries.map((c) => (
                    <div
                      key={c}
                      onClick={() => handleCountrySelect(c)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* University */}
            <div ref={universityDropdownRef}>
              <input
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                onFocus={() => setShowUniversityDropdown(true)}
                placeholder="University"
                className="w-full p-3 border rounded"
              />
              {showUniversityDropdown && (
                <div className="border mt-1 rounded bg-white max-h-40 overflow-y-auto">
                  {filteredUniversities.map((u) => (
                    <div
                      key={u}
                      onClick={() => handleUniversitySelect(u)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-3 border rounded"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded"
            />

            <button
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
