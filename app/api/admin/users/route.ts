import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { handleApiError } from "@/lib/api/errors";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid token", code: "UNAUTHORIZED" } },
        { status: 401 },
      );
    }

    // Check if user is admin (you might want to add an is_admin field to your users table)
    const { data: profile } = await supabase
      .from("users")
      .select("email")
      .eq("id", user.id)
      .single();

    // Simple admin check - replace with your admin logic
    const adminEmails = ["admin@thinktapflow.com"];
    if (!profile || !adminEmails.includes(profile.email)) {
      return NextResponse.json(
        { success: false, error: { message: "Access denied", code: "FORBIDDEN" } },
        { status: 403 },
      );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, email, full_name, subscription_tier, usage_count, usage_limit, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: { message: "Failed to fetch users", code: "FETCH_ERROR" } },
        { status: 500 },
      );
    }

    const { count } = await supabase.from("users").select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
