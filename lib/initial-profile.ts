import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) return redirect("/");

  const profile = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.user.create({
    data: {
      clerkUserId: user.id,
      username: "",
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
