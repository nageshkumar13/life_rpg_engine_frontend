import { useState } from "react";
import type { TaskChunk } from "@/types/models";
import { ChunkRow } from "@/components/ChunkRow";

interface ChunkListProps {
  chunks: TaskChunk[];
  onAdd: (input: { title: string; estimated_minutes: number }) => void;
  onEdit: (chunkId: string, input: { title: string; estimated_minutes: number }) => void;
  onToggle: (chunkId: string, nextValue: boolean) => void;
  onDelete: (chunkId: string) => void;
}

export function ChunkList({ chunks, onAdd, onEdit, onToggle, onDelete }: ChunkListProps) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("25");

  const submit = () => {
    if (!title.trim()) {
      return;
    }

    onAdd({ title: title.trim(), estimated_minutes: Number(minutes) || 0 });
    setTitle("");
    setMinutes("25");
  };

  return (
    <div className="space-y-4">
      {chunks.map((chunk) => (
        <ChunkRow
          key={chunk.id}
          chunk={chunk}
          onToggle={() => onToggle(chunk.id, chunk.status !== "DONE")}
          onEdit={() => {
            const nextTitle = window.prompt("Edit chunk title", chunk.title);
            if (!nextTitle?.trim()) {
              return;
            }
            const nextMinutes = window.prompt("Minutes", String(chunk.estimated_minutes));
            onEdit(chunk.id, {
              title: nextTitle.trim(),
              estimated_minutes: Number(nextMinutes) || chunk.estimated_minutes,
            });
          }}
          onDelete={() => onDelete(chunk.id)}
        />
      ))}

      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-sm font-semibold text-text-primary">Add chunk</p>
        <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Chunk title"
            className="rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none placeholder:text-text-muted focus:border-primary"
          />
          <input
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            type="number"
            placeholder="25"
            className="rounded-2xl border border-white/10 bg-bg px-4 py-3 text-sm outline-none placeholder:text-text-muted focus:border-primary"
          />
          <button
            type="button"
            onClick={submit}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Add chunk
          </button>
        </div>
      </div>
    </div>
  );
}
