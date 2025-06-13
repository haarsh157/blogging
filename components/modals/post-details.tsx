"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { CommentSection } from "../comments";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    imageUrl?: string;
  };
}

interface PostDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
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
  };
}

export function PostDetailsModal({ isOpen, onClose, post }: PostDetailsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen && post.id) {
      fetchComments();
    }
  }, [isOpen, post.id]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/comment`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentContent,
        }),
      });

      if (response.ok) {
        setCommentContent("");
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={clsx(
          "relative p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-auto rounded-lg",
          "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="space-y-4">
          {/* Author and Date */}
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.imageUrl} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold">{post.title}</h2>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto max-h-96 object-cover rounded-md"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>

          {/* Stats */}
          <div className="flex space-x-4 text-sm text-gray-500 pt-4 border-t">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>

          {/* Comments Section */}
        <CommentSection postId={post.id} />
          
        </div>

      </div>
    </Modal>
  );
}