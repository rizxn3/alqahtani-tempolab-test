import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

interface HeaderProps {
  cartItemCount?: number;
  onSearchSubmit?: (searchTerm: string) => void;
  onCartClick?: () => void;
}

const Header = ({
  cartItemCount = 0,
  onSearchSubmit = () => {},
  onCartClick = () => {},
}: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchTerm);
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
              <a href="/" className="text-lg font-semibold">
                Home
              </a>
              <a href="/categories" className="text-lg">
                Categories
              </a>
              <a href="/about" className="text-lg">
                About
              </a>
              <a href="/contact" className="text-lg">
                Contact
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="text-2xl font-bold text-blue-600">
            Al Qahtani
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block flex-1 px-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink href="/categories/chains">
                      Chains
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/categories/brakes">
                      Brakes
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/categories/pedals">
                      Pedals
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Cart and Profile Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="relative" onClick={onCartClick}>
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/profile")}
          >
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
