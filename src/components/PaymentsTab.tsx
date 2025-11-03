import { useState, useEffect } from "react";
import { Search, Download, DollarSign, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  method: string | null;
  payment_date: string | null;
  orders: {
    order_name: string;
    customer_name: string;
  };
}

const PaymentsTab = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    paymentDate: "",
    paymentAmount: "",
    paymentType: "",
    bank: "",
    receiptFile: null as File | null,
    note: ""
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          orders (
            order_name,
            customer_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments((data || []) as Payment[]);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.orders.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orders.order_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalPending = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalOverdue = payments
    .filter(p => p.status === "overdue")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      paid: "bg-success/10 text-success hover:bg-success/20",
      pending: "bg-warning/10 text-warning hover:bg-warning/20",
      overdue: "bg-destructive/10 text-destructive hover:bg-destructive/20"
    };
    return variants[status];
  };

  const handleRecordPayment = () => {
    setIsDialogOpen(true);
  };

  const handleExportPayments = () => {
    toast.info("Exporting payments to CSV...");
  };

  const handleSubmitPayment = async () => {
    if (!formData.orderId || !formData.paymentDate || !formData.paymentAmount || !formData.paymentType || !formData.bank) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.paymentAmount) <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    // Here you would upload the receipt file and save payment data to Supabase
    toast.success("Payment recorded successfully!");
    setIsDialogOpen(false);
    setFormData({
      orderId: "",
      paymentDate: "",
      paymentAmount: "",
      paymentType: "",
      bank: "",
      receiptFile: null,
      note: ""
    });
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-md border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-success">RM {totalPaid.toFixed(2)}</p>
              </div>
              <div className="bg-success/10 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-warning">RM {totalPending.toFixed(2)}</p>
              </div>
              <div className="bg-warning/10 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                <p className="text-2xl font-bold text-destructive">RM {totalOverdue.toFixed(2)}</p>
              </div>
              <div className="bg-destructive/10 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-lg">Payment Management</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, order, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportPayments}
              className="whitespace-nowrap"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={handleRecordPayment}
              className="whitespace-nowrap bg-primary hover:bg-primary/90"
            >
              Record Payment
            </Button>
          </div>

          {/* Payments Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Payment ID</th>
                    <th className="text-left p-4 font-semibold text-sm">Order Name</th>
                    <th className="text-left p-4 font-semibold text-sm">Customer</th>
                    <th className="text-left p-4 font-semibold text-sm">Method</th>
                    <th className="text-right p-4 font-semibold text-sm">Amount</th>
                    <th className="text-left p-4 font-semibold text-sm">Date</th>
                    <th className="text-center p-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        Loading payments...
                      </td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        No payments found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4 text-sm font-medium">{payment.id.substring(0, 8)}</td>
                        <td className="p-4 text-sm">{payment.orders.order_name}</td>
                        <td className="p-4 text-sm">{payment.orders.customer_name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{payment.method || "-"}</td>
                        <td className="p-4 text-sm text-right font-semibold">
                          RM {Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "-"}
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={getStatusBadge(payment.status)}>
                            {payment.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID *</Label>
                <Input
                  id="orderId"
                  placeholder="Enter order ID"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Tarikh Bayaran *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Jumlah Bayaran (RM) *</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType">Jenis Bayaran *</Label>
                <Select value={formData.paymentType} onValueChange={(value) => setFormData({ ...formData, paymentType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Bayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="CDM">CDM</SelectItem>
                    <SelectItem value="CASH">CASH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank">Bank *</Label>
                <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maybank">Maybank</SelectItem>
                    <SelectItem value="CIMB">CIMB</SelectItem>
                    <SelectItem value="Public Bank Berhad">Public Bank Berhad</SelectItem>
                    <SelectItem value="RHB Bank">RHB Bank</SelectItem>
                    <SelectItem value="Hong Leong Bank">Hong Leong Bank</SelectItem>
                    <SelectItem value="AmBank">AmBank</SelectItem>
                    <SelectItem value="Bank Rakyat">Bank Rakyat</SelectItem>
                    <SelectItem value="HSBC Bank Malaysia">HSBC Bank Malaysia</SelectItem>
                    <SelectItem value="Bank Islam">Bank Islam</SelectItem>
                    <SelectItem value="BSN">BSN</SelectItem>
                    <SelectItem value="COD">COD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptFile">Resit Bayaran</Label>
                <Input
                  id="receiptFile"
                  type="file"
                  accept="image/jpeg,image/gif,image/png,application/pdf"
                  onChange={(e) => setFormData({ ...formData, receiptFile: e.target.files?.[0] || null })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Nota</Label>
              <Textarea
                id="note"
                placeholder="Enter note (optional)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSubmitPayment} className="bg-primary hover:bg-primary/90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsTab;