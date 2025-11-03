import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Package, DollarSign, Users, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReturnItem {
  id: string;
  order_id: string | null;
  return_date: string;
  return_reason: string;
  return_status: string;
  refund_amount: number | null;
  notes: string | null;
  created_at: string;
}

export function ReturnTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isStockReturnDialogOpen, setIsStockReturnDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnItem | null>(null);
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cancelFormData, setCancelFormData] = useState({
    reason: "",
    note: "",
    image: null as File | null
  });

  const [stockReturnFormData, setStockReturnFormData] = useState({
    label: "Return"
  });

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to view returns");
        return;
      }

      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReturns(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch returns");
    } finally {
      setIsLoading(false);
    }
  };

  const totalReturns = returns.length;
  const totalRM = returns.reduce((sum, r) => sum + (Number(r.refund_amount) || 0), 0);

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch = 
      ret.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ret.return_reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ret.return_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-warning/10 text-warning",
      approved: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
      processing: "bg-info/10 text-info"
    };
    return <Badge className={variants[status] || "bg-muted"}>{status.toUpperCase()}</Badge>;
  };

  const handleOpenCancelDialog = (returnItem: ReturnItem) => {
    setSelectedReturn(returnItem);
    setIsCancelDialogOpen(true);
  };

  const handleOpenStockReturnDialog = (returnItem: ReturnItem) => {
    setSelectedReturn(returnItem);
    setStockReturnFormData({ label: "Return" });
    setIsStockReturnDialogOpen(true);
  };

  const handleSubmitCancel = async () => {
    if (!cancelFormData.reason || !selectedReturn) {
      toast.error("Please select a cancellation reason");
      return;
    }

    try {
      const { error } = await supabase
        .from('returns')
        .update({
          return_status: 'rejected',
          notes: `${cancelFormData.reason}${cancelFormData.note ? ': ' + cancelFormData.note : ''}`
        })
        .eq('id', selectedReturn.id);

      if (error) throw error;

      toast.success("Return cancelled successfully");
      setIsCancelDialogOpen(false);
      setCancelFormData({ reason: "", note: "", image: null });
      fetchReturns();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel return");
    }
  };

  const handleSubmitStockReturn = async () => {
    if (!stockReturnFormData.label || !selectedReturn) {
      toast.error("Please select a label");
      return;
    }

    try {
      const statusMap: Record<string, string> = {
        "Return": "approved",
        "Repost": "processing"
      };

      const { error } = await supabase
        .from('returns')
        .update({
          return_status: statusMap[stockReturnFormData.label] || 'processing'
        })
        .eq('id', selectedReturn.id);

      if (error) throw error;

      toast.success(`Stock return updated to ${stockReturnFormData.label}`);
      setIsStockReturnDialogOpen(false);
      fetchReturns();
    } catch (error: any) {
      toast.error(error.message || "Failed to update return");
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Returns</p>
                <p className="text-2xl font-bold text-info">{totalReturns}</p>
              </div>
              <div className="bg-info/10 p-3 rounded-full">
                <RotateCcw className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Refund Amount</p>
                <p className="text-2xl font-bold text-destructive">RM {totalRM.toFixed(2)}</p>
              </div>
              <div className="bg-destructive/10 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Return Management</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Customer, Phone, Postage"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">No</TableHead>
                  <TableHead className="text-xs">Return ID</TableHead>
                  <TableHead className="text-xs">Return Date</TableHead>
                  <TableHead className="text-xs">Return Reason</TableHead>
                  <TableHead className="text-xs">Refund Amount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Notes</TableHead>
                  <TableHead className="text-xs text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Loading returns...
                    </TableCell>
                  </TableRow>
                ) : filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No returns found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((ret, index) => (
                    <TableRow key={ret.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs">{index + 1}</TableCell>
                      <TableCell className="text-xs font-mono">{ret.id.substring(0, 8)}</TableCell>
                      <TableCell className="text-xs">{new Date(ret.return_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">{ret.return_reason}</TableCell>
                      <TableCell className="text-xs">RM {(Number(ret.refund_amount) || 0).toFixed(2)}</TableCell>
                      <TableCell className="text-xs">{getStatusBadge(ret.return_status)}</TableCell>
                      <TableCell className="text-xs">{ret.notes || '-'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenStockReturnDialog(ret)}
                            className="h-7 text-xs"
                          >
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenCancelDialog(ret)}
                            className="h-7 text-xs text-destructive hover:text-destructive"
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Sebab Cancel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Sebab Cancel *</Label>
              <Select value={cancelFormData.reason} onValueChange={(value) => setCancelFormData({ ...cancelFormData, reason: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Sebab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baru tanya dah keyin">Baru tanya dah keyin</SelectItem>
                  <SelectItem value="Penyakit">Penyakit</SelectItem>
                  <SelectItem value="Customer tiada di rumah">Customer tiada di rumah</SelectItem>
                  <SelectItem value="Area tak cover COD">Area tak cover COD</SelectItem>
                  <SelectItem value="Duplicate order">Duplicate order</SelectItem>
                  <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancelNote">Nota</Label>
              <Textarea
                id="cancelNote"
                placeholder="Enter notes"
                value={cancelFormData.note}
                onChange={(e) => setCancelFormData({ ...cancelFormData, note: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancelImage">Upload Gambar</Label>
              <Input
                id="cancelImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCancelFormData({ ...cancelFormData, image: e.target.files?.[0] || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Close</Button>
            <Button onClick={handleSubmitCancel} className="bg-primary hover:bg-primary/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Return Dialog */}
      <Dialog open={isStockReturnDialogOpen} onOpenChange={setIsStockReturnDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Stock Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="returnId">Return ID</Label>
              <Input
                id="returnId"
                value={selectedReturn?.id.substring(0, 8) || ""}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnReason">Return Reason</Label>
              <Input
                id="returnReason"
                value={selectedReturn?.return_reason || ""}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <Input
                id="refundAmount"
                value={`RM ${(Number(selectedReturn?.refund_amount) || 0).toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnLabel">Update Status *</Label>
              <Select value={stockReturnFormData.label} onValueChange={(value) => setStockReturnFormData({ label: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Return">Approve Return</SelectItem>
                  <SelectItem value="Repost">Mark as Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockReturnDialogOpen(false)}>Close</Button>
            <Button onClick={handleSubmitStockReturn} className="bg-primary hover:bg-primary/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
