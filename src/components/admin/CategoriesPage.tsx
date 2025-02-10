import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { supabase } from "@/lib/supabase";

interface BikeType {
  id: string;
  name: string;
  image_url: string;
}

interface MadeType {
  id: string;
  name: string;
}

const CategoriesPage = () => {
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
  const [madeTypes, setMadeTypes] = useState<MadeType[]>([]);
  const [isAddBikeTypeOpen, setIsAddBikeTypeOpen] = useState(false);
  const [isAddMadeTypeOpen, setIsAddMadeTypeOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const fetchCategories = async () => {
    const { data: bikeData } = await supabase.from("bike_types").select("*");
    const { data: madeData } = await supabase.from("made_types").select("*");
    setBikeTypes(bikeData || []);
    setMadeTypes(madeData || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("bike-type-images")
        .upload(fileName, selectedFile);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("bike-type-images").getPublicUrl(fileName);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAddBikeType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name || !selectedFile) return;

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    const { error } = await supabase
      .from("bike_types")
      .insert([{ name, image_url: imageUrl }]);

    if (!error) {
      fetchCategories();
      setIsAddBikeTypeOpen(false);
      setSelectedFile(null);
      setPreview("");
    }
  };

  const handleAddMadeType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name) return;

    const { error } = await supabase.from("made_types").insert([{ name }]);

    if (!error) {
      fetchCategories();
      setIsAddMadeTypeOpen(false);
    }
  };

  const handleDeleteBikeType = async (id: string) => {
    const { error } = await supabase.from("bike_types").delete().eq("id", id);
    if (!error) fetchCategories();
  };

  const handleDeleteMadeType = async (id: string) => {
    const { error } = await supabase.from("made_types").delete().eq("id", id);
    if (!error) fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <Tabs defaultValue="bike-types" className="w-full">
        <TabsList>
          <TabsTrigger value="bike-types">Bike Types</TabsTrigger>
          <TabsTrigger value="made-types">Made Types</TabsTrigger>
        </TabsList>

        <TabsContent value="bike-types">
          <div className="mb-4">
            <Button onClick={() => setIsAddBikeTypeOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Bike Type
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bikeTypes.map((type) => (
              <Card key={type.id} className="p-4">
                <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                  <img
                    src={type.image_url}
                    alt={type.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{type.name}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBikeType(type.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="made-types">
          <div className="mb-4">
            <Button onClick={() => setIsAddMadeTypeOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Made Type
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {madeTypes.map((type) => (
              <Card key={type.id} className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{type.name}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMadeType(type.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddBikeTypeOpen} onOpenChange={setIsAddBikeTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bike Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBikeType} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input name="name" required placeholder="Enter bike type name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="mt-2">
                {preview && (
                  <div className="mb-4 w-full max-w-[200px] aspect-square rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddBikeTypeOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddMadeTypeOpen} onOpenChange={setIsAddMadeTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Made Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMadeType} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input name="name" required placeholder="Enter made type name" />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMadeTypeOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
