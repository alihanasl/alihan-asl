"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";

type SortableItem = {
  id: string;
  label: string;
  meta?: string;
};

export function SortableList({
  items,
  onReorder,
  onSelect,
}: {
  items: SortableItem[];
  onReorder: (ids: string[]) => void;
  onSelect?: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);

  function move(fromId: string, toId: string) {
    if (fromId === toId) return;
    const ids = items.map((item) => item.id);
    const from = ids.indexOf(fromId);
    const to = ids.indexOf(toId);
    if (from < 0 || to < 0) return;
    ids.splice(from, 1);
    ids.splice(to, 0, fromId);
    onReorder(ids);
  }

  return (
    <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {items.map((item) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => setDragId(item.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (dragId) move(dragId, item.id);
            setDragId(null);
          }}
          className="flex items-center gap-3 px-3 py-3"
        >
          <span className="cursor-grab text-zinc-400" aria-hidden>
            <GripVertical className="h-4 w-4" />
          </span>
          {onSelect ? (
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => onSelect(item.id)}
            >
              <span className="block truncate text-sm font-medium text-zinc-900">
                {item.label}
              </span>
              {item.meta ? (
                <span className="mt-0.5 block truncate text-xs text-zinc-500">
                  {item.meta}
                </span>
              ) : null}
            </button>
          ) : (
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-900">
                {item.label}
              </span>
              {item.meta ? (
                <span className="mt-0.5 block truncate text-xs text-zinc-500">
                  {item.meta}
                </span>
              ) : null}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
