import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { CreditType } from '@/types/ai-credits';
import { Search, Download, Stethoscope, User, Calendar, UserCheck, Coins, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface RecentActivityTableProps {
  maxEntries?: number;
  showFilters?: boolean;
}

export function RecentActivityTable({ maxEntries = 15, showFilters = true }: RecentActivityTableProps) {
  const { usage } = useAiCredits();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<'all' | CreditType>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const getCreditSourceColor = (source: CreditType) => {
    switch (source) {
      case 'free': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'individual': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'organization': return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getCreditsUsedColor = (credits: number) => {
    if (credits <= 1) return 'text-emerald-600 dark:text-emerald-400';
    if (credits <= 3) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Enhanced mock data with diagnostic types
  const enhancedUsage = usage.map(item => ({
    ...item,
    diagnosticType: item.feature.includes('prescription') ? 'AI Prescription' : 
                   item.feature.includes('diagnosis') ? 'AI Diagnosis' : 
                   item.feature.includes('analysis') ? 'Medical Analysis' : 
                   item.feature.includes('report') ? 'Report Generation' : 'AI Assistant',
    patientName: item.patientName || `Patient-${Math.floor(Math.random() * 1000)}`,
    doctorName: item.doctor,
    creditsUsed: Math.floor(Math.random() * 3) + 1 // 1-3 credits
  }));

  const filteredActivity = enhancedUsage.filter(item => {
    const matchesSearch = !searchTerm || 
      item.diagnosticType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = filterSource === 'all' || item.source === filterSource;
    
    return matchesSearch && matchesSource;
  });

  const totalPages = Math.ceil(filteredActivity.length / maxEntries);
  const startIndex = (currentPage - 1) * maxEntries;
  const paginatedActivity = filteredActivity.slice(startIndex, startIndex + maxEntries);

  const exportData = () => {
    const csvContent = [
      ['Diagnostic Type', 'Patient Name', 'Date & Time', 'Doctor Name', 'Credits Used', 'Credit Source'],
      ...filteredActivity.map(item => [
        item.diagnosticType,
        item.patientName,
        format(new Date(item.date), 'yyyy-MM-dd HH:mm'),
        item.doctorName,
        item.creditsUsed.toString(),
        item.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recent-activity-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by diagnostic type, patient, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterSource} onValueChange={(value: 'all' | CreditType) => setFilterSource(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Credit source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="free">Free Credits</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={exportData} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Diagnostic Type
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Name
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date & Time
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Doctor Name
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Credits Used
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Credit Source
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedActivity.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-3">
                    <Stethoscope className="h-12 w-12 text-muted-foreground/30" />
                    <span>No recent activity found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedActivity.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"></div>
                      {item.diagnosticType}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {item.patientName}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {format(new Date(item.date), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.doctorName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${getCreditsUsedColor(item.creditsUsed)}`}>
                        {item.creditsUsed}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        credit{item.creditsUsed !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getCreditSourceColor(item.source)} border-0 shadow-sm`}>
                      {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredActivity.length > maxEntries && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + maxEntries, filteredActivity.length)} of {filteredActivity.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}