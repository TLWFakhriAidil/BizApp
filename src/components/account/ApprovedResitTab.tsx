import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CalendarIcon, ChevronDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ApprovedResitTab() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("all");

  // Mock data for approved receipts
  const approvedReceipts = [
    {
      id: "RCP-100",
      date: "2024-01-10",
      approvedDate: "2024-01-11",
      customerName: "Alice Williams",
      amount: 320000,
      paymentMethod: "Bank Transfer",
      orderNumber: "ORD-12340",
    },
    {
      id: "RCP-101",
      date: "2024-01-11",
      approvedDate: "2024-01-12",
      customerName: "Charlie Brown",
      amount: 185000,
      paymentMethod: "Credit Card",
      orderNumber: "ORD-12341",
    },
    {
      id: "RCP-102",
      date: "2024-01-12",
      approvedDate: "2024-01-13",
      customerName: "Diana Prince",
      amount: 450000,
      paymentMethod: "Bank Transfer",
      orderNumber: "ORD-12342",
    },
  ];

  const handleViewDetails = (receiptId: string) => {
    console.log("Viewing receipt details:", receiptId);
    // Implementation will be added when backend is ready
  };

  return (
    <div className="space-y-6">
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Approved Resit</h2>
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

                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="bg-success hover:bg-success/90">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <Card>
        <CardHeader>
          <CardTitle>Approved Receipts</CardTitle>
          <CardDescription>All receipts that have been verified and approved</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Receipt Date</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order No.</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.id}</TableCell>
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell>{receipt.approvedDate}</TableCell>
                    <TableCell>{receipt.customerName}</TableCell>
                    <TableCell>{receipt.orderNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-info/10 text-info border-info">
                        {receipt.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      RM {receipt.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(receipt.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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
