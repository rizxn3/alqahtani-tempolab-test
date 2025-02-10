import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card } from "../ui/card";
import ProductForm from "./ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error("Error fetching products:", error);
    else setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData: Omit<Product, "id">) => {
    const { error } = await supabase.from("products").insert([productData]);
    if (error) console.error("Error adding product:", error);
    else {
      fetchProducts();
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateProduct = async (
    id: string,
    productData: Partial<Product>,
  ) => {
    const { error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id);
    if (error) console.error("Error updating product:", error);
    else {
      fetchProducts();
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      // First delete all quotation items related to this product
      const { error: quotationItemsError } = await supabase
        .from("quotation_items")
        .delete()
        .eq("product_id", id);

      if (quotationItemsError) throw quotationItemsError;

      // Then delete the product
      const { error: productError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (productError) throw productError;

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-sm text-gray-600">
              Part Number: {product.part_number}
            </p>
            <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setEditingProduct(product)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingProduct}
        onOpenChange={() => setEditingProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={editingProduct}
              onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
