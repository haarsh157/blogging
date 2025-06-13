import { initialProfile } from "@/lib/initial-profile";
import { auth } from "@clerk/nextjs/server";
import { UsernameModal } from "@/components/modals/initial-modal";
import DashboardContent from "@/components/dashboard/dashboard-content";

export default async function Dashboard() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const profile = await initialProfile();

  if (!profile?.username) {
    return <UsernameModal userId={userId} />;
  }

  return <DashboardContent />;
}