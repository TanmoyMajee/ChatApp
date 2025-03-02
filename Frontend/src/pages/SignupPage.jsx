import { useState ,useContext,useEffect } from "react";

import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import UserContext from "@/contextApi/UserContext";

export default function SignupPage() {
   const navigate = useNavigate();
   const { toast } = useToast();
   const {user,login} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profilePic, setProfilePic] = useState(null); // this holds the file object

  useEffect(()=>{
      if(user)
        navigate('/home')
  },[user])

  // This function is called when the user selects a file.
  // We simply store the file in state; we delay uploading until signup.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optionally check if the file type is an image:
      if (!file.type.startsWith("image/")) {
          toast({
          title: "Invalid file type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
          setProfilePic(null);
        return;
      }
      setProfilePic(file);
    }
  };

  // When the user clicks Sign Up, we do the following:
  // 1. Validate that passwords match.
  // 2. If a file is selected, upload it to Cloudinary and get the secure_url.
  // 3. Combine all the state data into an object and send it to your backend via axios.
   // Cloudinary configuration (replace with your actual credentials)
  const CLOUD_NAME = "dzztoym0v";
  const UPLOAD_PRESET = "Chat_App_Profile_pic";

  const handleSignup = async () => {

    console.log(name,email,password , confirmPassword ,profilePic)

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
      // Upload to Cloudinary if image is selected
      if (profilePic) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        imageUrl = cloudinaryResponse.data.secure_url;
        setUploading(false);
      }

      // Send data to backend
      // const signupData = {
      //   name,
      //   email,
      //   password,
      //   pic: imageUrl,  // Using 'pic' to match your backend model
      // };
      // console.log(signupData)
      // const pic : profilePic;
      const response = await axios.post(" http://localhost:5000/api/users",
         {name,email,password,pic:imageUrl}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("Signup response:", response);
      if (response.data) {
        // localStorage.setItem("user", JSON.stringify(response.data));
          login(response.data);
         toast({
          title: "Signup successful",
          description: "Redirect to Home Page.",
          variant: "default",
        });
        // Redirect to chat page
        navigate("/home");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || "Signup failed. Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // ... (rest of the JSX remains the same)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <Input
            type="tel"
            placeholder="Phone Number"
            className="w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          /> */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-0.5 p-1"
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
              className="w-full pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-0.5 p-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <div className="relative">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center justify-between">
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="text-sm text-gray-600">
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
            className="w-full mt-4"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign Up"}
          </Button>
          {/* <div className="text-center mt-2">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Log In
              </a>
            </p>
          </div> */}
            <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Log in here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
