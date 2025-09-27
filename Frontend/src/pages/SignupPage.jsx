import { useState, useContext, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import UserContext from "@/contextApi/UserContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login, googleRegister } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      setProfilePic(null);
      return;
    }
    setProfilePic(file);
  };

  const CLOUD_NAME = "dzztoym0v";
  const UPLOAD_PRESET = "Chat_App_Profile_pic";

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword || !profilePic) {
      toast({
        title: "Missing fields",
        description: "Please fill all the fields Frontend.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    setLoading(true);

    let imageUrl = "";

    try {
      if (profilePic) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        imageUrl = cloudinaryResponse.data.secure_url;
        setUploading(false);
      }

      const backendURL = import.meta.env.VITE_BACKEND_URL || "";
      const response = await axios.post(
        `${backendURL}/api/users`,
        { name, email, password, pic: imageUrl },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data) {
        login(response.data);
        toast({
          title: "Signup successful",
          description: "Redirect to Home Page.",
          variant: "default",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description:
          error.response?.data?.message ||
          "Signup failed. Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-l from-purple-50 to-indigo-500 px-4">
      {/* Top Branding & Info */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-800">ChatApp</h1>
        <p className="text-lg text-gray-700 mt-1">
          Real-Time Connect & Chat
        </p>
        <p className="text-sm text-gray-800 mt-2 max-w-md mx-auto px-2">
          Connect instantly with friends, family & colleagues —
          one-on-one or in groups.
        </p>
      </div>

      <Card className="w-full max-w-lg shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-500">
            Create Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6 py-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="py-3"
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-3"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="py-3 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>

          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}

          <div className="mt-3">
            <label className="block text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="text-sm text-gray-600 truncate max-w-xs">
                {profilePic ? profilePic.name : "No file chosen"}
              </span>
            </div>
          </div>

          {uploading && (
            <p className="text-blue-500 text-sm">Uploading image...</p>
          )}

          <Button
            onClick={handleSignup}
            disabled={loading || uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign Up"}
          </Button>

          <div className="flex items-center justify-center">
            <span className="text-gray-500 mr-3">or</span>
            <Button
              onClick={googleRegister}
              className="flex items-center border border-gray-300 bg-white hover:bg-gray-100 px-5 py-2 rounded-lg"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google Sign Up
            </Button>
          </div>

          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline"
            >
              Log in here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
