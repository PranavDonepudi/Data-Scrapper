import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTrendsChart } from "@/components/charts/data-trends-chart";
import { Database, Worm, Code, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsData = stats || {
    totalRecords: 0,
    activeScrapers: 0,
    apiCalls: 0,
    successRate: 0,
  };

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Scraped Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData.totalRecords.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="text-primary" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-green-600 text-sm font-medium">+12.5%</span>
              <span className="text-gray-600 text-sm ml-2">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Scrapers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData.activeScrapers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Worm className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-green-600 text-sm font-medium">+2</span>
              <span className="text-gray-600 text-sm ml-2">new this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">API Calls Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData.apiCalls.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Code className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-orange-600 text-sm font-medium">85%</span>
              <span className="text-gray-600 text-sm ml-2">of daily limit</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData.successRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-green-600 text-sm font-medium">+2.1%</span>
              <span className="text-gray-600 text-sm ml-2">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scraping Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scraping Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">E-commerce Product Data</p>
                  <p className="text-xs text-gray-600">Scraped 1,247 products from amazon.com</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>

              <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Social Media Mentions</p>
                  <p className="text-xs text-gray-600">Collected 89 mentions from Twitter</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>

              <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">News Articles</p>
                  <p className="text-xs text-gray-600">Scraped 45 articles from techcrunch.com</p>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Data Collection Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTrendsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
