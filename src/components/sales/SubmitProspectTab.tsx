import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function SubmitProspectTab() {
  const [prospectName, setProspectName] = useState("");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");
  const [objective, setObjective] = useState("");
  const [niche, setNiche] = useState("");
  const [statusCheck, setStatusCheck] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prospectName || !phone) {
      toast.error("Please fill in required fields (Name and Phone)");
      return;
    }

    if (!platform || !objective || !niche || !statusCheck) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit prospects");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('prospects')
        .insert({
          prospect_name: prospectName,
          phone: phone,
          platform: platform,
          objective: objective,
          niche: niche,
          status_check: statusCheck,
          date: date,
          user_id: user.id,
        });

      if (error) throw error;

      toast.success("Prospect submitted successfully!");
      
      // Reset form
      setProspectName("");
      setPhone("");
      setPlatform("");
      setObjective("");
      setNiche("");
      setStatusCheck("");
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit prospect");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-md border-border">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl">Tambah Potential Prospek</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prospectName">NAMA PROSPEK *</Label>
              <Input
                id="prospectName"
                placeholder="Enter prospect name"
                value={prospectName}
                onChange={(e) => setProspectName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">NO. TELEFON *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">JENIS PLATFORM</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Pilih Jenis Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Tiktok">Tiktok</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">JENIS OBJEKTIF</Label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger id="objective">
                    <SelectValue placeholder="Pilih Jenis Objektif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Messenger Bot">Messenger Bot</SelectItem>
                    <SelectItem value="Whatsapp Bot">Whatsapp Bot</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Lead Gen">Lead Gen</SelectItem>
                    <SelectItem value="Trafik">Trafik</SelectItem>
                    <SelectItem value="Tiktok Shop">Tiktok Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">NICHE</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger id="niche">
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusCheck">STATUS CHECK</Label>
              <Select value={statusCheck} onValueChange={setStatusCheck}>
                <SelectTrigger id="statusCheck">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Invalid">Invalid</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="Tidak Angkat">Tidak Angkat</SelectItem>
                  <SelectItem value="Tidak Closed">Tidak Closed</SelectItem>
                  <SelectItem value="Tidak Proses">Tidak Proses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">TARIKH</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setProspectName("");
                  setPhone("");
                  setPlatform("");
                  setObjective("");
                  setNiche("");
                  setStatusCheck("");
                  setDate(new Date().toISOString().split('T')[0]);
                }}
                className="flex-1"
              >
                CLEAR FORM
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT PROSPEK"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
