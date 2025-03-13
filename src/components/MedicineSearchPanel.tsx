
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillItem } from "@/pages/PharmacyPage";

interface MedicineSearchPanelProps {
  onAddToBill: (item: BillItem) => void;
  searchTerm?: string;
}

const MedicineSearchPanel = ({ onAddToBill, searchTerm = "" }: MedicineSearchPanelProps) => {
  // Sample medicine data
  const allMedicines = [
    {
      id: "1",
      name: "Paracetamol Berno",
      price: 3.75,
      image: "https://medcitynews.com/uploads/2021/04/GettyImages-1204788864.jpg",
      dosage: "Paracetamol works by inhibiting the production of certain chemicals in the body that are responsible for pain and fever.",
      discount: 0,
      quantity: 1,
      nettoSize: "60ml",
      stock: "12 Available"
    },
    {
      id: "2",
      name: "Insto Cool",
      price: 1.25,
      image: "https://insto.co.id/wp-content/uploads/2019/04/INSTO-COOL-e1555411322428.png",
      dosage: "INSTO COOL EYE DROPS contains tetrahydrozoline hydrochloride, used to relieve red eyes due to mild irritation by providing a refreshing sensation.",
      discount: 0,
      quantity: 1,
      nettoSize: "7.5ml",
      stock: "6 Available"
    },
    {
      id: "3",
      name: "HI-D 5000 Vitamin",
      price: 2.10,
      image: "https://img.freepik.com/premium-photo/vitamin-d-capsules-orange-background_185193-9196.jpg",
      dosage: "dosage 1 times a day",
      discount: 0,
      quantity: 1,
      nettoSize: "Bottle",
      stock: "24 Available"
    },
    {
      id: "4",
      name: "Sanmol Tablets",
      price: 1.75,
      image: "https://cdn.shopify.com/s/files/1/0515/9661/6488/files/sanmol-strip.jpg",
      dosage: "dosage 2 times a day",
      discount: 0,
      quantity: 1,
      nettoSize: "Strip",
      stock: "18 Available"
    },
    {
      id: "5",
      name: "Aspirin 100mg",
      price: 2.50,
      image: "https://www.drugs.com/images/pills/custom/pill24530-1/aspirin.jpg",
      dosage: "Anti-inflammatory and pain relief medication",
      discount: 5,
      quantity: 1,
      nettoSize: "Strip",
      stock: "30 Available"
    },
    {
      id: "6",
      name: "Amoxicillin 500mg",
      price: 4.25,
      image: "https://www.drugs.com/images/pills/custom/pill13964-1/amoxicillin.jpg",
      dosage: "Antibiotic for bacterial infections",
      discount: 0,
      quantity: 1,
      nettoSize: "Bottle",
      stock: "15 Available"
    },
    {
      id: "7",
      name: "Cetirizine 10mg",
      price: 3.10,
      image: "https://www.drugs.com/images/pills/custom/pill17841-1/cetirizine-hydrochloride.jpg",
      dosage: "Antihistamine for allergy relief",
      discount: 0,
      quantity: 1,
      nettoSize: "Strip",
      stock: "20 Available"
    },
    {
      id: "8",
      name: "Ibuprofen 400mg",
      price: 2.95,
      image: "https://www.drugs.com/images/pills/custom/pill15321-1/ibuprofen.jpg",
      dosage: "Anti-inflammatory and pain relief",
      discount: 0,
      quantity: 1,
      nettoSize: "Strip",
      stock: "22 Available"
    },
    {
      id: "9",
      name: "Loratadine 10mg",
      price: 3.45,
      image: "https://www.drugs.com/images/pills/custom/pill7351-1/loratadine.jpg",
      dosage: "Non-drowsy antihistamine",
      discount: 10,
      quantity: 1,
      nettoSize: "Strip",
      stock: "16 Available"
    },
    {
      id: "10",
      name: "Omeprazole 20mg",
      price: 5.20,
      image: "https://www.drugs.com/images/pills/custom/pill19239-1/omeprazole.jpg",
      dosage: "Proton pump inhibitor for acid reflux",
      discount: 0,
      quantity: 1,
      nettoSize: "Strip",
      stock: "12 Available"
    },
    {
      id: "11",
      name: "Simvastatin 20mg",
      price: 4.75,
      image: "https://www.drugs.com/images/pills/custom/pill17123-1/simvastatin.jpg",
      dosage: "Statin medication for cholesterol",
      discount: 0,
      quantity: 1,
      nettoSize: "Strip",
      stock: "10 Available"
    },
    {
      id: "12",
      name: "Metformin 500mg",
      price: 3.80,
      image: "https://www.drugs.com/images/pills/custom/pill18108-1/metformin-hydrochloride.jpg",
      dosage: "Oral diabetes medication",
      discount: 0,
      quantity: 1,
      nettoSize: "Bottle",
      stock: "14 Available"
    }
  ];

  const [quantities, setQuantities] = useState<{[key: string]: number}>(
    allMedicines.reduce((acc, med) => ({...acc, [med.id]: 0}), {})
  );
  
  const [displayMedicines, setDisplayMedicines] = useState(allMedicines);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = allMedicines.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.dosage.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayMedicines(filtered);
    } else {
      setDisplayMedicines(allMedicines);
    }
  }, [searchTerm]);

  const handleAddToBill = (medicine: BillItem) => {
    onAddToBill(medicine);
    
    // Update quantity in the UI
    setQuantities({
      ...quantities,
      [medicine.id]: quantities[medicine.id] + 1
    });
  };

  const handleDecreaseQuantity = (medicineId: string) => {
    if (quantities[medicineId] > 0) {
      setQuantities({
        ...quantities,
        [medicineId]: quantities[medicineId] - 1
      });
    }
  };

  return (
    <div className="p-3 grid grid-cols-2 gap-4 overflow-y-auto">
      {displayMedicines.map((medicine) => (
        <div 
          key={medicine.id} 
          className="bg-white p-3 border rounded-lg shadow-sm hover:shadow transition-shadow"
        >
          <div className="flex">
            <div className="w-1/4">
              <img 
                src={medicine.image} 
                alt={medicine.name} 
                className="w-full aspect-square object-cover rounded-md"
              />
            </div>
            
            <div className="w-3/4 pl-3">
              <h3 className="font-medium text-gray-900 text-sm">{medicine.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{medicine.dosage}</p>
              
              <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                <div>
                  <p className="text-gray-500">Netto</p>
                  <p className="font-medium">{medicine.nettoSize}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stock</p>
                  <p className="font-medium">{medicine.stock}</p>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-pharmacy-primary font-medium text-sm">$ {medicine.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 ml-1">/ {medicine.nettoSize}</span>
                </div>
                
                <div className="flex space-x-1">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="px-1 h-7 text-gray-500"
                    onClick={() => handleDecreaseQuantity(medicine.id)}
                  >
                    -
                  </Button>
                  
                  <span className="flex items-center justify-center w-6 text-xs">{quantities[medicine.id]}</span>
                  
                  <Button 
                    size="sm"
                    className="px-1 h-7 bg-pharmacy-primary hover:bg-pharmacy-primary/90"
                    onClick={() => handleAddToBill(medicine)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {displayMedicines.length === 0 && (
        <div className="col-span-2 py-8 text-center text-gray-500">
          No medicines found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default MedicineSearchPanel;
