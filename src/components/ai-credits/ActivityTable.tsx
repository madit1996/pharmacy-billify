import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAiCredits } from '@/contexts/AiCreditsContext';
import { CreditType } from '@/types/ai-credits';
import { Search, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function ActivityTable() {
  const { usage, transactions } = useAiCredits();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'usage' | 'transactions'>('all');
  const [filterSource, setFilterSource] = useState<'all' | CreditType>('all');

  const getCreditSourceColor = (source: CreditType) => {
    switch (source) {
      case 'free': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'individual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'organization': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Combine and filter data
  const allActivity = [
    ...usage.map(item => ({
      ...item,
      type: 'usage' as const,
      amount: -item.creditsUsed,
      description: item.feature
    })),
    ...transactions.map(item => ({
      ...item,
      type: 'transaction' as const,
      amount: item.type === 'purchase' ? item.credits : -item.credits,
      description: `Credit ${item.type}`,
      source: item.source,
      patientName: undefined,
      appointmentId: undefined
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredActivity = allActivity.filter(item => {
    const matchesSearch = !searchTerm || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.patientName && item.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.appointmentId && item.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSource = filterSource === 'all' || item.source === filterSource;
    
    return matchesSearch && matchesType && matchesSource;
  });

  const exportData = () => {
    const csvContent = [
      ['Date', 'Type', 'Description', 'Credits', 'Source', 'Patient', 'Appointment ID'],
      ...filteredActivity.map(item => [
        format(new Date(item.date), 'yyyy-MM-dd HH:mm'),
        item.type,
        item.description,
        item.amount.toString(),
        item.source,
        item.patientName || '',
        item.appointmentId || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-credits-activity-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              Detailed log of all credit usage and transactions
            </CardDescription>
          </div>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={(value: 'all' | 'usage' | 'transactions') => setFilterType(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="usage">Usage Only</SelectItem>
              <SelectItem value="transactions">Transactions Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSource} onValueChange={(value: 'all' | CreditType) => setFilterSource(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="free">Free Credits</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Appointment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No activity found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivity.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(item.date), 'MMM dd, HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.type === 'usage' ? 'destructive' : 'default'}>
                        {item.type === 'usage' ? 'Usage' : 'Purchase'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCreditSourceColor(item.source)} variant="secondary">
                        {item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.patientName || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {item.appointmentId || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredActivity.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <span>Showing {filteredActivity.length} of {allActivity.length} records</span>
            <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}