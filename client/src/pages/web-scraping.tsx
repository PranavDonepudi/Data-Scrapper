import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Save, Trash2, Edit, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Scraper } from "@shared/schema";

export default function WebScraping() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectors, setSelectors] = useState<Array<{ field: string; selector: string }>>([
    { field: "", selector: "" }
  ]);
  const [scraperForm, setScraperForm] = useState({
    name: "",
    url: "",
    method: "puppeteer",
    delay: 2,
    maxPages: 100,
    concurrentRequests: 1,
  });

  const { data: scrapers, isLoading } = useQuery<Scraper[]>({
    queryKey: ["/api/scrapers"],
  });

  const createScraperMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/scrapers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scrapers"] });
      toast({ title: "Scraper created successfully" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create scraper", variant: "destructive" });
    },
  });

  const testScraperMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/scrapers/test", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Test successful", 
        description: `Extracted ${Object.keys(data.data || {}).length} fields` 
      });
    },
    onError: () => {
      toast({ title: "Test failed", variant: "destructive" });
    },
  });

  const runScraperMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/scrapers/${id}/run`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scrapers"] });
      toast({ title: "Scraper started successfully" });
    },
  });

  const deleteScraperMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/scrapers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scrapers"] });
      toast({ title: "Scraper deleted successfully" });
    },
  });

  const addSelector = () => {
    setSelectors([...selectors, { field: "", selector: "" }]);
  };

  const removeSelector = (index: number) => {
    setSelectors(selectors.filter((_, i) => i !== index));
  };

  const updateSelector = (index: number, field: string, value: string) => {
    const updated = [...selectors];
    updated[index] = { ...updated[index], [field]: value };
    setSelectors(updated);
  };

  const resetForm = () => {
    setScraperForm({
      name: "",
      url: "",
      method: "puppeteer",
      delay: 2,
      maxPages: 100,
      concurrentRequests: 1,
    });
    setSelectors([{ field: "", selector: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSelectors = selectors.filter(s => s.field && s.selector);
    const selectorsObject = validSelectors.reduce((acc, selector) => {
      acc[selector.field] = selector.selector;
      return acc;
    }, {} as Record<string, string>);

    createScraperMutation.mutate({
      ...scraperForm,
      selectors: selectorsObject,
    });
  };

  const handleTest = () => {
    const validSelectors = selectors.filter(s => s.field && s.selector);
    const selectorsObject = validSelectors.reduce((acc, selector) => {
      acc[selector.field] = selector.selector;
      return acc;
    }, {} as Record<string, string>);

    testScraperMutation.mutate({
      ...scraperForm,
      selectors: selectorsObject,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      running: "secondary",
      completed: "outline",
      failed: "destructive",
      inactive: "outline",
    };
    
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Scraper Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Web Scraping Configuration</CardTitle>
            <Button onClick={resetForm} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Scraper
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Scraper Name</Label>
                <Input
                  id="name"
                  value={scraperForm.name}
                  onChange={(e) => setScraperForm({ ...scraperForm, name: e.target.value })}
                  placeholder="E-commerce Products"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Target URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={scraperForm.url}
                  onChange={(e) => setScraperForm({ ...scraperForm, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Scraping Method</Label>
              <Select
                value={scraperForm.method}
                onValueChange={(value) => setScraperForm({ ...scraperForm, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="puppeteer">Puppeteer</SelectItem>
                  <SelectItem value="cheerio">Cheerio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CSS Selectors */}
            <div className="space-y-4">
              <Label>CSS Selectors</Label>
              {selectors.map((selector, index) => (
                <div key={index} className="flex space-x-3">
                  <Input
                    placeholder="Field name"
                    value={selector.field}
                    onChange={(e) => updateSelector(index, "field", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="CSS selector"
                    value={selector.selector}
                    onChange={(e) => updateSelector(index, "selector", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSelector(index)}
                    disabled={selectors.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addSelector}>
                <Plus className="w-4 h-4 mr-2" />
                Add Selector
              </Button>
            </div>

            {/* Rate Limiting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delay">Delay (seconds)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="1"
                  value={scraperForm.delay}
                  onChange={(e) => setScraperForm({ ...scraperForm, delay: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPages">Max Pages</Label>
                <Input
                  id="maxPages"
                  type="number"
                  min="1"
                  value={scraperForm.maxPages}
                  onChange={(e) => setScraperForm({ ...scraperForm, maxPages: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concurrentRequests">Concurrent Requests</Label>
                <Input
                  id="concurrentRequests"
                  type="number"
                  min="1"
                  max="5"
                  value={scraperForm.concurrentRequests}
                  onChange={(e) => setScraperForm({ ...scraperForm, concurrentRequests: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTest}
                disabled={testScraperMutation.isPending || !scraperForm.url}
              >
                <Play className="w-4 h-4 mr-2" />
                {testScraperMutation.isPending ? "Testing..." : "Test Scraper"}
              </Button>
              <Button
                type="submit"
                disabled={createScraperMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {createScraperMutation.isPending ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Scrapers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Scrapers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading scrapers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrapers?.map((scraper) => (
                  <TableRow key={scraper.id}>
                    <TableCell className="font-medium">{scraper.name}</TableCell>
                    <TableCell>{new URL(scraper.url).hostname}</TableCell>
                    <TableCell>{getStatusBadge(scraper.status)}</TableCell>
                    <TableCell>
                      {scraper.lastRun 
                        ? new Date(scraper.lastRun).toLocaleString()
                        : "Never"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runScraperMutation.mutate(scraper.id)}
                          disabled={runScraperMutation.isPending}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteScraperMutation.mutate(scraper.id)}
                          disabled={deleteScraperMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!scrapers?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No scrapers configured yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
