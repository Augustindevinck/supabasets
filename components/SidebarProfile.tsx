"use client";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/libs/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarProfile() {
  const [user, setUser] = useState<User>(null);
  const { open } = useSidebar();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 group/sidebar py-2">
      {user?.user_metadata?.avatar_url ? (
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
          <img
            src={user?.user_metadata?.avatar_url}
            alt={"Profile picture"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            width={32}
            height={32}
          />
        </div>
      ) : (
        <span className="w-8 h-8 bg-base-100 flex justify-center items-center rounded-full shrink-0 capitalize text-sm font-bold">
          {user?.email?.charAt(0)}
        </span>
      )}
      {open && (
        <span className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre">
          {user?.user_metadata?.name || user?.email?.split("@")[0] || "Account"}
        </span>
      )}
    </div>
  );
}
