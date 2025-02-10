import React from "react";
import { Card, CardContent } from "./ui/card";

interface MadeType {
  id: string;
  name: string;
}

interface MadeTypeGridProps {
  madeTypes: MadeType[];
  onSelect: (madeType: MadeType) => void;
}

const MadeTypeGrid = ({ madeTypes, onSelect }: MadeTypeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {madeTypes.map((madeType) => (
        <Card
          key={madeType.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(madeType)}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-center">
              {madeType.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MadeTypeGrid;
