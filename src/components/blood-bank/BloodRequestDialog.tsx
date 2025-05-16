
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BloodRequest, BloodGroup } from "@/types/blood-bank";
import { useBloodBankContext } from "@/contexts/BloodBankContext";

interface BloodRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloodRequest: BloodRequest | null;
}

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const priorities = ['normal', 'urgent', 'emergency'];
const statuses = ['pending', 'fulfilled', 'cancelled'];

const BloodRequestDialog = ({ open, onOpenChange, bloodRequest }: BloodRequestDialogProps) => {
  const { addRequest, updateRequest } = useBloodBankContext();

  const form = useForm({
    defaultValues: {
      patientId: bloodRequest?.patientId || '',
      patientName: bloodRequest?.patientName || '',
      bloodGroup: bloodRequest?.bloodGroup || 'A+',
      quantity: bloodRequest?.quantity || 1,
      requestDate: bloodRequest?.requestDate || new Date().toISOString().split('T')[0],
      requiredDate: bloodRequest?.requiredDate || '',
      priority: bloodRequest?.priority || 'normal',
      requestedBy: bloodRequest?.requestedBy || '',
      purpose: bloodRequest?.purpose || '',
      status: bloodRequest?.status || 'pending',
    }
  });

  useEffect(() => {
    if (bloodRequest) {
      form.reset({
        patientId: bloodRequest.patientId,
        patientName: bloodRequest.patientName,
        bloodGroup: bloodRequest.bloodGroup,
        quantity: bloodRequest.quantity,
        requestDate: bloodRequest.requestDate,
        requiredDate: bloodRequest.requiredDate,
        priority: bloodRequest.priority,
        requestedBy: bloodRequest.requestedBy,
        purpose: bloodRequest.purpose,
        status: bloodRequest.status,
      });
    } else {
      form.reset({
        patientId: '',
        patientName: '',
        bloodGroup: 'A+',
        quantity: 1,
        requestDate: new Date().toISOString().split('T')[0],
        requiredDate: '',
        priority: 'normal',
        requestedBy: '',
        purpose: '',
        status: 'pending',
      });
    }
  }, [bloodRequest, form]);

  const onSubmit = (data: any) => {
    if (bloodRequest) {
      updateRequest({
        ...bloodRequest,
        ...data
      });
    } else {
      addRequest(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {bloodRequest ? "Edit Blood Request" : "Create Blood Request"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (units)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
              name="requestedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested By</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {bloodRequest && (
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
            )}

            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                {bloodRequest ? "Update" : "Create"} Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BloodRequestDialog;
