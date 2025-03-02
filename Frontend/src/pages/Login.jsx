import { useState,useContext , useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import UserContext from "@/contextApi/UserContext";

export default function Login() {
   const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all the fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      console.log("Login response:", response);
      if (response.data) {
        // localStorage.setItem("user", JSON.stringify(response.data));
        login(response.data);
        toast({
          title: "Login successful",
          description: "Welcome back!",
          variant: "default",
        });
        // Redirect to home page
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description:
          error.response?.data?.message ||
          "Login failed. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
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
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Log In"}
          </Button>
          <div className="text-center mt-2">
           <Button variant="ghost" onClick={() => navigate("/")}>
              Don't have an account? Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}