import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { isAdmin } from "@/libs/admin";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { isAdmin: false },
      { 
        headers: { 
          'Cache-Control': 'private, max-age=60'
        }
      }
    );
  }

  const adminStatus = isAdmin(user.email);
  
  return NextResponse.json(
    { isAdmin: adminStatus },
    { 
      headers: { 
        'Cache-Control': 'private, max-age=60'
      }
    }
  );
}
