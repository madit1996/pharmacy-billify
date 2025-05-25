
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViewDetailsDialogProps {
  title: string;
  data: Record<string, any>;
  downloadable?: boolean;
}

const ViewDetailsDialog = ({ title, data, downloadable = false }: ViewDetailsDialogProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `${title} document is being downloaded.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium text-gray-600">{key}:</span>
              <span>{value || "N/A"}</span>
            </div>
          ))}
        </div>
        {downloadable && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsDialog;
