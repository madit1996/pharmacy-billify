
import { useState } from "react";
import { Button } from "@/components/ui/button";

const WaitlistPanel = () => {
  const waitlistItems = [
    {
      id: "A1",
      name: "Yuda Rahmat",
      items: 3,
      isHighlighted: true
    },
    {
      id: "A2",
      name: "Aulia Akbar",
      items: 5,
      isHighlighted: false
    },
    {
      id: "A3",
      name: "Haul Anggara",
      items: 3,
      isHighlighted: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex items-center justify-between border-b">
        <h3 className="font-medium">Waitlist</h3>
        <Button variant="link" size="sm" className="text-pharmacy-primary px-0">
          See all
        </Button>
      </div>
      
      <div className="divide-y">
        {waitlistItems.map((item) => (
          <div 
            key={item.id}
            className={`p-4 flex items-center justify-between ${
              item.isHighlighted ? "bg-green-50" : ""
            }`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.isHighlighted 
                  ? "bg-green-100 text-pharmacy-primary" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {item.id}
              </div>
              <div className="ml-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.items} items</p>
              </div>
            </div>
            
            <div className="text-xs px-2 py-1 rounded-full bg-gray-800 text-white">
              #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitlistPanel;
