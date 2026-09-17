"use client";

import React, { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  extension?: string;
  /** Git status letter shown at the end of the row, e.g. "M" (modified) or "U" (untracked). */
  gitStatus?: "M" | "U";
  /** Per-node override for initial expanded state (falls back to the tree's defaultOpen). */
  defaultOpen?: boolean;
  /** Dim this row (e.g. build output, dependency folders) to de-emphasize it. */
  muted?: boolean;
}

interface FileTreeProps {
  data: FileNode[];
  className?: string;
  defaultOpen?: boolean;
  initialActive?: string;
  onSelectFile?: (node: FileNode, fullPath: string) => void;
}

/* ---------- Material Icon Theme folder color map ---------- */
const FOLDER_COLORS: Record<string, string> = {
  components: "#42a5f5",
  animations: "#8bc34a",
  effects: "#8bc34a",
  sections: "#8bc34a",
  ui: "#8bc34a",
  constants: "#ffa726",
  hooks: "#9575cd",
  lib: "#ec407a",
  styles: "#26c6da",
};
const DEFAULT_FOLDER_COLOR = "#90a4ae";

export function getFolderColor(name: string): string {
  return FOLDER_COLORS[name.toLowerCase()] ?? DEFAULT_FOLDER_COLOR;
}

/* ---------- Custom Material Icon Renderer ---------- */
const CustomIcon = memo(({ name, ext, isFolder, open }: { name: string; ext?: string; isFolder: boolean; open: boolean }) => {
  if (isFolder) {
    const folderColor = getFolderColor(name);

    return (
      <svg width="15" height="13" viewBox="0 0 16 14" fill="none" className="shrink-0 transition-transform duration-200">
        <path
          d={open
            ? "M1.5 1C0.67 1 0 1.67 0 2.5V11.5C0 12.33 0.67 13 1.5 13H13.5C14.33 13 15 12.33 15 11.5L16 5H3.5L2.5 3H1.5Z"
            : "M1.5 1C0.67 1 0 1.67 0 2.5V11.5C0 12.33 0.67 13 1.5 13H14.5C15.33 13 16 12.33 16 11.5V4.5C16 3.67 15.33 3 14.5 3H8L6.5 1H1.5Z"}
          fill={folderColor}
          opacity={open ? 1 : 0.9}
        />
      </svg>
    );
  }

  // File extension detection
  const actualExt = ext || (name.includes(".") ? name.split(".").pop()?.toLowerCase() : "");
  const lowerName = name.toLowerCase();

  if (lowerName === ".gitignore") {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <path
          d="M12 2 2 8v8l10 6 10-6V8L12 2Z"
          fill="#f14e32"
        />
        <circle cx="12" cy="12" r="3" fill="#1a1a1a" />
      </svg>
    );
  }

  if (lowerName === "package.json" || lowerName === "package-lock.json") {
    // npm hexagon
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <rect x="2" y="6" width="20" height="12" rx="1.5" fill="#1f6f43" />
        <path d="M5 8.5h14v7H14v-5H9.5v5H5v-7Z" fill="#5fc07a" />
      </svg>
    );
  }

  if (lowerName === "pnpm-lock.yaml" || lowerName === "pnpm-workspace.yaml" || actualExt === "yaml" || actualExt === "yml") {
    // pnpm grid-of-dots mark
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        {[3, 10, 17].map((x) =>
          [3, 10, 17].map((y) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="4.5" height="4.5" rx="0.5" fill={x === 10 && y === 10 ? "#f9ad00" : "#e2a33d"} />
          ))
        )}
      </svg>
    );
  }

  if (lowerName === "eslint.config.mjs" || lowerName.startsWith("eslint.config")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <path
          d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
          fill="#4b32c3"
        />
        <path d="M8 9.5 12 7l4 2.5v5L12 17l-4-2.5v-5Z" fill="#fff" opacity="0.9" />
      </svg>
    );
  }

  if (lowerName === "postcss.config.mjs" || lowerName.startsWith("postcss.config")) {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <circle cx="12" cy="12" r="9.5" fill="#dd3a0a" />
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="1.6" fill="#fff" />
      </svg>
    );
  }

  if (lowerName === "next.config.ts" || lowerName === "next.config.js" || lowerName === "next.config.mjs") {
    return (
      <div className="w-3.5 h-3.5 rounded-full bg-black text-white flex items-center justify-center text-[9px] leading-none shrink-0 font-bold" style={{ fontFamily: "serif" }}>
        N
      </div>
    );
  }

  if (lowerName.endsWith(".d.ts")) {
    return (
      <div className="w-3.5 h-3.5 rounded-[3px] bg-[#0d3d2e] text-[#3fb87f] font-bold flex items-center justify-center text-[8px] leading-none shrink-0 font-mono tracking-tighter">
        TS
      </div>
    );
  }

  if (actualExt === "tsx" || actualExt === "jsx") {
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <circle cx="12" cy="12" r="2" fill="#38bdf8" />
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        </g>
      </svg>
    );
  }

  if (actualExt === "ts" || actualExt === "js") {
    return (
      <div className="w-3.5 h-3.5 rounded-[3px] bg-[#3178c6] text-white font-bold flex items-center justify-center text-[8px] leading-none shrink-0 font-mono tracking-tighter">
        TS
      </div>
    );
  }

  if (actualExt === "css") {
    // Stylesheet badge (green, matches vscode-icons plain-CSS glyph)
    return (
      <div className="w-3.5 h-3.5 rounded-[3px] bg-[#1a3d1f] text-[#4dbb5f] font-bold flex items-center justify-center text-[9px] leading-none shrink-0 font-mono">
        5
      </div>
    );
  }

  if (actualExt === "json") {
    return (
      <div className="w-3.5 h-3.5 text-[#f59e0b] font-bold flex items-center justify-center text-[10px] leading-none shrink-0 font-mono">
        {"{}"}
      </div>
    );
  }

  if (actualExt === "md") {
    // Markdown badge (rounded square, "M↓" mark)
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <rect x="1.5" y="4" width="21" height="16" rx="2.2" fill="#519aba" />
        <path
          d="M5 15.5v-7h1.8l2.2 2.9 2.2-2.9H13v7h-1.8v-4.3l-2.2 2.9-2.2-2.9v4.3H5Zm12.7 0-3-3.4h1.9V8.5h1.8v3.6h1.9l-3 3.4Z"
          fill="#0b1e26"
        />
      </svg>
    );
  }

  if (actualExt === "svg") {
    // Half-tone monochrome circle (common vscode-icons style for vector assets)
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
        <circle cx="12" cy="12" r="9.5" fill="#e5e5e5" />
        <path d="M12 2.5a9.5 9.5 0 0 1 0 19V2.5Z" fill="#1a1a1a" />
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="#8a8a8a" strokeWidth="0.75" />
      </svg>
    );
  }

  if (actualExt === "png" || actualExt === "jpg" || actualExt === "jpeg" || actualExt === "webp" || actualExt === "avif") {
    // Landscape/mountain photo icon (matches VS Code image file glyph)
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
        <rect x="2.5" y="4" width="19" height="16" rx="1.8" fill="#3b2a52" stroke="#a855f7" strokeWidth="1.1" />
        <circle cx="8" cy="9.5" r="1.7" fill="#facc15" />
        <path d="M3.5 17.5 8.5 12l3.7 4 3-3.2 5.3 4.7v.5a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8v-.5Z" fill="#a855f7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 14 16" className="w-3.5 h-3.5 shrink-0 text-[#9a9a9a]" fill="currentColor">
      <path d="M1.5 0C0.67 0 0 0.67 0 1.5V14.5C0 15.33 0.67 16 1.5 16H12.5C13.33 16 14 15.33 14 14.5V4.5L9.5 0H1.5Z" opacity="0.85" />
      <path d="M9 0V4.5H14" opacity="0.4" />
    </svg>
  );
});
CustomIcon.displayName = "CustomIcon";

