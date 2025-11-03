import { useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrdersTab from "./OrdersTab";
import PaymentsTab from "./PaymentsTab";

const SalesHub = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SALES HUB</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-primary/80 px-4 py-2 rounded-full">
                <div className="bg-primary-foreground rounded-full p-2">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">Sales Team</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary/80"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 h-12">
            <TabsTrigger 
              value="orders" 
              className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              ORDERS
            </TabsTrigger>
            <TabsTrigger 
              value="payments"
              className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              PAYMENTS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <PaymentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesHub;