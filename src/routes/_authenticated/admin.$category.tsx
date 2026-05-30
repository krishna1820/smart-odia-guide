import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import {
  listAllContent,
  createContent,
  updateContent,
  deleteContent,
  type Category,
} from "@/lib/content.functions";

const VALID: Category[] = ["scheme", "tourism", "agriculture", "service"];
const LABEL: Record<Category, string> = {
  scheme: "Schemes",
  tourism: "Tourism",
  agriculture: "Agriculture",
  service: "Services",
};

export const Route = createFileRoute("/_authenticated/admin/$category")({
  parseParams: ({ category }) => {
    if (!VALID.includes(category as Category)) throw notFound();
    return { category: category as Category };
  },
  component: AdminCategoryPage,
});

type Row = {
  id: string;
  category: Category;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  tag: string | null;
  sort_order: number;
};

function AdminCategoryPage() {
  const { category } = Route.useParams();
  const fetchAll = useServerFn(listAllContent);
  const create = useServerFn(createContent);
  const update = useServerFn(updateContent);
  const remove = useServerFn(deleteContent);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reload = () => {
    setLoading(true);
    fetchAll({ data: { category } })
      .then((d) => setRows(d as Row[]))
      .finally(() => setLoading(false));
  };

  useEffect(reload, [category, fetchAll]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await remove({ data: { id } });
    reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">{category}</div>
          <h1 className="mt-2 font-display text-4xl text-foreground">{LABEL[category]}</h1>
          <p className="text-sm text-muted-foreground">{rows.length} items</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New item
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No items yet. Click "New item" to add one.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="w-16 px-5 py-3">#</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Subtitle</th>
                <th className="px-5 py-3">Tag</th>
                <th className="w-32 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 text-muted-foreground">{r.sort_order}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{r.title}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.subtitle}</td>
                  <td className="px-5 py-4">
                    {r.tag && <span className="rounded-full bg-accent/30 px-2.5 py-0.5 text-[10px] uppercase tracking-widest">{r.tag}</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => { setEditing(r); setShowForm(true); }} className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <ItemForm
          category={category}
          initial={editing}
          onClose={() => setShowForm(false)}
          onSubmit={async (values) => {
            if (editing) await update({ data: { id: editing.id, ...values } });
            else await create({ data: values });
            setShowForm(false);
            reload();
          }}
        />
      )}
    </div>
  );
}

function ItemForm({
  category, initial, onClose, onSubmit,
}: {
  category: Category;
  initial: Row | null;
  onClose: () => void;
  onSubmit: (v: {
    category: Category; title: string; subtitle: string | null;
    description: string | null; image_url: string | null; tag: string | null; sort_order: number;
  }) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await onSubmit({
        category,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        tag: tag.trim() || null,
        sort_order: Number(sortOrder) || 0,
      });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-elegant)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{initial ? "Edit item" : "New item"}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <Field label="Title" required><input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} maxLength={200} /></Field>
          <Field label="Subtitle"><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputCls} maxLength={200} /></Field>
          <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} maxLength={2000} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tag"><input value={tag} onChange={(e) => setTag(e.target.value)} className={inputCls} maxLength={60} /></Field>
            <Field label="Sort order"><input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} min={0} max={9999} /></Field>
          </div>
          <Field label="Image URL"><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputCls} placeholder="https://…" maxLength={500} /></Field>
          {err && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
            <button type="submit" disabled={busy} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50">
              {busy ? "Saving…" : initial ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}{required && " *"}</span>
      {children}
    </label>
  );
}
