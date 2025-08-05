import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const apiEndpoints = [
  {
    method: "GET",
    url: "/api/v1/scraped-data",
    description: "Retrieve all scraped data with pagination",
    parameters: "?limit=100&offset=0&scraperId=optional",
  },
  {
    method: "POST",
    url: "/api/v1/scrapers",
    description: "Create a new scraper configuration",
    parameters: "",
  },
  {
    method: "PUT",
    url: "/api/v1/scrapers/{id}",
    description: "Update scraper configuration",
    parameters: "",
  },
  {
    method: "DELETE",
    url: "/api/v1/scrapers/{id}",
    description: "Delete a scraper",
    parameters: "",
  },
  {
    method: "GET",
    url: "/api/v1/social-media-posts",
    description: "Get social media posts",
    parameters: "?platform=twitter&limit=100",
  },
  {
    method: "GET",
    url: "/api/v1/stats",
    description: "Get analytics and statistics",
    parameters: "",
  },
];

const codeExamples = {
  javascript: `// Fetch scraped data
const response = await fetch('/api/v1/scraped-data', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);

// Create a new scraper
const scraperConfig = {
  name: "Product Scraper",
  url: "https://example.com",
  selectors: {
    title: "h1.product-title",
    price: ".price"
  },
  delay: 2,
  maxPages: 100
};

const createResponse = await fetch('/api/v1/scrapers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(scraperConfig)
});`,
  
  python: `import requests

# Fetch scraped data
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('/api/v1/scraped-data', headers=headers)
data = response.json()
print(data)

# Create a new scraper
scraper_config = {
    "name": "Product Scraper",
    "url": "https://example.com",
    "selectors": {
        "title": "h1.product-title",
        "price": ".price"
    },
    "delay": 2,
    "maxPages": 100
}

create_response = requests.post(
    '/api/v1/scrapers',
    headers=headers,
    json=scraper_config
)`,
  
  curl: `# Fetch scraped data
curl -X GET '/api/v1/scraped-data' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'

# Create a new scraper
curl -X POST '/api/v1/scrapers' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Product Scraper",
    "url": "https://example.com",
    "selectors": {
      "title": "h1.product-title",
      "price": ".price"
    },
    "delay": 2,
    "maxPages": 100
  }'`,
};

export default function ApiIntegration() {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof codeExamples>("javascript");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const getMethodBadge = (method: string) => {
    const variants: Record<string, string> = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800", 
      PUT: "bg-orange-100 text-orange-800",
      DELETE: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={`font-mono ${variants[method] || "bg-gray-100 text-gray-800"}`}>
        {method}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {getMethodBadge(endpoint.method)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(endpoint.url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-mono text-gray-900">{endpoint.url}</p>
                  {endpoint.parameters && (
                    <p className="text-xs font-mono text-gray-600">{endpoint.parameters}</p>
                  )}
                </div>
                <p className="text-sm text-gray-600">{endpoint.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Examples</CardTitle>
              <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as keyof typeof codeExamples)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="curl">cURL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
              <pre className="text-green-400 whitespace-pre-wrap">
                <code>{codeExamples[selectedLanguage]}</code>
              </pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1,247</div>
              <div className="text-sm text-gray-600">API Calls Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">127ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            All API requests require authentication using a Bearer token. Include your API key in the Authorization header:
          </p>
          <div className="bg-gray-900 rounded-lg p-4">
            <code className="text-green-400 text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              Generate API Key
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
