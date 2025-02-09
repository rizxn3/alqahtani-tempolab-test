import React from "react";
import { Card } from "../ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
