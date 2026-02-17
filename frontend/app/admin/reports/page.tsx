'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Calendar } from 'lucide-react';

const reports = [
  {
    id: '1',
    title: 'Monthly Revenue Report',
    description: 'Comprehensive revenue and profit analysis',
    period: 'June 2024',
    type: 'Financial',
  },
  {
    id: '2',
    title: 'User Activity Report',
    description: 'User engagement and retention metrics',
    period: 'June 2024',
    type: 'Users',
  },
  {
    id: '3',
    title: 'Crop Performance Report',
    description: 'Top selling crops and market trends',
    period: 'Q2 2024',
    type: 'Market',
  },
  {
    id: '4',
    title: 'Transport Efficiency Report',
    description: 'Delivery times and transporter performance',
    period: 'June 2024',
    type: 'Operations',
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and download platform reports</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Generate Custom Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 backdrop-blur-xl bg-card/80 border-border shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="june">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="june">June 2024</SelectItem>
              <SelectItem value="may">May 2024</SelectItem>
              <SelectItem value="q2">Q2 2024</SelectItem>
              <SelectItem value="q1">Q1 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-secondary rounded-full">{report.type}</span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{report.period}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  Excel
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
