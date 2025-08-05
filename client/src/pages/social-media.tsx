import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Hash, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SocialMediaPost } from "@shared/schema";

export default function SocialMedia() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [newPost, setNewPost] = useState({
    platform: "twitter",
    content: "",
    author: "",
    url: "",
    hashtags: [] as string[],
    mentions: [] as string[],
  });

  const { data: posts, isLoading } = useQuery<SocialMediaPost[]>({
    queryKey: ["/api/social-media-posts", selectedPlatform !== "all" ? selectedPlatform : undefined],
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/social-media-posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media-posts"] });
      toast({ title: "Social media post added successfully" });
      setNewPost({
        platform: "twitter",
        content: "",
        author: "",
        url: "",
        hashtags: [],
        mentions: [],
      });
    },
    onError: () => {
      toast({ title: "Failed to add social media post", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...newPost,
      postId: `${Date.now()}`, // Generate a simple ID
      postedAt: new Date(),
      engagement: { likes: 0, shares: 0, comments: 0 },
    };

    createPostMutation.mutate(postData);
  };

  const extractHashtags = (content: string): string[] => {
    const hashtags = content.match(/#[a-zA-Z0-9_]+/g);
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  };

  const extractMentions = (content: string): string[] => {
    const mentions = content.match(/@[a-zA-Z0-9_]+/g);
    return mentions ? mentions.map(mention => mention.slice(1)) : [];
  };

  const handleContentChange = (content: string) => {
    setNewPost({
      ...newPost,
      content,
      hashtags: extractHashtags(content),
      mentions: extractMentions(content),
    });
  };

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      twitter: "bg-blue-100 text-blue-800",
      facebook: "bg-blue-100 text-blue-800",
      instagram: "bg-pink-100 text-pink-800",
      linkedin: "bg-blue-100 text-blue-800",
    };
    
    return (
      <Badge className={colors[platform] || "bg-gray-100 text-gray-800"}>
        {platform}
      </Badge>
    );
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
      {/* Social Media Monitoring Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newPost.platform}
                  onValueChange={(value) => setNewPost({ ...newPost, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  placeholder="@username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter social media post content..."
                rows={4}
                required
              />
              {(newPost.hashtags.length > 0 || newPost.mentions.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPost.hashtags.map((hashtag) => (
                    <Badge key={hashtag} variant="outline">
                      <Hash className="w-3 h-3 mr-1" />
                      {hashtag}
                    </Badge>
                  ))}
                  {newPost.mentions.map((mention) => (
                    <Badge key={mention} variant="outline">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Post URL (optional)</Label>
              <Input
                id="url"
                type="url"
                value={newPost.url}
                onChange={(e) => setNewPost({ ...newPost, url: e.target.value })}
                placeholder="https://twitter.com/username/status/123456789"
              />
            </div>

            <Button type="submit" disabled={createPostMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createPostMutation.isPending ? "Adding..." : "Add Post"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Social Media Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Collected Social Media Posts</CardTitle>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading social media posts...</div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getPlatformBadge(post.platform)}
                      <span className="font-medium">{post.author}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(post.collectedAt)}
                      </span>
                    </div>
                    {post.url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-gray-900">{post.content}</p>
                  
                  {(post.hashtags as string[])?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(post.hashtags as string[]).map((hashtag) => (
                        <Badge key={hashtag} variant="outline" className="text-blue-600">
                          <Hash className="w-3 h-3 mr-1" />
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {post.engagement && (
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>👍 {(post.engagement as any).likes || 0}</span>
                      <span>🔄 {(post.engagement as any).shares || 0}</span>
                      <span>💬 {(post.engagement as any).comments || 0}</span>
                    </div>
                  )}
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No social media posts found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
