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

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("usage_count, usage_limit, subscription_tier")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { success: false, error: { message: "Profile not found", code: "USER_NOT_FOUND" } },
        { status: 404 },
      );
    }

    // Get usage analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from("generations")
      .select("created_at, tokens_used")
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return NextResponse.json({
      success: true,
      data: {
        current_usage: profile.usage_count,
        usage_limit: profile.usage_limit,
        subscription_tier: profile.subscription_tier,
        remaining: profile.usage_limit - profile.usage_count,
        percentage: (profile.usage_count / profile.usage_limit) * 100,
        analytics: analytics || [],
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
