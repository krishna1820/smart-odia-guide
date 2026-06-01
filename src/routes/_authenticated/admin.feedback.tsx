import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, Mail } from "lucide-react";
import { listFeedback, updateFeedbackStatus, deleteFeedback } from "@/lib/portal.functions";

export const Route = createFileRoute("/_authenticated/admin/feedback")({
  component: FeedbackAdmin,
});

type Row = {
  id: string; name: string; email: string; subject: string; message: string;
  category: string; status: string; created_at: string;
};

const STATUSES = ["new", "in_progress", "resolved", "archived"] as const;

function FeedbackAdmin() {
  const list = useServerFn(listFeedback);
  const setStatus = useServerFn(updateFeedbackStatus);
  const remove = useServerFn(deleteFeedback);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Row | null>(null);

  const reload = () => {
    setLoading(true);
    list().then((d) => setRows(d as Row[])).finally(() => setLoading(false));
  };
  useEffect(reload, [list]);

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (q && !(`${r.name} ${r.email} ${r.subject} ${r.message}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const onChange = async (id: string, status: typeof STATUSES[number]) => {
    await setStatus({ data: { id, status } });
    reload();
  };
  const onDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await remove({ data: { id } });
    setOpen(null);
    reload();
  };

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Citizen feedback</h1>
      <p className="mt-2 text-sm text-muted-foreground">{rows.length} total messages</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages…"
          className="w-72 rounded-full border border-border bg-background px-4 py-2 text-sm"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-full border border-border bg-background px-4 py-2 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No messages.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Received</th>
                <th className="w-12 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/30" onClick={() => setOpen(r)}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{r.subject}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] uppercase tracking-widest">{r.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={r.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onChange(r.id, e.target.value as typeof STATUSES[number])}
                      className="rounded-full border border-border bg-background px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onDelete(r.id)} className="rounded-full p-2 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-elegant)]" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs uppercase tracking-widest text-primary">{open.category}</div>
            <h2 className="mt-1 font-display text-2xl">{open.subject}</h2>
            <div className="mt-1 text-sm text-muted-foreground">
              {open.name} · <a href={`mailto:${open.email}`} className="underline">{open.email}</a>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm text-foreground">{open.message}</p>
            <div className="mt-6 flex justify-between text-xs text-muted-foreground">
              <span>{new Date(open.created_at).toLocaleString()}</span>
              <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`} className="inline-flex items-center gap-1 text-primary">
                <Mail className="h-3 w-3" /> Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
