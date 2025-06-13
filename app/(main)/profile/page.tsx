"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  likes: number;
  comments: number;
}

interface UserProfile {
  id: string;
  clerkUserId: string;
  username: string;
  email: string;
  bio?: string;
  imageUrl?: string;
  posts: Post[];
  followersCount: number;
  followingCount: number;
  createdAt: Date;
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetchProfile();
    }
  }, [isLoaded, clerkUser]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${clerkUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile({
          ...data,
          posts: data.posts.map((post: any) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          })),
          createdAt: new Date(data.createdAt),
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="text-center sm:text-left space-y-2 w-full">
                <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-64 mx-auto sm:mx-0 mt-2" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Your Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.imageUrl || clerkUser.imageUrl} />
              <AvatarFallback>
                {clerkUser.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">
                {clerkUser.fullName || "Anonymous"}
              </h1>
              <p className="text-gray-600">@{profile?.username}</p>
              <p className="mt-2 text-gray-700">{profile?.bio}</p>

              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <p className="font-bold">{profile?.posts.length || 0}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profile?.followersCount || 0}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{profile?.followingCount || 0}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Joined{" "}
                {profile?.createdAt
                  ? format(profile.createdAt, "MMMM yyyy")
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <h2 className="text-xl font-bold mb-4">Your Posts</h2>
        {profile?.posts && profile.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(post.createdAt, "MMMM d, yyyy")}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{post.content}</p>
                </CardContent>
                <div className="px-6 pb-4">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't created any posts yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/posts/create">Create your first post</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Floating Create Post Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          asChild
          className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform"
        >
          <Link href="/posts/create">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create Post</span>
          </Link>
        </Button>
      </div>

      {/* Fixed Logout Button in Bottom-Left */}
      <div className="fixed bottom-8 left-8">
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <SignOutButton />
        </Button>
      </div>
    </div>
  );
}
