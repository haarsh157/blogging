import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const {
      title,
      content,
      imageUrl,
      categoryName,
      tagNames,
      published,
    } = (await req.json()) as {
      title: string;
      content: string;
      imageUrl?: string;
      categoryName: string;
      tagNames: string[];
      published: boolean;
    };

    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user from DB
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Process tags - ensure they're unique and create if they don't exist
    const uniqueTagNames = [...new Set(tagNames)]; // Remove duplicates
    const tags = await Promise.all(
      uniqueTagNames.map(async (tagName) => {
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        // Try to find existing tag first
        const existingTag = await db.tag.findUnique({
          where: { slug: tagSlug },
        });

        if (existingTag) {
          return existingTag;
        }

        // Create new tag if it doesn't exist
        return await db.tag.create({
          data: {
            name: tagName,
            slug: tagSlug,
          },
        });
      })
    );

    // Create the post and connect tags
    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        imageUrl: imageUrl || null,
        published,
        authorId: user.id,
        category: categoryName,
        tags: {
          create: tags.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: true,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("[POST_CREATION_ERROR]", error);
    return new NextResponse(error?.message || "Internal Server Error", {
      status: 500,
    });
  }
}


export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the posts for the frontend
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || undefined,
      createdAt: post.createdAt.toISOString(),
      author: {
        name: post.author.username,
        imageUrl: post.author.imageUrl || undefined,
      },
      likes: post.likes.length,
      comments: post.comments.length,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("[POSTS_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}