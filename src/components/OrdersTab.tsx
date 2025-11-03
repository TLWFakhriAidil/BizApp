import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OrdersTab = () => {
  // Order Type
  const [orderType, setOrderType] = useState("");
  const [idStaff, setIdStaff] = useState("");
  const [jenisOrder, setJenisOrder] = useState("");
  
  // Customer Details
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");
  const [channel, setChannel] = useState("");
  const [prospectType, setProspectType] = useState("");
  const [poskod, setPoskod] = useState("");
  const [daerah, setDaerah] = useState("");
  const [negeri, setNegeri] = useState("");
  const [address, setAddress] = useState("");
  
  // Order Details
  const [product1, setProduct1] = useState("");
  const [unit1, setUnit1] = useState("");
  const [product2, setProduct2] = useState("");
  const [unit2, setUnit2] = useState("");
  const [freeGift, setFreeGift] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Channel options based on platform
  const getChannelOptions = () => {
    const channelMap: { [key: string]: string[] } = {
      "Facebook": ["Website", "Lead"],
      "Tiktok": ["Live Tiktok", "Beg Kuning", "Website", "Lead"],
      "Shopee": ["Beg Oren", "Live Shopee", "Lead"],
      "Database": ["Whatsapp", "Call"]
    };
    return channelMap[platform] || [];
  };

  const handleSubmit = async () => {
    if (!customerName || !phone || !platform || !channel || !prospectType || !poskod || !daerah || !negeri || !address || !product1 || !unit1) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit orders");
        return;
      }
      
      // Insert order into database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_name: `Order-${Date.now()}`,
          customer_name: customerName,
          phone: phone,
          email: null,
          platform: platform,
          channel: channel,
          prospect_type: prospectType,
          shipping_address: `${address}, ${poskod}, ${daerah}, ${negeri}`,
          region: negeri,
          country: 'Malaysia',
          status: 'pending',
          subtotal: 0,
          total: 0,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items if order was created successfully
      if (orderData) {
        const orderItems = [];
        if (product1 && unit1) {
          orderItems.push({
            order_id: orderData.id,
            product_name: product1,
            quantity: parseInt(unit1) || 1,
            unit_price: 0, // You may want to fetch this from inventory
          });
        }
        if (product2 && unit2) {
          orderItems.push({
            order_id: orderData.id,
            product_name: product2,
            quantity: parseInt(unit2) || 1,
            unit_price: 0,
          });
        }

        if (orderItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
          
          if (itemsError) throw itemsError;
        }
      }
      
      toast.success("Order submitted successfully!");
      
      // Reset form
      setOrderType("");
      setIdStaff("");
      setJenisOrder("");
      setCustomerName("");
      setPhone("");
      setPlatform("");
      setChannel("");
      setProspectType("");
      setPoskod("");
      setDaerah("");
      setNegeri("");
      setAddress("");
      setProduct1("");
      setUnit1("");
      setProduct2("");
      setUnit2("");
      setFreeGift([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast.info("Order saved as draft");
  };

  return (
    <div className="space-y-6">
      {/* Order Type Section */}
      <Card className="shadow-md border-border">
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderType" className="required">Order</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger id="orderType">
                  <SelectValue placeholder="Pilih order siapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">SELF ORDER</SelectItem>
                  <SelectItem value="others">ORDER HOST LIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === "others" && (
              <div className="space-y-2">
                <Label htmlFor="idStaff" className="required">ID STAFF</Label>
                <Input id="idStaff" placeholder="Pilih ID Staff" value={idStaff} onChange={(e) => setIdStaff(e.target.value)} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="jenisOrder" className="required">Jenis Order</Label>
              <Select value={jenisOrder} onValueChange={setJenisOrder}>
                <SelectTrigger id="jenisOrder">
                  <SelectValue placeholder="Pilih Jenis Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biasa">Order Biasa</SelectItem>
                  <SelectItem value="promo1">Promosi 1</SelectItem>
                  <SelectItem value="promo2">Promosi 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Section */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-lg">Maklumat Pelanggan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="required">Nama Pelanggan</Label>
              <Input id="customerName" placeholder="Enter customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="required">No. Telefon</Label>
              <Input id="phone" type="tel" maxLength={12} placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="required">Jenis Platform</Label>
              <Select value={platform} onValueChange={(value) => { setPlatform(value); setChannel(""); }}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Pilih Jenis Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Tiktok">Tiktok</SelectItem>
                  <SelectItem value="Shopee">Shopee</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel" className="required">Jenis Channel</Label>
              <Select value={channel} onValueChange={setChannel} disabled={!platform}>
                <SelectTrigger id="channel">
                  <SelectValue placeholder="Pilih Jenis Channel" />
                </SelectTrigger>
                <SelectContent>
                  {getChannelOptions().map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prospectType" className="required">Jenis Prospek</Label>
              <Select value={prospectType} onValueChange={setProspectType}>
                <SelectTrigger id="prospectType">
                  <SelectValue placeholder="Pilih Jenis Prospek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NP">New Prospect</SelectItem>
                  <SelectItem value="EC">Existing Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="poskod" className="required">Poskod</Label>
              <Input id="poskod" placeholder="Enter postal code" value={poskod} onChange={(e) => setPoskod(e.target.value.replace(/[^0-9]/g, ''))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daerah" className="required">Daerah</Label>
              <Input id="daerah" placeholder="Enter district" value={daerah} onChange={(e) => setDaerah(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="negeri" className="required">Negeri</Label>
              <Input id="negeri" placeholder="Enter state" value={negeri} onChange={(e) => setNegeri(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="required">Alamat</Label>
            <Textarea id="address" rows={3} placeholder="Enter full address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Order Details Section */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-lg">Maklumat Order</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product1" className="required">Produk 1</Label>
              <Select value={product1} onValueChange={setProduct1}>
                <SelectTrigger id="product1">
                  <SelectValue placeholder="Pilih Produk 1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product1">Product 1</SelectItem>
                  <SelectItem value="product2">Product 2</SelectItem>
                  <SelectItem value="product3">Product 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={unit1} onValueChange={setUnit1}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">2 + 1f</SelectItem>
                  <SelectItem value="5">3 + 2f</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product2">Produk 2</Label>
              <Select value={product2} onValueChange={setProduct2}>
                <SelectTrigger id="product2">
                  <SelectValue placeholder="Pilih Produk 2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product1">Product 1</SelectItem>
                  <SelectItem value="product2">Product 2</SelectItem>
                  <SelectItem value="product3">Product 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={unit2} onValueChange={setUnit2}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">2 + 1f</SelectItem>
                  <SelectItem value="5">3 + 2f</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="freeGift">Freegift</Label>
              <Select>
                <SelectTrigger id="freeGift">
                  <SelectValue placeholder="Select free gifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gift1">Free Gift 1</SelectItem>
                  <SelectItem value="gift2">Free Gift 2</SelectItem>
                  <SelectItem value="gift3">Free Gift 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              className="flex-1"
            >
              SAVE DRAFT
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT ORDER"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersTab;