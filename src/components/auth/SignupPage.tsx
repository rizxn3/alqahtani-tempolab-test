import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import AuthLayout from "./AuthLayout";
import { supabase } from "@/lib/supabase";
import { useToast } from "../ui/use-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string, // In production, hash this
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      company_name: (formData.get("company") as string) || null,
    };

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem("user", JSON.stringify(data));
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input name="firstName" required placeholder="First name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input name="lastName" required placeholder="Last name" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            name="email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            name="password"
            type="password"
            required
            placeholder="Create a password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input name="phone" required placeholder="Your phone number" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name (Optional)
          </label>
          <Input name="company" placeholder="Your company name" />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
