// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, username, bio, imageUrl } = await req.json();

    // First check if user exists
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
 
    // Update the profile in your database
    const updatedProfile = await db.user.update({
      where: { clerkUserId: userId },
      data: { 
        username,
        bio: bio || null,
        imageUrl: imageUrl || null
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}