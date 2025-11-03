import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CalendarIcon, ChevronDown, TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TotalSalesTab() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const salesMetrics = [
    {
      title: "Today's Sales",
      value: "RM 2,450.00",
      icon: DollarSign,
      trend: "+12.5% from yesterday",
      color: "text-success",
    },
    {
      title: "Weekly Sales",
      value: "RM 15,280.00",
      icon: TrendingUp,
      trend: "+8.3% from last week",
      color: "text-info",
    },
    {
      title: "Monthly Sales",
      value: "RM 64,750.00",
      icon: ShoppingCart,
      trend: "+15.2% from last month",
      color: "text-primary",
    },
    {
      title: "Total Customers",
      value: "1,234",
      icon: Users,
      trend: "+23 new this month",
      color: "text-accent",
    },
  ];

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: "TXN-001",
      date: "2024-01-17 14:30",
      customerName: "John Doe",
      orderNumber: "ORD-12345",
      amount: 150000,
      paymentMethod: "Bank Transfer",
    },
    {
      id: "TXN-002",
      date: "2024-01-17 13:15",
      customerName: "Jane Smith",
      orderNumber: "ORD-12346",
      amount: 275000,
      paymentMethod: "Credit Card",
    },
    {
      id: "TXN-003",
      date: "2024-01-17 11:45",
      customerName: "Bob Johnson",
      orderNumber: "ORD-12347",
      amount: 89000,
      paymentMethod: "Cash",
    },
  ];

  return (
    <div className="space-y-6">
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Total Sales</h2>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", isFilterOpen && "rotate-180")} />
              Filter Results
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "PPP") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button className="bg-success hover:bg-success/90">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={cn("h-4 w-4", metric.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Chart</CardTitle>
          <CardDescription>Visual representation of sales trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Sales chart visualization will appear here</p>
              <p className="text-xs text-muted-foreground">Connect to data source to display trends</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order No.</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>{transaction.orderNumber}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      RM {transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
