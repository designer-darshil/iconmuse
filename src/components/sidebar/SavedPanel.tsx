import React, { useState } from "react";
import {
  BookmarkX,
  Trash2,
  Sparkles,
  Plus,
  Check,
  FolderHeart,
  Download,
} from "lucide-react";
import { ICON_CATALOG } from "../../data/iconCatalog";
import type { IconCollection, IconItem } from "../../types";
import { cn } from "../../utils/cn";

export interface SavedPanelProps {
  savedIconIds: string[];
  onToggleSave: (id: string) => void;
  onSelectIcon: (icon: IconItem) => void;
  activeColor?: string;
  collections: IconCollection[];
  onCreateCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  onToggleCollectionIcon: (collectionId: string, iconId: string) => void;
  onDownloadZip: (iconIds: string[]) => void;
}

export const SavedPanel: React.FC<SavedPanelProps> = ({
  savedIconIds,
  onToggleSave,
  onSelectIcon,
  activeColor = "#0F1116",
  collections,
  onCreateCollection,
  onDeleteCollection,
  onToggleCollectionIcon,
  onDownloadZip,
}) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    null,
  );
  const [collectionName, setCollectionName] = useState("");
  const [selectedForExport, setSelectedForExport] = useState<string[]>([]);
  const savedIcons = ICON_CATALOG.filter((icon) =>
    savedIconIds.includes(icon.id),
  );
  const activeCollection = collections.find(
    (collection) => collection.id === activeCollectionId,
  );
  const visibleIcons = activeCollection
    ? savedIcons.filter((icon) => activeCollection.iconIds.includes(icon.id))
    : savedIcons;

  const handleCreateCollection = (event: React.FormEvent) => {
    event.preventDefault();
    if (!collectionName.trim()) return;
    onCreateCollection(collectionName);
    setCollectionName("");
  };

  return (
    <div className="p-4 flex flex-col gap-4 select-none bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1116] m-0">
            Saved icons
          </h3>
          <p className="text-[11px] text-[#85858D] mt-1">
            {savedIcons.length} saved in this browser
          </p>
        </div>
        {savedIcons.length > 0 && (
          <button
            type="button"
            onClick={() => savedIconIds.forEach(onToggleSave)}
            className="text-[11px] font-medium text-[#777780] hover:text-[#D14343] transition-colors"
            title="Remove all saved icons"
          >
            Clear all
          </button>
        )}
      </div>

      <form onSubmit={handleCreateCollection} className="flex gap-2">
        <input
          value={collectionName}
          onChange={(event) => setCollectionName(event.target.value)}
          maxLength={40}
          aria-label="New collection name"
          placeholder="New collection name"
          className="min-w-0 flex-1 h-9 px-3 rounded-lg border border-[#E7E7EA] text-xs outline-none focus:border-[#7141E8]"
        />
        <button
          type="submit"
          disabled={!collectionName.trim()}
          className="h-9 px-3 flex items-center gap-1.5 rounded-lg bg-[#7141E8] text-white text-xs font-semibold hover:bg-[#6031D4] disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          Create
        </button>
      </form>

      <section className="rounded-xl border border-[#E7E7EA] bg-[#FAFAFB] p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="m-0 text-xs font-semibold text-[#0F1116]">
              Bulk download
            </h4>
            <p className="mb-0 mt-1 text-[11px] leading-relaxed text-[#777780]">
              {savedIcons.length > 0
                ? "Download all saved SVGs in one ZIP with attribution."
                : "Save icons from the catalog to download them together."}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold tabular-nums text-[#777780] ring-1 ring-[#E7E7EA]">
            {savedIcons.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onDownloadZip(savedIconIds)}
          disabled={savedIcons.length === 0}
          className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#7141E8] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#6031D4] disabled:cursor-not-allowed disabled:bg-[#E7E7EA] disabled:text-[#8E8E93]"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Download all saved
        </button>
      </section>

      {savedIcons.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              const ids = visibleIcons.map((icon) => icon.id);
              const allSelected =
                ids.length > 0 &&
                ids.every((id) => selectedForExport.includes(id));
              setSelectedForExport((current) =>
                allSelected
                  ? current.filter((id) => !ids.includes(id))
                  : [...new Set([...current, ...ids])],
              );
            }}
            className="text-[11px] font-medium text-[#7141E8] hover:underline"
          >
            {visibleIcons.length > 0 &&
            visibleIcons.every((icon) => selectedForExport.includes(icon.id))
              ? "Clear selection"
              : "Select visible"}
          </button>
          <button
            type="button"
            onClick={() =>
              onDownloadZip(
                selectedForExport.filter((id) => savedIconIds.includes(id)),
              )
            }
            disabled={
              !selectedForExport.some((id) => savedIconIds.includes(id))
            }
            className="px-3 py-1.5 rounded-lg bg-[#7141E8] text-white text-[11px] font-semibold hover:bg-[#6031D4] disabled:opacity-40"
          >
            Download ZIP (
            {selectedForExport.filter((id) => savedIconIds.includes(id)).length}
            )
          </button>
        </div>
      )}
      {selectedForExport.some((id) => savedIconIds.includes(id)) && (
        <p className="-mt-2 text-[10px] text-[#85858D]">
          ZIP includes an attribution list with source and license for each SVG.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          aria-pressed={!activeCollectionId}
          onClick={() => setActiveCollectionId(null)}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left",
            !activeCollectionId
              ? "bg-[#F3F0FC] text-[#5932C0] font-semibold"
              : "text-[#55555D] hover:bg-[#F7F7F8]",
          )}
        >
          <span className="flex items-center gap-2">
            <BookmarkX className="w-3.5 h-3.5" />
            All saved
          </span>
          <span className="tabular-nums">{savedIcons.length}</span>
        </button>
        {collections.map((collection) => (
          <div
            key={collection.id}
            data-selected={activeCollectionId === collection.id}
            className={cn(
              "flex items-center rounded-lg",
              activeCollectionId === collection.id
                ? "bg-[#F3F0FC]"
                : "hover:bg-[#F7F7F8]",
            )}
          >
            <button
              type="button"
              aria-pressed={activeCollectionId === collection.id}
              onClick={() => setActiveCollectionId(collection.id)}
              className={cn(
                "min-w-0 flex-1 flex items-center justify-between px-3 py-2 text-xs text-left",
                activeCollectionId === collection.id
                  ? "text-[#5932C0] font-semibold"
                  : "text-[#55555D]",
              )}
            >
              <span className="flex items-center gap-2 min-w-0">
                <FolderHeart className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{collection.name}</span>
              </span>
              <span className="tabular-nums ml-2">
                {
                  collection.iconIds.filter((id) => savedIconIds.includes(id))
                    .length
                }
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteCollection(collection.id);
                if (activeCollectionId === collection.id)
                  setActiveCollectionId(null);
              }}
              aria-label={`Delete ${collection.name} collection`}
              className="p-2 mr-1 rounded-md text-[#9999A0] hover:text-[#D14343]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#ECECF0]" />

      {visibleIcons.length === 0 ? (
        <div className="py-7 flex flex-col items-center text-center">
          <Sparkles className="w-5 h-5 text-[#7141E8] mb-2" />
          <p className="text-xs font-medium text-[#45454C] m-0">
            {activeCollection
              ? "This collection is empty"
              : "No saved icons yet"}
          </p>
          <p className="text-[11px] text-[#85858D] mt-1 mb-0">
            {activeCollection
              ? "Add saved icons below."
              : "Bookmark an icon to keep it here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleIcons.map((icon) => {
            const IconComp = icon.component;
            const isInCollection =
              activeCollection?.iconIds.includes(icon.id) ?? false;
            return (
              <div
                key={icon.id}
                className="flex items-center gap-2 p-2 rounded-xl border border-[#ECECF0] hover:border-[#D8D8DC]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedForExport((current) =>
                      current.includes(icon.id)
                        ? current.filter((id) => id !== icon.id)
                        : [...current, icon.id],
                    )
                  }
                  aria-label={
                    selectedForExport.includes(icon.id)
                      ? `Unselect ${icon.name} for ZIP export`
                      : `Select ${icon.name} for ZIP export`
                  }
                  className={cn(
                    "w-5 h-5 rounded-md border flex items-center justify-center shrink-0",
                    selectedForExport.includes(icon.id)
                      ? "bg-[#7141E8] border-[#7141E8] text-white"
                      : "border-[#D8D8DC] text-transparent",
                  )}
                >
                  {selectedForExport.includes(icon.id) && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectIcon(icon)}
                  className="flex-1 min-w-0 flex items-center gap-2.5 text-left"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#F7F7F8] flex items-center justify-center shrink-0">
                    <IconComp
                      className="w-5 h-5"
                      style={{ color: activeColor }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-[#17171B] truncate">
                      {icon.name}
                    </span>
                    <span className="block text-[10px] text-[#85858D] mt-0.5 truncate">
                      {icon.source} · {icon.style}
                    </span>
                  </span>
                </button>
                {activeCollection && (
                  <button
                    type="button"
                    onClick={() =>
                      onToggleCollectionIcon(activeCollection.id, icon.id)
                    }
                    aria-label={
                      isInCollection
                        ? `Remove ${icon.name} from ${activeCollection.name}`
                        : `Add ${icon.name} to ${activeCollection.name}`
                    }
                    aria-pressed={isInCollection}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isInCollection
                        ? "text-[#7141E8] bg-[#F3F0FC]"
                        : "text-[#777780] hover:bg-[#F7F7F8]",
                    )}
                  >
                    {isInCollection ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onToggleSave(icon.id)}
                  aria-label={`Remove ${icon.name} from saved icons`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9999A0] hover:text-[#D14343] hover:bg-[#FFF5F5] shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeCollection &&
        savedIcons.some(
          (icon) => !activeCollection.iconIds.includes(icon.id),
        ) && (
          <div className="flex flex-col gap-2 pt-2 border-t border-[#ECECF0]">
            <h4 className="text-[11px] font-semibold text-[#55555D] m-0">
              Add saved icons
            </h4>
            {savedIcons
              .filter((icon) => !activeCollection.iconIds.includes(icon.id))
              .map((icon) => {
                const IconComp = icon.component;
                return (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() =>
                      onToggleCollectionIcon(activeCollection.id, icon.id)
                    }
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F7F7F8] text-left"
                  >
                    <IconComp
                      className="w-4 h-4 shrink-0"
                      style={{ color: activeColor }}
                    />
                    <span className="text-xs text-[#44444B] truncate flex-1">
                      {icon.name}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-[#7141E8]" />
                  </button>
                );
              })}
          </div>
        )}
    </div>
  );
};
