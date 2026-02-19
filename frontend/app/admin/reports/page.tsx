'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Calendar, Loader2 } from 'lucide-react';

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
  const [downloading, setDownloading] = useState<string | null>(null);

  // Mock data generators for different report types
  const generateFinancialData = () => ({
    revenue: [
      { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
      { month: 'Feb', revenue: 52000, profit: 15000, expenses: 37000 },
      { month: 'Mar', revenue: 48000, profit: 13000, expenses: 35000 },
      { month: 'Apr', revenue: 61000, profit: 18000, expenses: 43000 },
      { month: 'May', revenue: 55000, profit: 16000, expenses: 39000 },
      { month: 'Jun', revenue: 67000, profit: 20000, expenses: 47000 },
    ],
    summary: {
      totalRevenue: 328000,
      totalProfit: 94000,
      totalExpenses: 234000,
      growthRate: 12.5
    }
  });

  const generateUserData = () => ({
    activity: [
      { metric: 'Active Users', current: 2450, previous: 2200, change: 11.4 },
      { metric: 'New Registrations', current: 320, previous: 280, change: 14.3 },
      { metric: 'Daily Active Users', current: 1850, previous: 1650, change: 12.1 },
      { metric: 'Session Duration (min)', current: 24.5, previous: 22.1, change: 10.9 },
      { metric: 'Retention Rate (%)', current: 78.5, previous: 75.2, change: 4.4 },
    ],
    demographics: [
      { segment: 'Farmers', count: 1200, percentage: 49 },
      { segment: 'Buyers', count: 850, percentage: 35 },
      { segment: 'Transporters', count: 400, percentage: 16 },
    ]
  });

  const generateMarketData = () => ({
    topCrops: [
      { crop: 'Rice', sales: 45000, volume: 1250, avgPrice: 36 },
      { crop: 'Wheat', sales: 38000, volume: 1100, avgPrice: 34.5 },
      { crop: 'Cotton', sales: 32000, volume: 800, avgPrice: 40 },
      { crop: 'Sugarcane', sales: 28000, volume: 950, avgPrice: 29.5 },
      { crop: 'Maize', sales: 25000, volume: 780, avgPrice: 32 },
    ],
    trends: [
      { period: 'Q1 2024', demand: 85, supply: 78, priceIndex: 92 },
      { period: 'Q2 2024', demand: 92, supply: 85, priceIndex: 98 },
    ]
  });

  const generateOperationsData = () => ({
    transport: [
      { metric: 'Average Delivery Time', current: 4.2, target: 4.0, status: 'On Track' },
      { metric: 'On-Time Delivery Rate', current: 94.5, target: 95.0, status: 'Near Target' },
      { metric: 'Transporter Utilization', current: 87.3, target: 90.0, status: 'Below Target' },
      { metric: 'Fuel Efficiency (km/l)', current: 8.5, target: 9.0, status: 'Below Target' },
    ],
    performance: [
      { transporter: 'Raj Transport', deliveries: 245, rating: 4.8, efficiency: 96 },
      { transporter: 'Green Logistics', deliveries: 198, rating: 4.6, efficiency: 92 },
      { transporter: 'Fast Delivery Co', deliveries: 167, rating: 4.7, efficiency: 94 },
      { transporter: 'Agri Movers', deliveries: 134, rating: 4.5, efficiency: 89 },
    ]
  });

  // Download handlers
  const handleDownloadPDF = async (report: any) => {
    setDownloading(`${report.id}-pdf`);
    try {
      // Create a simple HTML-based PDF using browser print
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download reports');
        return;
      }

      const data = report.type === 'Financial' ? generateFinancialData() :
                   report.type === 'Users' ? generateUserData() :
                   report.type === 'Market' ? generateMarketData() :
                   generateOperationsData();

      let content = `
        <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; text-align: center; }
            h2 { color: #374151; margin-top: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f9fafb; font-weight: bold; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AI-Powered Smart Agri Platform</h1>
            <h2>${report.title}</h2>
            <p><strong>Period:</strong> ${report.period}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
      `;

      if (report.type === 'Financial') {
        content += `
          <div class="summary">
            <h3>Revenue Summary</h3>
            <p><strong>Total Revenue:</strong> ₹${data.summary.totalRevenue.toLocaleString()}</p>
            <p><strong>Total Profit:</strong> ₹${data.summary.totalProfit.toLocaleString()}</p>
            <p><strong>Total Expenses:</strong> ₹${data.summary.totalExpenses.toLocaleString()}</p>
            <p><strong>Growth Rate:</strong> ${data.summary.growthRate}%</p>
          </div>

          <h3>Monthly Breakdown</h3>
          <table>
            <tr><th>Month</th><th>Revenue</th><th>Profit</th><th>Expenses</th></tr>
            ${data.revenue.map((month: any) => `
              <tr>
                <td>${month.month}</td>
                <td>₹${month.revenue.toLocaleString()}</td>
                <td>₹${month.profit.toLocaleString()}</td>
                <td>₹${month.expenses.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else if (report.type === 'Users') {
        content += `
          <h3>User Activity Metrics</h3>
          <table>
            <tr><th>Metric</th><th>Current</th><th>Previous</th><th>Change</th></tr>
            ${data.activity.map((metric: any) => `
              <tr>
                <td>${metric.metric}</td>
                <td>${metric.current}</td>
                <td>${metric.previous}</td>
                <td>${metric.change > 0 ? '+' : ''}${metric.change}%</td>
              </tr>
            `).join('')}
          </table>

          <h3>User Demographics</h3>
          <table>
            <tr><th>Segment</th><th>Count</th><th>Percentage</th></tr>
            ${data.demographics.map((segment: any) => `
              <tr>
                <td>${segment.segment}</td>
                <td>${segment.count}</td>
                <td>${segment.percentage}%</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else if (report.type === 'Market') {
        content += `
          <h3>Top Performing Crops</h3>
          <table>
            <tr><th>Crop</th><th>Sales</th><th>Volume</th><th>Avg Price</th></tr>
            ${data.topCrops.map((crop: any) => `
              <tr>
                <td>${crop.crop}</td>
                <td>₹${crop.sales.toLocaleString()}</td>
                <td>${crop.volume} tons</td>
                <td>₹${crop.avgPrice}/kg</td>
              </tr>
            `).join('')}
          </table>

          <h3>Market Trends</h3>
          <table>
            <tr><th>Period</th><th>Demand Index</th><th>Supply Index</th><th>Price Index</th></tr>
            ${data.trends.map((trend: any) => `
              <tr>
                <td>${trend.period}</td>
                <td>${trend.demand}</td>
                <td>${trend.supply}</td>
                <td>${trend.priceIndex}</td>
              </tr>
            `).join('')}
          </table>
        `;
      } else if (report.type === 'Operations') {
        content += `
          <h3>Transport Performance Metrics</h3>
          <table>
            <tr><th>Metric</th><th>Current</th><th>Target</th><th>Status</th></tr>
            ${data.transport.map((metric: any) => `
              <tr>
                <td>${metric.metric}</td>
                <td>${metric.current}</td>
                <td>${metric.target}</td>
                <td>${metric.status}</td>
              </tr>
            `).join('')}
          </table>

          <h3>Top Transporters</h3>
          <table>
            <tr><th>Transporter</th><th>Deliveries</th><th>Rating</th><th>Efficiency</th></tr>
            ${data.performance.map((transporter: any) => `
              <tr>
                <td>${transporter.transporter}</td>
                <td>${transporter.deliveries}</td>
                <td>${transporter.rating}</td>
                <td>${transporter.efficiency}%</td>
              </tr>
            `).join('')}
          </table>
        `;
      }

      content += `
          <div class="footer">
            Generated by AI-Powered Smart Agri Platform
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadExcel = async (report: any) => {
    setDownloading(`${report.id}-excel`);
    try {
      const data = report.type === 'Financial' ? generateFinancialData() :
                   report.type === 'Users' ? generateUserData() :
                   report.type === 'Market' ? generateMarketData() :
                   generateOperationsData();

      let csvContent = '';

      if (report.type === 'Financial') {
        csvContent = 'Month,Revenue,Profit,Expenses\n';
        data.revenue.forEach((month: any) => {
          csvContent += `${month.month},${month.revenue},${month.profit},${month.expenses}\n`;
        });
        csvContent += '\nSummary\n';
        csvContent += `Total Revenue,${data.summary.totalRevenue}\n`;
        csvContent += `Total Profit,${data.summary.totalProfit}\n`;
        csvContent += `Total Expenses,${data.summary.totalExpenses}\n`;
        csvContent += `Growth Rate,${data.summary.growthRate}%\n`;
      } else if (report.type === 'Users') {
        csvContent = 'Metric,Current,Previous,Change\n';
        data.activity.forEach((metric: any) => {
          csvContent += `${metric.metric},${metric.current},${metric.previous},${metric.change}%\n`;
        });
        csvContent += '\nDemographics\n';
        csvContent += 'Segment,Count,Percentage\n';
        data.demographics.forEach((segment: any) => {
          csvContent += `${segment.segment},${segment.count},${segment.percentage}%\n`;
        });
      } else if (report.type === 'Market') {
        csvContent = 'Crop,Sales,Volume,Avg Price\n';
        data.topCrops.forEach((crop: any) => {
          csvContent += `${crop.crop},${crop.sales},${crop.volume},${crop.avgPrice}\n`;
        });
        csvContent += '\nMarket Trends\n';
        csvContent += 'Period,Demand,Supply,Price Index\n';
        data.trends.forEach((trend: any) => {
          csvContent += `${trend.period},${trend.demand},${trend.supply},${trend.priceIndex}\n`;
        });
      } else if (report.type === 'Operations') {
        csvContent = 'Metric,Current,Target,Status\n';
        data.transport.forEach((metric: any) => {
          csvContent += `${metric.metric},${metric.current},${metric.target},${metric.status}\n`;
        });
        csvContent += '\nTop Transporters\n';
        csvContent += 'Transporter,Deliveries,Rating,Efficiency\n';
        data.performance.forEach((transporter: any) => {
          csvContent += `${transporter.transporter},${transporter.deliveries},${transporter.rating},${transporter.efficiency}%\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}_Report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

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
                <Button
                  className="flex-1"
                  onClick={() => handleDownloadPDF(report)}
                  disabled={downloading === `${report.id}-pdf`}
                >
                  {downloading === `${report.id}-pdf` ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadExcel(report)}
                  disabled={downloading === `${report.id}-excel`}
                >
                  {downloading === `${report.id}-excel` ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  CSV
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
