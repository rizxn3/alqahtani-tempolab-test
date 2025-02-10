import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import ProductGrid from "./ProductGrid";
import BikeTypeGrid from "./BikeTypeGrid";
import MadeTypeGrid from "./MadeTypeGrid";
import { ChevronLeft } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CategoryState {
  bikeType?: { id: string; name: string };
  madeType?: { id: string; name: string };
}

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryState>({});
  const [bikeTypes, setBikeTypes] = useState<
    Array<{ id: string; name: string; image_url: string }>
  >([]);
  const [madeTypes, setMadeTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: bikeData } = await supabase.from("bike_types").select("*");
      const { data: madeData } = await supabase.from("made_types").select("*");
      setBikeTypes(bikeData || []);
      setMadeTypes(madeData || []);
    };
    fetchCategories();
  }, []);

  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    const newCartItems = existingItem
      ? cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.image_url,
          },
        ];

    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const newCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item,
    );
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    console.log("Searching for", searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onSearchSubmit={handleSearch}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {categories.bikeType ? (
            <div className="mb-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setCategories({})}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Bike Types
              </Button>
              <h2 className="text-2xl font-bold mb-6">
                {categories.bikeType.name}
              </h2>

              {!categories.madeType ? (
                <MadeTypeGrid
                  madeTypes={madeTypes}
                  onSelect={(madeType) =>
                    setCategories({ ...categories, madeType })
                  }
                />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() =>
                      setCategories({ bikeType: categories.bikeType })
                    }
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Made Types
                  </Button>
                  <ProductGrid
                    bikeTypeId={categories.bikeType.id}
                    madeTypeId={categories.madeType.id}
                    onAddToCart={handleAddToCart}
                  />
                </>
              )}
            </div>
          ) : (
            <BikeTypeGrid
              bikeTypes={bikeTypes}
              onSelect={(bikeType) => setCategories({ bikeType })}
            />
          )}
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default Home;
