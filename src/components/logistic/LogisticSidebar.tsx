import { User } from "@supabase/supabase-js";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, TruckIcon, RotateCcw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LogisticSidebarProps {
  user: User | null;
}

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/logistic" },
  { title: "Inventory", icon: Package, path: "/logistic/inventory" },
  { title: "Proses Order", icon: TruckIcon, path: "/logistic/proses-order" },
  { title: "Proses Return", icon: RotateCcw, path: "/logistic/proses-return" },
];

export function LogisticSidebar({ user }: LogisticSidebarProps) {
  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-sidebar-primary" />
          <span className="font-bold text-lg text-sidebar-foreground">ERP PVS</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Logistic Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === "/logistic"}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user?.email || "User"}
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Staff ID: {user?.id.substring(0, 8)}
            </span>
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
