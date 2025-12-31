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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
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
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Community
            </h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl"
              required
            />

            {/* First + Last */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full pl-10 pr-4 py-3 border rounded-xl"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full pl-10 pr-4 py-3 border rounded-xl"
              />
            </div>

            {/* Country */}
            <div ref={countryDropdownRef} className="relative">
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Search for your country"
                className="w-full pl-10 pr-10 py-3 border rounded-xl"
              />
              {showCountryDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-xl shadow max-h-60 overflow-y-auto">
                  {filteredCountries.map((c) => (
                    <div
                      key={c}
                      onClick={() => handleCountrySelect(c)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* University */}
            <div ref={universityDropdownRef} className="relative">
              <input
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                onFocus={() => setShowUniversityDropdown(true)}
                placeholder="Search for your university"
                className="w-full pl-10 pr-10 py-3 border rounded-xl"
              />
              {showUniversityDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-xl shadow max-h-60 overflow-y-auto">
                  {filteredUniversities.map((u) => (
                    <div
                      key={u}
                      onClick={() => handleUniversitySelect(u)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Passwords */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold"
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
