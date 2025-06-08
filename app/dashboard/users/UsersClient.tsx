"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User2, Shield, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { User } from "@/types/types";

type ToggleSubscription = (
  userId: string,
  currentStatus: boolean
) => Promise<void>;

export default function UsersClient({
  users,
  toggleSubscription,
}: {
  users: User[];
  toggleSubscription: ToggleSubscription;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(`Are you sure you want to delete the user "${users.find((u) => u.id === userId)?.email}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete user");
      }

      // Update local state
      window.location.reload(); // Or update state if you prefer
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center sm:items-start sm:flex-row justify-between gap-4">
        <div className="text-center sm:text-left" >
          <h1 className="comic-heading text-3xl text-black mb-1">YOUR USERS</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your user accounts</p>
        </div>
      </div>

      <Card className="comic-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[40rem]">
            <thead className="hidden sm:table-header-group">
              <tr className="bg-muted border-b border-border">
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Subscribed</th>
                <th className="p-2 text-left">Created At</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border sm:table-row block sm:flex sm:flex-col sm:gap-2 p-2 sm:p-0">
                  <td className="p-2 sm:p-2 w-full sm:w-auto">
                    <div className="sm:hidden font-medium">Email:</div>
                    {user.email}
                  </td>
                  <td className="p-2 sm:p-2 w-full sm:w-auto">
                    <div className="sm:hidden font-medium">Role:</div>
                    <Badge variant="outline" className="font-medium flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-2 w-full sm:w-auto">
                    <Badge
                      variant="secondary"
                      className="font-medium flex items-center gap-1"
                    >
                      {user.subscribed ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      {user.subscribed ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-2 w-full sm:w-auto">
                    <div className="sm:hidden font-medium">Created At:</div>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <div className="sm:hidden font-medium">Actions:</div>
                    <div className="flex flex-col sm:flex-row gap-2"></div>
                    <Button
                      variant="outline"
                      className="comic-button sm:w-auto"
                      onClick={() => handleViewDetails(user)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant={user.subscribed ? "outline" : "default"}
                      className={`comic-button ${user.subscribed
                        ? "text-yellow-600 hover:text-yellow-700"
                        : "text-green-600 hover:text-green-700"
                        }`}
                      onClick={() => toggleSubscription(user.id, user.subscribed ?? false)}
                    >
                      {user.subscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                    {/* {user.role !== "admin" && (
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {users.length === 0 && (
        <div className="text-center py-12">
          <h3 className="comic-heading text-2xl sm:text-3xl mb-2">NO USERS YET!</h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-6">No users have signed up yet.</p>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-[90%] sm:max-w-md w-full comic-panel">
            <h2 className="comic-heading text-2xl sm:text-3xl mb-4">User Details</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Subscribed:</strong> {selectedUser.subscribed ? "Yes" : "No"}
              </p>
              {selectedUser.created_at && (
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedUser.created_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-6  flex justify-end">
              <Button
                variant="outline"
                className="comic-button"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}