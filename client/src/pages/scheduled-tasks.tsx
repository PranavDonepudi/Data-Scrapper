import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pause, Play, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Schedule, Scraper } from "@shared/schema";

export default function ScheduledTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    scraperId: "",
    frequency: "daily",
    cronExpression: "",
    nextRun: "",
  });

  const { data: schedules, isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: scrapers } = useQuery<Scraper[]>({
    queryKey: ["/api/scrapers"],
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/schedules", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({ title: "Schedule created successfully" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create schedule", variant: "destructive" });
    },
  });

  const pauseScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/schedules/${id}/pause`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({ title: "Schedule paused" });
    },
  });

  const resumeScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/schedules/${id}/resume`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({ title: "Schedule resumed" });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({ title: "Schedule deleted successfully" });
    },
  });

  const resetForm = () => {
    setScheduleForm({
      name: "",
      scraperId: "",
      frequency: "daily",
      cronExpression: "",
      nextRun: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduleData = {
      ...scheduleForm,
      nextRun: scheduleForm.nextRun ? new Date(scheduleForm.nextRun) : undefined,
      isActive: true,
    };

    createScheduleMutation.mutate(scheduleData);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Paused"}
      </Badge>
    );
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFrequencyDescription = (frequency: string, cronExpression?: string) => {
    if (cronExpression) return `Custom: ${cronExpression}`;
    
    const descriptions: Record<string, string> = {
      hourly: "Every hour",
      daily: "Daily at 9:00 AM",
      weekly: "Weekly (Mondays at 9:00 AM)",
      monthly: "Monthly (1st day at 9:00 AM)",
    };
    
    return descriptions[frequency] || frequency;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Schedule Creation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scheduled Tasks</CardTitle>
            <Button onClick={resetForm} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  value={scheduleForm.name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                  placeholder="Daily Product Sync"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scraper">Scraper</Label>
                <Select
                  value={scheduleForm.scraperId}
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, scraperId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scraper" />
                  </SelectTrigger>
                  <SelectContent>
                    {scrapers?.map((scraper) => (
                      <SelectItem key={scraper.id} value={scraper.id}>
                        {scraper.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={scheduleForm.frequency}
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom Cron</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {scheduleForm.frequency === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="cronExpression">Cron Expression</Label>
                <Input
                  id="cronExpression"
                  value={scheduleForm.cronExpression}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, cronExpression: e.target.value })}
                  placeholder="0 9 * * 1 (Every Monday at 9 AM)"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nextRun">Next Run (optional)</Label>
              <Input
                id="nextRun"
                type="datetime-local"
                value={scheduleForm.nextRun}
                onChange={(e) => setScheduleForm({ ...scheduleForm, nextRun: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={createScheduleMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createScheduleMutation.isPending ? "Creating..." : "Create Schedule"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {schedulesLoading ? (
            <div className="text-center py-8">Loading schedules...</div>
          ) : (
            <div className="space-y-4">
              {schedules?.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${schedule.isActive ? "bg-green-500" : "bg-gray-400"}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{schedule.name}</p>
                        <p className="text-xs text-gray-600">
                          {getFrequencyDescription(schedule.frequency, schedule.cronExpression || undefined)} • Next: {formatDate(schedule.nextRun)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(schedule.isActive || false)}
                      <div className="flex space-x-2">
                        {schedule.isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pauseScheduleMutation.mutate(schedule.id)}
                            disabled={pauseScheduleMutation.isPending}
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resumeScheduleMutation.mutate(schedule.id)}
                            disabled={resumeScheduleMutation.isPending}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Resume
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                          disabled={deleteScheduleMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No scheduled tasks found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
