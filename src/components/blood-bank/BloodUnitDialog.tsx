
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BloodUnit, BloodGroup } from "@/types/blood-bank";
import { useBloodBankContext } from "@/contexts/BloodBankContext";

interface BloodUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloodUnit: BloodUnit | null;
}

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const statuses = ['available', 'reserved', 'used', 'expired'];

const BloodUnitDialog = ({ open, onOpenChange, bloodUnit }: BloodUnitDialogProps) => {
  const { addBloodUnit, updateBloodUnit } = useBloodBankContext();

  const form = useForm({
    defaultValues: {
      bloodGroup: bloodUnit?.bloodGroup || 'A+',
      donationDate: bloodUnit?.donationDate || new Date().toISOString().split('T')[0],
      expiryDate: bloodUnit?.expiryDate || '',
      volume: bloodUnit?.volume || 450,
      status: bloodUnit?.status || 'available',
      location: bloodUnit?.location || 'Main Storage',
      donorId: bloodUnit?.donorId || '',
      campId: bloodUnit?.campId || '',
    }
  });

  useEffect(() => {
    if (bloodUnit) {
      form.reset({
        bloodGroup: bloodUnit.bloodGroup,
        donationDate: bloodUnit.donationDate,
        expiryDate: bloodUnit.expiryDate,
        volume: bloodUnit.volume,
        status: bloodUnit.status,
        location: bloodUnit.location,
        donorId: bloodUnit.donorId || '',
        campId: bloodUnit.campId || '',
      });
    } else {
      form.reset({
        bloodGroup: 'A+',
        donationDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        volume: 450,
        status: 'available',
        location: 'Main Storage',
        donorId: '',
        campId: '',
      });
    }
  }, [bloodUnit, form]);

  const onSubmit = (data: any) => {
    if (bloodUnit) {
      updateBloodUnit({
        ...bloodUnit,
        ...data
      });
    } else {
      addBloodUnit(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {bloodUnit ? "Edit Blood Unit" : "Add New Blood Unit"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume (ml)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                {bloodUnit ? "Update" : "Add"} Blood Unit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BloodUnitDialog;
