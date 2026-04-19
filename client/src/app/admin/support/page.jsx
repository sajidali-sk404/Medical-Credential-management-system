"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  const fetchTickets = () => {
    setLoading(true);
    const q =
      filter === "open"
        ? "?resolved=false"
        : filter === "resolved"
        ? "?resolved=true"
        : "";

    api.get(`/api/admin/support${q}`)
      .then((r) => setTickets(r.data.tickets))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const handleResolve = async (id) => {
    setResolving(id);
    try {
      await api.patch(`/api/admin/support/${id}/resolve`);
      fetchTickets();
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Support Tickets"
        subtitle="Client support requests"
      />

      {/* Filters */}
      <div className="flex gap-2">
        {[["open", "Open"], ["resolved", "Resolved"], ["", "All"]].map(
          ([val, label]) => (
            <Button
              key={val}
              size="sm"
              variant={filter === val ? "default" : "outline"}
              onClick={() => setFilter(val)}
            >
              {label}
            </Button>
          )
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No tickets found.
          </div>
        ) : (
          tickets.map((t) => (
            <Card key={t._id}>
              <CardContent className="p-5 space-y-3">

                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold">
                      {t.subject}
                    </h3>

                    <Badge
                      label={t.is_resolved ? "Resolved" : "Open"}
                      variant={t.is_resolved ? "success" : "warning"}
                    />
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Client Info */}
                <p className="text-xs text-muted-foreground">
                  {t.client_id?.user_id?.name} · {t.client_id?.company_name}
                </p>

                {/* Message */}
                <p className="text-sm text-muted-foreground">
                  {t.message}
                </p>

                {/* Action */}
                {!t.is_resolved && (
                  <div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleResolve(t._id)}
                      disabled={resolving === t._id}
                    >
                      {resolving === t._id
                        ? "Resolving..."
                        : "Mark resolved"}
                    </Button>
                  </div>
                )}

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}