"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { CreatePostModal } from "@/components/modals/create-post";
import { PostDetailsModal } from "@/components/modals/post-details";
import { toast } from "sonner";
import { format } from "date-fns";
import { CommentModal } from "@/components/modals/comment-modal";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: {
    name: string;
    imageUrl?: string;
  };
  likes: number;
  comments: number;
}

export default function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = [...posts]
  .sort((a, b) => b.likes - a.likes)
  .filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    toast.success("Post created successfully!");
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Like failed");

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch {
      toast.error("Failed to like the post");
    }
  };

  const handleCommentAdded = () => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === commentingPostId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Explore Posts</h1>
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage src={post.author.imageUrl} />
                    <AvatarFallback>
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(post.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                </div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                  {post.content}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="hover:underline cursor-pointer"
                    >
                      {post.likes} likes
                    </button>
                    <button
                      onClick={() => setCommentingPostId(post.id)}
                      className="hover:underline cursor-pointer"
                    >
                      {post.comments} comments
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewPost(post)}
                >
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Floating Create Post Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setIsCreatingPost(true)}
          className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create Post</span>
        </Button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatingPost}
        onClose={() => setIsCreatingPost(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Post Details Modal */}
      {selectedPost && (
        <PostDetailsModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
        />
      )}
      {commentingPostId && (
        <CommentModal
          isOpen={!!commentingPostId}
          onClose={() => setCommentingPostId(null)}
          postId={commentingPostId}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
