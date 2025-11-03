import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export function DashboardTab() {
  const metrics = [
    {
      title: "Total Sales",
      value: "RM 45,231",
      change: "+20.1%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Orders",
      value: "234",
      change: "+12.5%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Prospects",
      value: "89",
      change: "+8.3%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+2.4%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sales Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your sales performance and key metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="shadow-md border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{metric.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-muted/50">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[
              { action: "New order submitted", time: "2 minutes ago", type: "order" },
              { action: "Prospect qualified", time: "15 minutes ago", type: "prospect" },
              { action: "Payment received", time: "1 hour ago", type: "payment" },
              { action: "Return processed", time: "3 hours ago", type: "return" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {activity.type}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="shadow-md border-border">
        <CardHeader className="bg-muted/50">
          <CardTitle>Sales Performance</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Chart visualization will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
