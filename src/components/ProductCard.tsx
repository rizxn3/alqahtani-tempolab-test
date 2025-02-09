import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  onAddToCart?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Mountain Bike Chain",
  description = "High-performance bike chain suitable for all terrain types",
  price = 29.99,
  imageUrl = "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80",
  onAddToCart = () => {},
}: ProductCardProps) => {
  return (
    <Card className="w-[280px] h-[380px] bg-white overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <div className="h-[200px] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <p className="text-lg font-bold text-gray-900 mt-2">
          ${price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
