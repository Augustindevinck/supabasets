import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { isAdmin } from "@/libs/admin";
import { createModuleLogger } from "@/lib/logger";

const adminLogger = createModuleLogger("Admin-Users");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();
    const { data: { users }, error } = await adminClient.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: profiles } = await adminClient
      .from("profiles")
      .select("id, customer_id, price_id");

    const formattedUsers = users.map((u) => {
      const profile = profiles?.find((p) => p.id === u.id);
      return {
        id: u.id,
        email: u.email,
        name: u.user_metadata?.name || u.email?.split("@")[0] || "N/A",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
        provider: u.app_metadata?.provider || "email",
        isSubscribed: !!(profile?.customer_id && profile?.price_id),
      };
    });

    const subscribedCount = formattedUsers.filter((u) => u.isSubscribed).length;
    const stats = {
      total: formattedUsers.length,
      subscribed: subscribedCount,
      nonSubscribed: formattedUsers.length - subscribedCount,
      conversionRate: formattedUsers.length > 0
        ? ((subscribedCount / formattedUsers.length) * 100).toFixed(1)
        : "0",
    };

    adminLogger.info("Users fetched successfully", { count: formattedUsers.length });
    return NextResponse.json({ users: formattedUsers, stats });
  } catch (error) {
    adminLogger.error("Error fetching users", error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    ({ userId } = await request.json());

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (userId === user.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    adminLogger.info("User deleted successfully", { userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    adminLogger.error("Error deleting user", error as Error, { userId });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
