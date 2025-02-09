import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import Header from "./Header";

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [quotations, setQuotations] = useState([]);

  React.useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const { data, error } = await supabase
      .from("quotation_requests")
      .select(
        `
        *,
        quotation_items(*, products(*))
      `,
      )
      .eq("user_id", user.id);

    if (error) console.error("Error fetching quotations:", error);
    else setQuotations(data || []);
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      phone: formData.get("phone"),
      company_name: formData.get("company") || null,
    };

    try {
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-sm ${colors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        defaultValue={user.first_name}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        defaultValue={user.last_name}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input value={user.email} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <Input name="phone" defaultValue={user.phone} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company Name (Optional)
                    </label>
                    <Input
                      name="company"
                      defaultValue={user.company_name || ""}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <div className="space-y-4">
                {quotations.map((quotation: any) => (
                  <Card key={quotation.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Request ID: {quotation.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date:{" "}
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(quotation.status)}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Requested Items</h4>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {quotation.quotation_items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 border rounded-lg"
                          >
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                              <img
                                src={item.products.image_url}
                                alt={item.products.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <h4 className="font-medium">
                                {item.products.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-600">
                                Price: ${item.price_at_time.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {quotation.notes && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-1">Notes</h4>
                        <p className="text-gray-600">{quotation.notes}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
