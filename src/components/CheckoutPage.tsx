import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import Header from "./Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem("cartItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      navigate("/"); // Redirect to home if no items in cart
    }
  }, [navigate]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      navigate("/login");
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const quotationData = {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      company_name: user.company_name,
      notes: formData.get("notes"),
      status: "pending",
    };

    try {
      // Insert quotation request
      const { data: quotation, error: quotationError } = await supabase
        .from("quotation_requests")
        .insert([quotationData])
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Insert quotation items
      const quotationItems = items.map((item) => ({
        quotation_id: quotation.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("quotation_items")
        .insert(quotationItems);

      if (itemsError) throw itemsError;

      // Clear cart from localStorage
      localStorage.removeItem("cartItems");

      toast({
        title: "Quote Request Submitted",
        description: "We'll review your request and get back to you soon.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error",
        description:
          "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Cart Items */}
              <Card className="mb-6 bg-white">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Notes Form */}
              <Card className="bg-white">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Additional Notes
                  </h2>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Additional Notes
                    </label>
                    <Textarea
                      name="notes"
                      placeholder="Any specific requirements or questions about the products?"
                      className="h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <Card className="bg-white sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="text-sm text-gray-500">
                      * Final price will be confirmed after quote review
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
