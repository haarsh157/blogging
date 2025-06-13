import { NextResponse } from 'next/server';
import {db} from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Get user details with posts
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            likes: true,
            comments: true,
          },
        },
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format the response
    const response = {
      ...user,
      posts: user.posts.map(post => ({
        ...post,
        likes: post.likes.length,
        comments: post.comments.length,
      })),
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}