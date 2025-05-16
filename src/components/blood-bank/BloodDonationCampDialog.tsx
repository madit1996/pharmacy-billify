
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BloodDonationCamp } from "@/types/blood-bank";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { Textarea } from "@/components/ui/textarea";

interface BloodDonationCampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camp: BloodDonationCamp | null;
}

const statuses = ['scheduled', 'ongoing', 'completed', 'cancelled'];

const BloodDonationCampDialog = ({ open, onOpenChange, camp }: BloodDonationCampDialogProps) => {
  const { addCamp, updateCamp } = useBloodBankContext();

  const form = useForm({
    defaultValues: {
      name: camp?.name || '',
      location: camp?.location || '',
      address: camp?.address || '',
      organizer: camp?.organizer || '',
      contactPerson: camp?.contactPerson || '',
      contactNumber: camp?.contactNumber || '',
      startDate: camp?.startDate || new Date().toISOString().split('T')[0],
      endDate: camp?.endDate || new Date().toISOString().split('T')[0],
      expectedDonors: camp?.expectedDonors || 50,
      actualDonors: camp?.actualDonors || 0,
      status: camp?.status || 'scheduled',
      notes: camp?.notes || '',
    }
  });

  useEffect(() => {
    if (camp) {
      form.reset({
        name: camp.name,
        location: camp.location,
        address: camp.address,
        organizer: camp.organizer,
        contactPerson: camp.contactPerson,
        contactNumber: camp.contactNumber,
        startDate: camp.startDate,
        endDate: camp.endDate,
        expectedDonors: camp.expectedDonors,
        actualDonors: camp.actualDonors || 0,
        status: camp.status,
        notes: camp.notes || '',
      });
    } else {
      form.reset({
        name: '',
        location: '',
        address: '',
        organizer: '',
        contactPerson: '',
        contactNumber: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        expectedDonors: 50,
        actualDonors: 0,
        status: 'scheduled',
        notes: '',
      });
    }
  }, [camp, form]);

  const onSubmit = (data: any) => {
    if (camp) {
      updateCamp({
        ...camp,
        ...data
      });
    } else {
      addCamp(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {camp ? "Edit Blood Donation Camp" : "Organize New Blood Donation Camp"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camp Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizing Institution</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expectedDonors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Donors</FormLabel>
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
            </div>

            {camp && camp.status === 'completed' && (
              <FormField
                control={form.control}
                name="actualDonors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Donors</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                {camp ? "Update" : "Create"} Camp
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BloodDonationCampDialog;
