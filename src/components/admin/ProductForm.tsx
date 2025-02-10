import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BikeType {
  id: string;
  name: string;
}

interface MadeType {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  part_number: string;
  bike_type_id: string;
  made_type_id: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData?.image_url || "");
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
  const [madeTypes, setMadeTypes] = useState<MadeType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: bikeData } = await supabase.from("bike_types").select("*");
      const { data: madeData } = await supabase.from("made_types").select("*");
      setBikeTypes(bikeData || []);
      setMadeTypes(madeData || []);
    };
    fetchCategories();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setSelectedFile(file);
    setValue("image_url", "pending-upload"); // Temporary value to pass form validation
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    try {
      // Create a unique file name
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      image_url: "",
      part_number: "",
      bike_type_id: "",
      made_type_id: "",
    },
  });

  const onSubmitWithImage = async (data: ProductFormData) => {
    if (selectedFile) {
      const imageUrl = await uploadImage();
      if (!imageUrl) {
        // Handle upload error
        return;
      }
      data.image_url = imageUrl;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWithImage)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Product name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Product description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bike Type</label>
          <select
            {...register("bike_type_id", { required: "Bike type is required" })}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select bike type</option>
            {bikeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.bike_type_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bike_type_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Made Type</label>
          <select
            {...register("made_type_id", { required: "Made type is required" })}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select made type</option>
            {madeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.made_type_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.made_type_id.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <Input
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
          })}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Part Number</label>
        <Input
          {...register("part_number", { required: "Part number is required" })}
          placeholder="e.g. PART-001"
        />
        {errors.part_number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.part_number.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <div className="mt-2 flex flex-col items-center gap-4">
          {preview && (
            <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden border">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or WEBP (MAX. 2MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <input
                type="hidden"
                {...register("image_url", { required: "Image is required" })}
              />
            </label>
          </div>
          {errors.image_url && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image_url.message}
            </p>
          )}
          {selectedFile && (
            <p className="text-sm text-blue-500">
              Image selected - will be uploaded when you save
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default ProductForm;
