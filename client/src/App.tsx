import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import WebScraping from "@/pages/web-scraping";
import SocialMedia from "@/pages/social-media";
import DataExport from "@/pages/data-export";
import ApiIntegration from "@/pages/api-integration";
import ScheduledTasks from "@/pages/scheduled-tasks";
import NotFound from "@/pages/not-found";
import { useLocation } from "wouter";

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview of your data collection activities" },
  "/web-scraping": { title: "Web Scraping", subtitle: "Configure and manage web scrapers" },
  "/social-media": { title: "Social Media", subtitle: "Monitor social media mentions and posts" },
  "/data-export": { title: "Data Export", subtitle: "Export your collected data in various formats" },
  "/api-integration": { title: "API Integration", subtitle: "Integrate with your technical systems" },
  "/scheduled-tasks": { title: "Scheduled Tasks", subtitle: "Automate your data collection workflows" },
};

function Router() {
  const [location] = useLocation();
  const currentPageInfo = pageInfo[location] || { title: "Page Not Found", subtitle: "The requested page could not be found" };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header title={currentPageInfo.title} subtitle={currentPageInfo.subtitle} />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/web-scraping" component={WebScraping} />
          <Route path="/social-media" component={SocialMedia} />
          <Route path="/data-export" component={DataExport} />
          <Route path="/api-integration" component={ApiIntegration} />
          <Route path="/scheduled-tasks" component={ScheduledTasks} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
