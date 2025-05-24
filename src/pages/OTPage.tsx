
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Activity, 
  Clock, 
  Plus,
  User,
  Calendar as CalendarIcon,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Play,
  Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Surgery {
  id: string;
  patientName: string;
  patientId: string;
  procedure: string;
  surgeon: string;
  assistantSurgeon?: string;
  anesthesiologist: string;
  otRoom: string;
  date: Date;
  startTime: string;
  estimatedDuration: number; // in minutes
  endTime?: string;
  actualDuration?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'delayed';
  priority: 'routine' | 'urgent' | 'emergency';
  preOpNotes?: string;
  postOpNotes?: string;
  complications?: string;
  equipment: string[];
}

interface OTRoom {
  id: string;
  name: string;
  type: 'general' | 'cardiac' | 'neuro' | 'orthopedic' | 'emergency';
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  currentSurgery?: string;
  equipment: string[];
  lastMaintenance: Date;
}

const OTPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedOT, setSelectedOT] = useState<string>("all");
  const { toast } = useToast();

  const otRooms: OTRoom[] = [
    { 
      id: "OT001", 
      name: "OT-1", 
      type: "general", 
      status: "occupied", 
      currentSurgery: "S001",
      equipment: ["Anesthesia Machine", "Monitor", "Electrocautery", "Suction"],
      lastMaintenance: new Date(2024, 0, 10)
    },
    { 
      id: "OT002", 
      name: "OT-2", 
      type: "cardiac", 
      status: "available",
      equipment: ["Heart-Lung Machine", "Anesthesia Machine", "Monitor", "Defibrillator"],
      lastMaintenance: new Date(2024, 0, 12)
    },
    { 
      id: "OT003", 
      name: "OT-3", 
      type: "orthopedic", 
      status: "available",
      equipment: ["C-Arm", "Drill Set", "Anesthesia Machine", "Monitor"],
      lastMaintenance: new Date(2024, 0, 15)
    },
    { 
      id: "OT004", 
      name: "OT-4", 
      type: "neuro", 
      status: "maintenance",
      equipment: ["Microscope", "Neuro Monitor", "Anesthesia Machine"],
      lastMaintenance: new Date(2024, 0, 5)
    }
  ];

  const [surgeries, setSurgeries] = useState<Surgery[]>([
    {
      id: "S001",
      patientName: "John Anderson",
      patientId: "P201",
      procedure: "Appendectomy",
      surgeon: "Dr. Budi Santoso",
      assistantSurgeon: "Dr. Sarah Tanoto",
      anesthesiologist: "Dr. Andi Wijaya",
      otRoom: "OT-1",
      date: new Date(),
      startTime: "08:00",
      estimatedDuration: 90,
      status: "in-progress",
      priority: "urgent",
      preOpNotes: "Patient has history of allergies to penicillin",
      equipment: ["Laparoscopic Set", "Electrocautery", "Suction"]
    },
    {
      id: "S002",
      patientName: "Maria Garcia",
      patientId: "P202",
      procedure: "Knee Replacement",
      surgeon: "Dr. Budi Santoso",
      anesthesiologist: "Dr. Dewi Sutanto",
      otRoom: "OT-3",
      date: new Date(),
      startTime: "14:00",
      estimatedDuration: 180,
      status: "scheduled",
      priority: "routine",
      preOpNotes: "Pre-operative physiotherapy completed",
      equipment: ["Orthopedic Implants", "C-Arm", "Drill Set"]
    },
    {
      id: "S003",
      patientName: "Robert Smith",
      patientId: "P203",
      procedure: "Cardiac Bypass",
      surgeon: "Dr. Andi Wijaya",
      assistantSurgeon: "Dr. Sarah Tanoto",
      anesthesiologist: "Dr. Dewi Sutanto",
      otRoom: "OT-2",
      date: new Date(2024, 0, 20),
      startTime: "09:00",
      estimatedDuration: 240,
      status: "scheduled",
      priority: "urgent",
      preOpNotes: "High-risk patient, requires ICU bed post-op",
      equipment: ["Heart-Lung Machine", "Defibrillator", "Cardiac Monitors"]
    }
  ]);

  const filteredSurgeries = surgeries.filter(surgery => {
    const dateMatch = surgery.date.toDateString() === selectedDate.toDateString();
    const otMatch = selectedOT === "all" || surgery.otRoom === selectedOT;
    return dateMatch && otMatch;
  });

  const todaySurgeries = surgeries.filter(s => 
    s.date.toDateString() === new Date().toDateString()
  );

  const inProgressSurgeries = todaySurgeries.filter(s => s.status === 'in-progress').length;
  const completedSurgeries = todaySurgeries.filter(s => s.status === 'completed').length;
  const scheduledSurgeries = todaySurgeries.filter(s => s.status === 'scheduled').length;

  const handleScheduleSurgery = (surgeryData: Partial<Surgery>) => {
    const newSurgery: Surgery = {
      id: `S${String(surgeries.length + 1).padStart(3, '0')}`,
      patientName: surgeryData.patientName!,
      patientId: surgeryData.patientId!,
      procedure: surgeryData.procedure!,
      surgeon: surgeryData.surgeon!,
      assistantSurgeon: surgeryData.assistantSurgeon,
      anesthesiologist: surgeryData.anesthesiologist!,
      otRoom: surgeryData.otRoom!,
      date: selectedDate,
      startTime: surgeryData.startTime!,
      estimatedDuration: surgeryData.estimatedDuration!,
      status: 'scheduled',
      priority: surgeryData.priority as Surgery['priority'],
      preOpNotes: surgeryData.preOpNotes,
      equipment: surgeryData.equipment || []
    };

    setSurgeries([...surgeries, newSurgery]);
    setIsScheduleDialogOpen(false);
    
    toast({
      title: "Surgery Scheduled",
      description: `${surgeryData.procedure} scheduled for ${surgeryData.patientName} in ${surgeryData.otRoom}`,
    });
  };

  const updateSurgeryStatus = (surgeryId: string, status: Surgery['status']) => {
    setSurgeries(surgeries.map(s => 
      s.id === surgeryId ? { 
        ...s, 
        status,
        endTime: status === 'completed' ? new Date().toLocaleTimeString() : s.endTime
      } : s
    ));
    
    toast({
      title: "Surgery Status Updated",
      description: `Surgery status changed to ${status}`,
    });
  };

  const getStatusBadge = (status: Surgery['status']) => {
    const statusConfig = {
      'scheduled': { color: "bg-blue-100 text-blue-800", icon: Clock },
      'in-progress': { color: "bg-orange-100 text-orange-800", icon: Play },
      'completed': { color: "bg-green-100 text-green-800", icon: CheckCircle },
      'cancelled': { color: "bg-red-100 text-red-800", icon: Square },
      'delayed': { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Surgery['priority']) => {
    const priorityConfig = {
      'routine': 'bg-gray-100 text-gray-800',
      'urgent': 'bg-yellow-100 text-yellow-800',
      'emergency': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={priorityConfig[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getOTStatusBadge = (status: OTRoom['status']) => {
    const statusConfig = {
      'available': 'bg-green-100 text-green-800',
      'occupied': 'bg-red-100 text-red-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'cleaning': 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={statusConfig[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Operating Theater (OT)</h1>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Surgery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Surgery</DialogTitle>
            </DialogHeader>
            <SurgeryScheduleForm onSubmit={handleScheduleSurgery} otRooms={otRooms} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Surgeries</p>
                <h3 className="text-2xl font-bold">{todaySurgeries.length}</h3>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h3 className="text-2xl font-bold text-orange-600">{inProgressSurgeries}</h3>
              </div>
              <Play className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-green-600">{completedSurgeries}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <h3 className="text-2xl font-bold text-blue-600">{scheduledSurgeries}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar and OT Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border mb-4"
            />
            
            <div className="space-y-3">
              <div>
                <Label>Filter by OT</Label>
                <Select value={selectedOT} onValueChange={setSelectedOT}>
                  <SelectTrigger>
                    <SelectValue placeholder="All OTs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All OTs</SelectItem>
                    {otRooms.map(room => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name} - {room.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="font-medium mb-2">OT Room Status</h4>
                <div className="space-y-2">
                  {otRooms.map(room => (
                    <div key={room.id} className="p-2 border rounded text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{room.name}</span>
                        {getOTStatusBadge(room.status)}
                      </div>
                      <p className="text-gray-600 text-xs">{room.type} surgery</p>
                      {room.currentSurgery && (
                        <p className="text-blue-600 text-xs">Surgery in progress</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Surgery List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Surgeries for {selectedDate.toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              {filteredSurgeries.length} surgeries scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <SurgeryList 
                  surgeries={filteredSurgeries}
                  onUpdateStatus={updateSurgeryStatus}
                />
              </TabsContent>
              
              <TabsContent value="scheduled">
                <SurgeryList 
                  surgeries={filteredSurgeries.filter(s => s.status === 'scheduled')}
                  onUpdateStatus={updateSurgeryStatus}
                />
              </TabsContent>
              
              <TabsContent value="in-progress">
                <SurgeryList 
                  surgeries={filteredSurgeries.filter(s => s.status === 'in-progress')}
                  onUpdateStatus={updateSurgeryStatus}
                />
              </TabsContent>
              
              <TabsContent value="completed">
                <SurgeryList 
                  surgeries={filteredSurgeries.filter(s => s.status === 'completed')}
                  onUpdateStatus={updateSurgeryStatus}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SurgeryList = ({ surgeries, onUpdateStatus }: { 
  surgeries: Surgery[], 
  onUpdateStatus: (surgeryId: string, status: Surgery['status']) => void 
}) => {
  const getStatusBadge = (status: Surgery['status']) => {
    const statusConfig = {
      'scheduled': { color: "bg-blue-100 text-blue-800", icon: Clock },
      'in-progress': { color: "bg-orange-100 text-orange-800", icon: Play },
      'completed': { color: "bg-green-100 text-green-800", icon: CheckCircle },
      'cancelled': { color: "bg-red-100 text-red-800", icon: Square },
      'delayed': { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Surgery['priority']) => {
    const priorityConfig = {
      'routine': 'bg-gray-100 text-gray-800',
      'urgent': 'bg-yellow-100 text-yellow-800',
      'emergency': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={priorityConfig[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  if (surgeries.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No surgeries scheduled</h3>
        <p className="text-gray-500">No surgeries match the current filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {surgeries.map(surgery => (
        <Card key={surgery.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-medium">{surgery.procedure}</h4>
                  {getStatusBadge(surgery.status)}
                  {getPriorityBadge(surgery.priority)}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Patient:</span>
                    <p className="font-medium">{surgery.patientName}</p>
                    <p className="text-gray-600">ID: {surgery.patientId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Surgeon:</span>
                    <p className="font-medium">{surgery.surgeon}</p>
                    {surgery.assistantSurgeon && (
                      <p className="text-gray-600">Asst: {surgery.assistantSurgeon}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-500">OT & Time:</span>
                    <p className="font-medium">{surgery.otRoom}</p>
                    <p className="text-gray-600">{surgery.startTime} ({surgery.estimatedDuration}min)</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Anesthesiologist:</span>
                    <p className="font-medium">{surgery.anesthesiologist}</p>
                  </div>
                </div>

                {surgery.equipment.length > 0 && (
                  <div className="mb-3">
                    <span className="text-gray-500 text-sm">Equipment:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {surgery.equipment.map((eq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {eq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {surgery.preOpNotes && (
                  <div className="text-sm">
                    <span className="text-gray-500">Pre-op Notes:</span>
                    <p className="italic">{surgery.preOpNotes}</p>
                  </div>
                )}

                {surgery.postOpNotes && (
                  <div className="text-sm mt-2">
                    <span className="text-gray-500">Post-op Notes:</span>
                    <p className="italic">{surgery.postOpNotes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {surgery.status === 'scheduled' && (
                  <Button 
                    size="sm" 
                    onClick={() => onUpdateStatus(surgery.id, 'in-progress')}
                  >
                    Start
                  </Button>
                )}
                {surgery.status === 'in-progress' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdateStatus(surgery.id, 'completed')}
                  >
                    Complete
                  </Button>
                )}
                {(surgery.status === 'scheduled' || surgery.status === 'in-progress') && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdateStatus(surgery.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const SurgeryScheduleForm = ({ onSubmit, otRooms }: { 
  onSubmit: (data: Partial<Surgery>) => void,
  otRooms: OTRoom[]
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    procedure: '',
    surgeon: '',
    assistantSurgeon: '',
    anesthesiologist: '',
    otRoom: '',
    startTime: '',
    estimatedDuration: '',
    priority: 'routine' as Surgery['priority'],
    preOpNotes: '',
    equipment: [] as string[]
  });

  const doctors = [
    "Dr. Andi Wijaya",
    "Dr. Dewi Sutanto",
    "Dr. Budi Santoso",
    "Dr. Sarah Tanoto"
  ];

  const commonEquipment = [
    "Anesthesia Machine",
    "Monitor",
    "Electrocautery",
    "Suction",
    "Laparoscopic Set",
    "C-Arm",
    "Microscope",
    "Heart-Lung Machine",
    "Defibrillator"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      estimatedDuration: Number(formData.estimatedDuration)
    };
    onSubmit(submitData);
  };

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, equipment: [...formData.equipment, equipment]});
    } else {
      setFormData({...formData, equipment: formData.equipment.filter(e => e !== equipment)});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Patient Name</Label>
          <Input
            value={formData.patientName}
            onChange={(e) => setFormData({...formData, patientName: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Patient ID</Label>
          <Input
            value={formData.patientId}
            onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Procedure</Label>
          <Input
            value={formData.procedure}
            onChange={(e) => setFormData({...formData, procedure: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Priority</Label>
          <Select 
            value={formData.priority}
            onValueChange={(value) => setFormData({...formData, priority: value as Surgery['priority']})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Surgeon</Label>
          <Select 
            value={formData.surgeon}
            onValueChange={(value) => setFormData({...formData, surgeon: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Surgeon" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Assistant Surgeon (Optional)</Label>
          <Select 
            value={formData.assistantSurgeon}
            onValueChange={(value) => setFormData({...formData, assistantSurgeon: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Assistant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {doctors.map(doctor => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Anesthesiologist</Label>
          <Select 
            value={formData.anesthesiologist}
            onValueChange={(value) => setFormData({...formData, anesthesiologist: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Anesthesiologist" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Operating Theater</Label>
          <Select 
            value={formData.otRoom}
            onValueChange={(value) => setFormData({...formData, otRoom: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select OT" />
            </SelectTrigger>
            <SelectContent>
              {otRooms.filter(room => room.status === 'available').map(room => (
                <SelectItem key={room.id} value={room.name}>
                  {room.name} - {room.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            required
          />
        </div>
        <div>
          <Label>Estimated Duration (minutes)</Label>
          <Input
            type="number"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label>Pre-operative Notes</Label>
        <Textarea
          value={formData.preOpNotes}
          onChange={(e) => setFormData({...formData, preOpNotes: e.target.value})}
          placeholder="Any special instructions or patient conditions..."
        />
      </div>

      <div>
        <Label>Required Equipment</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {commonEquipment.map(equipment => (
            <div key={equipment} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={equipment}
                checked={formData.equipment.includes(equipment)}
                onChange={(e) => handleEquipmentChange(equipment, e.target.checked)}
              />
              <Label htmlFor={equipment} className="text-sm">
                {equipment}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Schedule Surgery
      </Button>
    </form>
  );
};

export default OTPage;
