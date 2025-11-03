import { User } from "@supabase/supabase-js";
import { LayoutDashboard, FileText, UserPlus, CreditCard, PackageX, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/sales/dashboard", icon: LayoutDashboard },
  { title: "Submit Order", url: "/sales/submit-order", icon: FileText },
  { title: "Submit Prospect", url: "/sales/submit-prospect", icon: UserPlus },
  { title: "Payment", url: "/sales/payment", icon: CreditCard },
  { title: "Return", url: "/sales/return", icon: PackageX },
];

export function SalesSidebar({ user }: { user: User | null }) {
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

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar className="w-64 bg-sidebar border-r" collapsible="none">
      <SidebarContent className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-sidebar-foreground mb-3">Sales Navigation</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="text-sm">{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email || "Sales User"}</p>
            <p className="text-xs text-sidebar-foreground/70">Sales Team</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          size="sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
