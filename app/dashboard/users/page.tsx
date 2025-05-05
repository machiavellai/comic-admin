import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for users
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Reader",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    role: "Reader",
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "Inactive",
    role: "Reader",
    lastActive: "1 week ago",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    status: "Active",
    role: "Premium",
    lastActive: "3 hours ago",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "Active",
    role: "Premium",
    lastActive: "Just now",
  },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage your app users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${user.name.charAt(0)}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Premium" ? "outline" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>Overview of user activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>Total Users</div>
                <div className="font-bold">2,543</div>
              </div>
              <div className="flex justify-between">
                <div>Active Users</div>
                <div className="font-bold">2,104</div>
              </div>
              <div className="flex justify-between">
                <div>Premium Users</div>
                <div className="font-bold">432</div>
              </div>
              <div className="flex justify-between">
                <div>New Users (This Month)</div>
                <div className="font-bold">128</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>User activity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>Avg. Session Duration</div>
                <div className="font-bold">12m 24s</div>
              </div>
              <div className="flex justify-between">
                <div>Avg. Comics Read</div>
                <div className="font-bold">3.7 per week</div>
              </div>
              <div className="flex justify-between">
                <div>Retention Rate</div>
                <div className="font-bold">76%</div>
              </div>
              <div className="flex justify-between">
                <div>Conversion Rate</div>
                <div className="font-bold">12.4%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Devices</CardTitle>
            <CardDescription>Most used platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>iOS</div>
                <div className="font-bold">64%</div>
              </div>
              <div className="flex justify-between">
                <div>Android</div>
                <div className="font-bold">32%</div>
              </div>
              <div className="flex justify-between">
                <div>Web</div>
                <div className="font-bold">4%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
