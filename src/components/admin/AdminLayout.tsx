import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, ShoppingBag, FileText, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            to="/admin/products"
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 ${isActive("/products") ? "bg-gray-100" : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            Products
          </Link>
          <Link
            to="/admin/quotations"
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 ${isActive("/quotations") ? "bg-gray-100" : ""}`}
          >
            <FileText className="h-5 w-5" />
            Quotations
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 text-blue-600"
          >
            <LayoutGrid className="h-5 w-5" />
            View Store
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
