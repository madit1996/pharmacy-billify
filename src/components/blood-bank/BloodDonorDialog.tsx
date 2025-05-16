
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BloodDonor, BloodGroup } from "@/types/blood-bank";
import { useBloodBankContext } from "@/contexts/BloodBankContext";

interface BloodDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor: BloodDonor | null;
}

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodDonorDialog = ({ open, onOpenChange, donor }: BloodDonorDialogProps) => {
  const { addDonor, updateDonor } = useBloodBankContext();

  const form = useForm({
    defaultValues: {
      name: donor?.name || '',
      contactNumber: donor?.contactNumber || '',
      email: donor?.email || '',
      bloodGroup: donor?.bloodGroup || 'A+',
      lastDonationDate: donor?.lastDonationDate || '',
      medicalHistory: donor?.medicalHistory || '',
      donationCount: donor?.donationCount || 0,
      eligibleDate: donor?.eligibleDate || '',
    }
  });

  useEffect(() => {
    if (donor) {
      form.reset({
        name: donor.name,
        contactNumber: donor.contactNumber,
        email: donor.email || '',
        bloodGroup: donor.bloodGroup,
        lastDonationDate: donor.lastDonationDate || '',
        medicalHistory: donor.medicalHistory || '',
        donationCount: donor.donationCount,
        eligibleDate: donor.eligibleDate || '',
      });
    } else {
      form.reset({
        name: '',
        contactNumber: '',
        email: '',
        bloodGroup: 'A+',
        lastDonationDate: '',
        medicalHistory: '',
        donationCount: 0,
        eligibleDate: '',
      });
    }
  }, [donor, form]);

  const onSubmit = (data: any) => {
    if (donor) {
      updateDonor({
        ...donor,
        ...data
      });
    } else {
      addDonor(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {donor ? "Edit Donor Details" : "Add New Donor"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="lastDonationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Donation Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="donationCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Donations</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eligibleDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Eligible Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {donor ? "Update" : "Add"} Donor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BloodDonorDialog;
