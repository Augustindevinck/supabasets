import { NextResponse, NextRequest } from "next/server";
import { createModuleLogger } from "@/lib/logger";
// import { createClient } from "@/libs/supabase/server";

const leadLogger = createModuleLogger("Lead-API");

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req: NextRequest) {
  const body = await req.json();
  const timer = leadLogger.startTimer("Lead capture");

  leadLogger.debug("Lead capture request received", {
    email: body.email ? "provided" : "missing",
  });

  if (!body.email) {
    leadLogger.warn("Lead capture failed - email missing");
    timer();
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Here you can add your own logic
    // For instance, sending a welcome email (use the the sendEmail helper function from /libs/resend)
    // For instance, saving the lead in the database (uncomment the code below)

    // const supabase = createClient();
    // await supabase.from("leads").insert({ email: body.email });

    const duration = timer();
    leadLogger.info("Lead captured successfully", {
      duration: `${duration.toFixed(2)}ms`,
    });

    return NextResponse.json({});
  } catch (e) {
    timer();
    leadLogger.error("Lead capture failed", e as Error, {
      email: body.email,
    });
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
