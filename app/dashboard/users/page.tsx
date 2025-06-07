"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/types";
import UsersClient from "./UsersClient";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuthAndFetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // Fetch current user
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, email, role, subscribed")
          .eq("id", session.user.id)
          .single();
        console.log("Current user data:", userData); // Debug log
        if (userError || !userData || userData.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        if (mounted) {
          setCurrentUser(userData);
        }

        // Fetch all users with explicit array handling
        const { data: usersData, error: fetchError } = await supabase
          .from("users")
          .select("*"); // Use * to ensure all columns, or specify needed ones
        console.log("Raw all users data:", usersData); // Debug log
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        if (mounted) {
          // Ensure usersData is an array, even if single row
          setUsers(Array.isArray(usersData) ? usersData : usersData ? [usersData] : []);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load users");
          setLoading(false);
        }
      }
    };

    checkAuthAndFetchData();

    return () => {
      mounted = false;
    };
  }, [router]);

  const toggleSubscription = async (userId: string, currentStatus: boolean) => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Unauthorized");
      return;
    }

    try {
      const { error } = await supabase
        .from("users")
        .update({ subscribed: !currentStatus })
        .eq("id", userId);
      if (error) throw error;

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, subscribed: !currentStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating subscription:", err);
      alert("Failed to update subscription");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  return <UsersClient users={users} toggleSubscription={toggleSubscription} />;
}