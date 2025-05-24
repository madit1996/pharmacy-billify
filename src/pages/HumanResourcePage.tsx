
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import StaffAttendanceTab from "@/components/hr/StaffAttendanceTab";
import LeaveApprovalsTab from "@/components/hr/LeaveApprovalsTab";
import ShiftPlannerTab from "@/components/hr/ShiftPlannerTab";

const HumanResourcePage = () => {
  const [activeTab, setActiveTab] = useState("attendance");

  // Sample data for overview cards
  const hrStats = {
    totalStaff: 156,
    presentToday: 142,
    onLeave: 8,
    pendingLeaves: 12,
    shiftChanges: 3
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Human Resource Management</h1>
          <p className="text-gray-600">Manage staff, attendance, leaves, and schedules</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{hrStats.totalStaff}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{hrStats.presentToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-orange-600">{hrStats.onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Leaves</p>
                <p className="text-2xl font-bold text-yellow-600">{hrStats.pendingLeaves}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shift Changes</p>
                <p className="text-2xl font-bold text-purple-600">{hrStats.shiftChanges}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Staff Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Approvals</TabsTrigger>
          <TabsTrigger value="shifts">Shift Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <StaffAttendanceTab />
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <LeaveApprovalsTab />
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <ShiftPlannerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HumanResourcePage;
