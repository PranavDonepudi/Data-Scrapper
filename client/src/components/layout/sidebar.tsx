import { Link, useLocation } from "wouter";
import { Database, BarChart3, Worm, Hash, Download, Code, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Web Scraping", href: "/web-scraping", icon: Worm },
  { name: "Social Media", href: "/social-media", icon: Hash },
  { name: "Data Export", href: "/data-export", icon: Download },
  { name: "API Integration", href: "/api-integration", icon: Code },
  { name: "Scheduled Tasks", href: "/scheduled-tasks", icon: Clock },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Database className="text-white text-sm" size={16} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">DataScraper Pro</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-600 text-sm" size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
            <p className="text-xs text-gray-600">Product Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
