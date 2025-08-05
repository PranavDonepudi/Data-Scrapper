import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Clock, Trash2, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Export } from "@shared/schema";

export default function DataExport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [exportForm, setExportForm] = useState({
    filename: "",
    format: "csv",
    sourceType: "scraped_data",
    sourceId: "",
    dateFrom: "",
    dateTo: "",
  });

  const { data: exports, isLoading } = useQuery<Export[]>({
    queryKey: ["/api/exports"],
  });

  const createExportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/exports", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exports"] });
      toast({ title: "Export generation started" });
      setExportForm({
        filename: "",
        format: "csv",
        sourceType: "scraped_data",
        sourceId: "",
        dateFrom: "",
        dateTo: "",
      });
    },
    onError: () => {
      toast({ title: "Failed to start export", variant: "destructive" });
    },
  });

  const deleteExportMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/exports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exports"] });
      toast({ title: "Export deleted successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExportMutation.mutate(exportForm);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      generating: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "csv":
        return "📄";
      case "json":
        return "📋";
      case "xlsx":
        return "📊";
      case "xml":
        return "📝";
      default:
        return "📄";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={exportForm.filename}
                  onChange={(e) => setExportForm({ ...exportForm, filename: e.target.value })}
                  placeholder="my_export_data"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Export Format</Label>
                <Select
                  value={exportForm.format}
                  onValueChange={(value) => setExportForm({ ...exportForm, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceType">Data Source</Label>
              <Select
                value={exportForm.sourceType}
                onValueChange={(value) => setExportForm({ ...exportForm, sourceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scraped_data">All Scraped Data</SelectItem>
                  <SelectItem value="social_media">Social Media Posts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={exportForm.dateFrom}
                    onChange={(e) => setExportForm({ ...exportForm, dateFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={exportForm.dateTo}
                    onChange={(e) => setExportForm({ ...exportForm, dateTo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={createExportMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                {createExportMutation.isPending ? "Generating..." : "Generate Export"}
              </Button>
              <Button type="button" variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Export
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading exports...</div>
          ) : (
            <div className="space-y-3">
              {exports?.map((exportItem) => (
                <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getFormatIcon(exportItem.format)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {exportItem.filename}
                      </p>
                      <p className="text-xs text-gray-600">
                        {exportItem.recordCount} records • Generated {formatDate(exportItem.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(exportItem.status)}
                    <div className="flex space-x-2">
                      {exportItem.status === "completed" && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteExportMutation.mutate(exportItem.id)}
                        disabled={deleteExportMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No exports found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
