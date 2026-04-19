"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = search ? `?search=${search}` : "";
    setLoading(true);
    api.get(`/api/admin/clients${q}`)
      .then(r => setClients(r.data.clients))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Client Management"
        subtitle={`${clients.length} registered clients`}
      />

      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">

          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading clients...
            </div>
          ) : clients.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">
              No clients found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* Header */}
                <thead className="bg-muted/50 border-b">
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Company</th>
                    <th className="text-left px-4 py-3 font-medium">Requests</th>
                    <th className="text-left px-4 py-3 font-medium">Joined</th>
                    <th className="text-right px-4 py-3 font-medium"></th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {clients.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b last:border-none hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {c.user_id?.name}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {c.user_id?.email}
                      </td>

                      <td className="px-4 py-3">
                        {c.company_name}
                      </td>

                      <td className="px-4 py-3">
                        {c.request_count ?? 0}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/clients/${c._id}`}
                          className="text-primary text-xs font-medium hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}