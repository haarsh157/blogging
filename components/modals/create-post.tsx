"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

export function CreatePostModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    categoryName: "",
    tagNames: "",
    published: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Process tags - split by comma, trim whitespace, and filter out empty strings
      const tags = formData.tagNames
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          imageUrl: formData.imageUrl || undefined,
          categoryName: formData.categoryName,
          tagNames: tags,
          published: formData.published,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      toast.success("Post created successfully!");
      setIsOpen(false);
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
        categoryName: "",
        tagNames: "",
        published: false,
      });
      router.refresh();
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error(error.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Create Post</span>
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="relative p-6">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 rounded-sm"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>

          <h2 className="text-2xl font-bold mb-6">Create New Post</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Featured Image URL (optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryName">Category *</Label>
              <Input
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagNames">Tags (comma separated)</Label>
              <Input
                id="tagNames"
                name="tagNames"
                value={formData.tagNames}
                onChange={handleChange}
                placeholder="e.g. tech, react, javascript"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}