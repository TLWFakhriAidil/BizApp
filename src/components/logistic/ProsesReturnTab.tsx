import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";

export function ProsesReturnTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const returns = [
    {
      id: "RET-001",
      orderId: "ORD-001",
      customerName: "Ahmad Ali",
      reason: "Defective product",
      date: "2025-11-02",
      status: "pending",
    },
    {
      id: "RET-002",
      orderId: "ORD-005",
      customerName: "Siti Fatimah",
      reason: "Wrong item received",
      date: "2025-11-01",
      status: "approved",
    },
    {
      id: "RET-003",
      orderId: "ORD-008",
      customerName: "Lee Wei Ming",
      reason: "Changed mind",
      date: "2025-10-31",
      status: "rejected",
    },
    {
      id: "RET-004",
      orderId: "ORD-012",
      customerName: "Kumar Raj",
      reason: "Product damaged in transit",
      date: "2025-11-02",
      status: "pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ReactNode }> = {
      pending: { variant: "outline", label: "Pending", icon: <Clock className="h-3 w-3 mr-1" /> },
      approved: { variant: "default", label: "Approved", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      rejected: { variant: "destructive", label: "Rejected", icon: <XCircle className="h-3 w-3 mr-1" /> },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Process Returns</CardTitle>
          <CardDescription>Manage customer return requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search returns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">{returnItem.orderId}</TableCell>
                    <TableCell>{returnItem.customerName}</TableCell>
                    <TableCell>{returnItem.reason}</TableCell>
                    <TableCell>{returnItem.date}</TableCell>
                    <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {returnItem.status === "pending" && (
                        <>
                          <Button variant="default" size="sm" className="bg-success hover:bg-success/90">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {returnItem.status !== "pending" && (
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      )}
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
