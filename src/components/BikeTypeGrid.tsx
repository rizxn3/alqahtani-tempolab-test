import React from "react";
import { Card, CardContent } from "./ui/card";

interface BikeType {
  id: string;
  name: string;
  image_url: string;
}

interface BikeTypeGridProps {
  bikeTypes: BikeType[];
  onSelect: (bikeType: BikeType) => void;
}

const BikeTypeGrid = ({ bikeTypes, onSelect }: BikeTypeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {bikeTypes.map((bikeType) => (
        <Card
          key={bikeType.id}
          className="w-[280px] cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(bikeType)}
        >
          <div className="h-[200px] w-full overflow-hidden">
            <img
              src={bikeType.image_url}
              alt={bikeType.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold text-center">
              {bikeType.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BikeTypeGrid;