const Chevron = memo(({ open }: { open: boolean }) => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    className={cn(
      "transition-transform duration-300 ease-out shrink-0",
      open ? "rotate-90" : "rotate-0"
    )}
  >
    <path
      d="M2 1L6 4L2 7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
Chevron.displayName = "Chevron";

interface ItemProps {
  node: FileNode;
  depth: number;
  path: string;
  activePath: string | null;
  onSelect: (node: FileNode, path: string) => void;
  defaultOpen: boolean;
}

const FileItem = memo(function FileItem({
  node,
  depth,
  path,
  activePath,
  onSelect,
  defaultOpen,
}: ItemProps) {
  const [open, setOpen] = useState(node.defaultOpen ?? defaultOpen);
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && !!node.children?.length;
  const isActive = activePath === path || activePath === node.name;

  const handleClick = useCallback(() => {
    if (isFolder) setOpen((o) => !o);
    onSelect(node, path);
  }, [isFolder, node, onSelect, path]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    } else if (e.key === "ArrowRight" && isFolder && !open) {
      setOpen(true);
    } else if (e.key === "ArrowLeft" && isFolder && open) {
      setOpen(false);
    }
  };

  return (
    <div className="select-none">
      <div
        role="treeitem"
        aria-expanded={isFolder ? open : undefined}
        aria-selected={isActive}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={onKey}
        className={cn(
          "group relative flex items-center gap-1.5 py-[3px] pr-2 rounded-[4px] cursor-pointer outline-none",
          "transition-all duration-150 ease-out",
          "hover:bg-white/[0.05] hover:translate-x-[1px]",
          "focus-visible:ring-1 focus-visible:ring-[#a78bfa]/40",
          isActive && "bg-white/[0.08] text-white shadow-[inset_2px_0_0_0_#a78bfa]",
          node.muted && !isActive && "opacity-45"
        )}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
      >
        {/* Indent guide */}
        {depth > 0 && (
          <span
            aria-hidden
            className="absolute top-0 bottom-0 w-px bg-[#1f1f1f] group-hover:bg-[#a78bfa]/20 transition-colors"
            style={{ left: `${(depth - 1) * 12 + 11}px` }}
          />
        )}

        {/* Chevron slot (folders) */}
        <span
          className={cn(
            "w-[10px] flex items-center justify-center shrink-0 transition-colors",
            isFolder ? "text-[#7a7a7a] group-hover:text-[#a78bfa]" : "opacity-0"
          )}
        >
          {isFolder && <Chevron open={open} />}
        </span>

        {/* Icon */}
        <CustomIcon name={node.name} ext={node.extension} isFolder={isFolder} open={open} />

        {/* Name */}
        <span
          className={cn(
            "font-mono text-[12px] tracking-tight truncate transition-colors duration-200",
            isActive
              ? "text-white font-medium"
              : !isFolder
                ? "text-[#bfbfbf] group-hover:text-white"
                : ""
          )}
          style={
            !isActive && isFolder
              ? { color: getFolderColor(node.name) }
              : undefined
          }
        >
          {node.name}
        </span>

        {/* Git status letter (M = modified, U = untracked) */}
        {node.gitStatus ? (
          <span
            className={cn(
              "ml-auto text-[10px] font-mono font-semibold shrink-0",
              node.gitStatus === "M" ? "text-[#e2b93d]" : "text-[#5fc07a]"
            )}
          >
            {node.gitStatus}
          </span>
        ) : (
          <span
            aria-hidden
            className={cn(
              "ml-auto w-1.5 h-1.5 rounded-full bg-[#a78bfa] transition-all duration-300",
              isActive
                ? "opacity-100 shadow-[0_0_8px_#a78bfa]"
                : "opacity-0 group-hover:opacity-40"
            )}
          />
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <div
          role="group"
          aria-hidden={!open}
          className={cn(
            "overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
            open
              ? "max-h-500 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
          )}
        >
          {node.children!.map((child) => (
            <FileItem
              key={`${path}/${child.name}`}
              node={child}
              depth={depth + 1}
              path={`${path}/${child.name}`}
              activePath={activePath}
              onSelect={onSelect}
              defaultOpen={defaultOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export const FileTree = memo(function FileTree({
  data,
  className,
  defaultOpen = true,
  initialActive,
  onSelectFile,
}: FileTreeProps) {
  const [activePath, setActivePath] = useState<string | null>(initialActive || null);

  const handleSelect = useCallback((node: FileNode, path: string) => {
    setActivePath(path);
    if (node.type === "file" && onSelectFile) {
      onSelectFile(node, path);
    }
  }, [onSelectFile]);

  return (
    <div
      role="tree"
      className={cn("w-full py-1 text-xs select-none space-y-0.5", className)}
    >
      {data.map((node) => (
        <FileItem
          key={node.name}
          node={node}
          depth={0}
          path={node.name}
          activePath={activePath}
          onSelect={handleSelect}
          defaultOpen={defaultOpen}
        />
      ))}
    </div>
  );
});

export default FileTree;
