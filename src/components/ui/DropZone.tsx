import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  RotateCcw,
  UploadCloud,
  X,
  type LucideIcon,
} from "lucide-react";

export type FileStatus = "idle" | "uploading" | "success" | "error";

export type UploadFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  errorMessage?: string;
  previewUrl?: string;
};

export type DropZoneValidationRule = {
  maxSizeMb?: number;
  minSizeMb?: number;
  accept?: string | string[];
  maxFiles?: number;
  customValidator?: (file: File) => string | null | Promise<string | null>;
};

export type DropZoneContextValue = {
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  disabled: boolean;
  multiple: boolean;
  accept?: string;
  tone: "dark" | "light" | "auto";
  files: UploadFileItem[];
  addFiles: (newFiles: FileList | File[]) => Promise<void>;
  removeFile: (id: string) => void;
  retryFile: (id: string) => void;
  openPicker: () => void;
};

const DropZoneContext = createContext<DropZoneContextValue | null>(null);

export function useDropZone(): DropZoneContextValue {
  const context = useContext(DropZoneContext);
  if (!context) {
    throw new Error(
      "DropZone components must be used within a <DropZone> provider.",
    );
  }
  return context;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileFormatIcon(mimeType: string, fileName = ""): LucideIcon {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (
    mimeType.startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "svg", "gif", "avif"].includes(ext)
  ) {
    return FileImage;
  }
  if (
    mimeType.startsWith("video/") ||
    ["mp4", "mov", "webm", "mkv", "avi"].includes(ext)
  ) {
    return FileVideo;
  }
  if (
    mimeType.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "aac", "m4a"].includes(ext)
  ) {
    return FileAudio;
  }
  if (
    mimeType.includes("pdf") ||
    ["doc", "docx", "txt", "rtf", "md"].includes(ext)
  ) {
    return FileText;
  }
  if (["zip", "rar", "tar", "gz", "7z"].includes(ext)) {
    return FileArchive;
  }
  if (["js", "ts", "tsx", "jsx", "json", "html", "css", "py"].includes(ext)) {
    return FileCode;
  }
  return FileIcon;
}

export function validateFileAgainstRules(
  file: File,
  rules?: DropZoneValidationRule,
): string | null {
  if (!rules) return null;

  // Max Size
  if (rules.maxSizeMb !== undefined) {
    const maxBytes = rules.maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File exceeds max size of ${rules.maxSizeMb} MB (${formatBytes(file.size)})`;
    }
  }

  // Min Size
  if (rules.minSizeMb !== undefined) {
    const minBytes = rules.minSizeMb * 1024 * 1024;
    if (file.size < minBytes) {
      return `File is smaller than minimum required ${rules.minSizeMb} MB`;
    }
  }

  // Accept/MIME Type
  if (rules.accept) {
    const acceptList = Array.isArray(rules.accept)
      ? rules.accept
      : rules.accept.split(",").map((s) => s.trim().toLowerCase());

    const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const fileMime = file.type.toLowerCase();

    const matches = acceptList.some((pattern) => {
      if (pattern.startsWith(".")) {
        return fileExt === pattern;
      }
      if (pattern.endsWith("/*")) {
        const typePrefix = pattern.replace("/*", "");
        return fileMime.startsWith(typePrefix);
      }
      return fileMime === pattern;
    });

    if (!matches) {
      return `File format not supported. Allowed: ${Array.isArray(rules.accept) ? rules.accept.join(", ") : rules.accept}`;
    }
  }

  return null;
}

export type DropZoneProps = {
  children?: ReactNode;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
  accept?: string | string[];
  maxSizeMb?: number;
  minSizeMb?: number;
  maxFiles?: number;
  customValidator?: (file: File) => string | null | Promise<string | null>;
  tone?: "dark" | "light" | "auto";
  files?: UploadFileItem[];
  onFilesChange?: (files: UploadFileItem[]) => void;
  onDropAccepted?: (files: File[]) => void;
  onDropRejected?: (rejections: { file: File; error: string }[]) => void;
  onUpload?: (
    item: UploadFileItem,
    updateProgress: (pct: number) => void,
  ) => Promise<void>;
};

export function DropZone({
  children,
  className = "",
  multiple = true,
  disabled = false,
  accept,
  maxSizeMb,
  minSizeMb,
  maxFiles,
  customValidator,
  tone = "dark",
  files: controlledFiles,
  onFilesChange,
  onDropAccepted,
  onDropRejected,
  onUpload,
}: DropZoneProps) {
  const [internalFiles, setInternalFiles] = useState<UploadFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rawId = useId();
  const inputId = `dropzone-input-${rawId.replace(/[:]/g, "")}`;

  const files = controlledFiles ?? internalFiles;

  const updateFiles = useCallback(
    (updater: (prev: UploadFileItem[]) => UploadFileItem[]) => {
      setInternalFiles((prev) => {
        const next = updater(prev);
        onFilesChange?.(next);
        return next;
      });
    },
    [onFilesChange],
  );

  const formattedAccept = useMemo(() => {
    if (!accept) return undefined;
    return Array.isArray(accept) ? accept.join(",") : accept;
  }, [accept]);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (disabled) return;
      const rawArray = Array.from(fileList);
      if (rawArray.length === 0) return;

      const accepted: File[] = [];
      const rejected: { file: File; error: string }[] = [];
      const newItems: UploadFileItem[] = [];

      const currentCount = files.length;

      for (let i = 0; i < rawArray.length; i++) {
        const file = rawArray[i];

        if (maxFiles && currentCount + newItems.length >= maxFiles) {
          rejected.push({
            file,
            error: `Maximum file limit of ${maxFiles} reached`,
          });
          continue;
        }

        const ruleError = validateFileAgainstRules(file, {
          accept,
          maxSizeMb,
          minSizeMb,
          maxFiles,
        });

        if (ruleError) {
          rejected.push({ file, error: ruleError });
          continue;
        }

        if (customValidator) {
          const customError = await customValidator(file);
          if (customError) {
            rejected.push({ file, error: customError });
            continue;
          }
        }

        accepted.push(file);
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        const previewUrl =
          isImage || isVideo ? URL.createObjectURL(file) : undefined;

        const item: UploadFileItem = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: onUpload ? "uploading" : "idle",
          progress: onUpload ? 0 : 100,
          previewUrl,
        };

        newItems.push(item);
      }

      if (rejected.length > 0) {
        onDropRejected?.(rejected);
      }
      if (accepted.length > 0) {
        onDropAccepted?.(accepted);
      }

      if (newItems.length > 0) {
        updateFiles((prev) => (multiple ? [...prev, ...newItems] : newItems));

        // Trigger upload if processor provided
        if (onUpload) {
          for (const item of newItems) {
            (async () => {
              try {
                await onUpload(item, (progress) => {
                  updateFiles((current) =>
                    current.map((f) =>
                      f.id === item.id
                        ? {
                            ...f,
                            progress,
                            status: progress >= 100 ? "success" : "uploading",
                          }
                        : f,
                    ),
                  );
                });
                updateFiles((current) =>
                  current.map((f) =>
                    f.id === item.id
                      ? { ...f, progress: 100, status: "success" }
                      : f,
                  ),
                );
              } catch (err: unknown) {
                const message =
                  err instanceof Error ? err.message : "Upload failed";
                updateFiles((current) =>
                  current.map((f) =>
                    f.id === item.id
                      ? { ...f, status: "error", errorMessage: message }
                      : f,
                  ),
                );
              }
            })();
          }
        }
      }
    },
    [
      disabled,
      files.length,
      maxFiles,
      accept,
      maxSizeMb,
      minSizeMb,
      customValidator,
      onDropRejected,
      onDropAccepted,
      updateFiles,
      multiple,
      onUpload,
    ],
  );

  const removeFile = useCallback(
    (id: string) => {
      updateFiles((prev) => {
        const target = prev.find((f) => f.id === id);
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        return prev.filter((f) => f.id !== id);
      });
    },
    [updateFiles],
  );

  const retryFile = useCallback(
    async (id: string) => {
      const target = files.find((f) => f.id === id);
      if (!target || !onUpload) return;

      updateFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "uploading",
                progress: 0,
                errorMessage: undefined,
              }
            : f,
        ),
      );

      try {
        await onUpload(target, (progress) => {
          updateFiles((current) =>
            current.map((f) =>
              f.id === id
                ? {
                    ...f,
                    progress,
                    status: progress >= 100 ? "success" : "uploading",
                  }
                : f,
            ),
          );
        });
        updateFiles((current) =>
          current.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "success" } : f,
          ),
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Upload retry failed";
        updateFiles((current) =>
          current.map((f) =>
            f.id === id ? { ...f, status: "error", errorMessage: message } : f,
          ),
        );
      }
    },
    [files, onUpload, updateFiles],
  );

  const openPicker = useCallback(() => {
    if (disabled || !inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.click();
  }, [disabled]);

  const value = useMemo<DropZoneContextValue>(
    () => ({
      inputId,
      inputRef,
      isDragging,
      disabled,
      multiple,
      accept: formattedAccept,
      tone,
      files,
      addFiles,
      removeFile,
      retryFile,
      openPicker,
    }),
    [
      inputId,
      isDragging,
      disabled,
      multiple,
      formattedAccept,
      tone,
      files,
      addFiles,
      removeFile,
      retryFile,
      openPicker,
    ],
  );

  return (
    <DropZoneContext.Provider value={value}>
      <div
        className={`w-full font-sans transition-all ${className}`}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Verify if leaving component boundary
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setIsDragging(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled && !isDragging) setIsDragging(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (!disabled && e.dataTransfer.files) {
            addFiles(e.dataTransfer.files);
          }
        }}
      >
        {children}
      </div>
    </DropZoneContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DROPZONE.AREA                                */
/* -------------------------------------------------------------------------- */

export type DropZoneAreaProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};

function Area({
  children,
  className = "",
  onClick,
  ...props
}: DropZoneAreaProps) {
  const { isDragging, disabled, openPicker, tone } = useDropZone();

  const isDark = tone === "dark";

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => {
        if (!disabled) {
          openPicker();
          onClick?.(e);
        }
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          openPicker();
        }
      }}
      className={`group relative flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none outline-none ${
        isDragging
          ? "border-emerald-500 bg-emerald-500/10 scale-[0.99] shadow-lg shadow-emerald-500/10"
          : isDark
            ? "border-zinc-800 bg-[#0c0d0e] hover:border-zinc-700 hover:bg-zinc-900/60"
            : "border-zinc-300 bg-zinc-50/75 hover:border-zinc-400 hover:bg-zinc-100/80"
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DROPZONE.ICON                                */
/* -------------------------------------------------------------------------- */

export type DropZoneIconProps = {
  className?: string;
  icon?: LucideIcon;
};

function Icon({ className = "", icon: CustomIcon }: DropZoneIconProps) {
  const { isDragging, tone } = useDropZone();
  const IconComponent = CustomIcon ?? UploadCloud;
  const isDark = tone === "dark";

  return (
    <div
      className={`mb-4 flex size-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
        isDragging
          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 scale-110"
          : isDark
            ? "border-zinc-800 bg-zinc-900/80 text-zinc-300 group-hover:border-zinc-700 group-hover:text-white group-hover:scale-105"
            : "border-zinc-200 bg-white text-zinc-600 group-hover:border-zinc-300 group-hover:text-zinc-900 group-hover:scale-105 shadow-sm"
      } ${className}`}
    >
      <IconComponent className="size-7 stroke-[1.75]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DROPZONE.LABEL                               */
/* -------------------------------------------------------------------------- */

export type DropZoneLabelProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode;
  className?: string;
};

function Label({
  children = "Drag files here or click to browse",
  className = "",
  ...props
}: DropZoneLabelProps) {
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <h4
      className={`text-base font-semibold tracking-tight transition-colors ${
        isDark ? "text-zinc-100 group-hover:text-white" : "text-zinc-900"
      } ${className}`}
      {...props}
    >
      {children}
    </h4>
  );
}

/* -------------------------------------------------------------------------- */
/*                            DROPZONE.DESCRIPTION                            */
/* -------------------------------------------------------------------------- */

export type DropZoneDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  className?: string;
};

function Description({
  children = "Supports JPEG, PNG, PDF, and MP4 up to 50 MB.",
  className = "",
  ...props
}: DropZoneDescriptionProps) {
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <p
      className={`mt-1.5 text-xs sm:text-sm font-normal max-w-md ${
        isDark
          ? "text-zinc-400 group-hover:text-zinc-300"
          : "text-zinc-500 group-hover:text-zinc-600"
      } ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DROPZONE.TRIGGER                              */
/* -------------------------------------------------------------------------- */

export type DropZoneTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
};

function Trigger({
  children = "Select files",
  className = "",
  onClick,
  ...props
}: DropZoneTriggerProps) {
  const { openPicker, disabled, tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        openPicker();
        onClick?.(e);
      }}
      className={`mt-5 inline-flex items-center justify-center rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-[0.98] ${
        isDark
          ? "bg-zinc-900 border border-zinc-700/80 text-zinc-100 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
          : "bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-400"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DROPZONE.INPUT                               */
/* -------------------------------------------------------------------------- */

export type DropZoneInputProps = HTMLAttributes<HTMLInputElement> & {
  className?: string;
};

function Input({ className = "", ...props }: DropZoneInputProps) {
  const { inputId, inputRef, multiple, accept, disabled, addFiles } =
    useDropZone();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  return (
    <input
      id={inputId}
      ref={inputRef}
      type="file"
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      onChange={handleChange}
      className={`hidden ${className}`}
      aria-hidden="true"
      tabIndex={-1}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              DROPZONE.FILELIST                             */
/* -------------------------------------------------------------------------- */

export type DropZoneFileListProps = {
  children?: ReactNode;
  className?: string;
};

function FileList({ children, className = "" }: DropZoneFileListProps) {
  const { files } = useDropZone();
  if (!children && files.length === 0) return null;

  return (
    <div className={`mt-4 flex flex-col gap-2.5 w-full ${className}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DROPZONE.FILEITEM                             */
/* -------------------------------------------------------------------------- */

type FileItemContextValue = {
  item: UploadFileItem;
};

const FileItemContext = createContext<FileItemContextValue | null>(null);

export function useFileItem(): FileItemContextValue {
  const ctx = useContext(FileItemContext);
  if (!ctx)
    throw new Error(
      "FileItem subcomponents must be used inside <DropZone.FileItem>",
    );
  return ctx;
}

export type DropZoneFileItemProps = {
  item: UploadFileItem;
  children?: ReactNode;
  className?: string;
};

function FileItem({ item, children, className = "" }: DropZoneFileItemProps) {
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <FileItemContext.Provider value={{ item }}>
      <div
        className={`group/item relative flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl border transition-all duration-200 ${
          item.status === "error"
            ? isDark
              ? "border-red-500/30 bg-red-950/20"
              : "border-red-300 bg-red-50/60"
            : item.status === "success"
              ? isDark
                ? "border-emerald-500/25 bg-zinc-900/60"
                : "border-emerald-300 bg-emerald-50/40"
              : isDark
                ? "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700"
                : "border-zinc-200 bg-white hover:border-zinc-300 shadow-sm"
        } ${className}`}
      >
        {children}
      </div>
    </FileItemContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                          DROPZONE.FILEFORMATICON                           */
/* -------------------------------------------------------------------------- */

export type DropZoneFileFormatIconProps = {
  className?: string;
  showThumbnail?: boolean;
};

function FileFormatIcon({
  className = "",
  showThumbnail = true,
}: DropZoneFileFormatIconProps) {
  const { item } = useFileItem();
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  if (showThumbnail && item.previewUrl && item.type.startsWith("image/")) {
    return (
      <div
        className={`relative size-10 shrink-0 overflow-hidden rounded-lg border bg-zinc-800 ${
          isDark ? "border-white/10" : "border-zinc-200"
        } ${className}`}
      >
        <img
          src={item.previewUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const IconComp = getFileFormatIcon(item.type, item.name);

  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${
        item.status === "error"
          ? isDark
            ? "border-red-500/30 bg-red-500/10 text-red-400"
            : "border-red-200 bg-red-100 text-red-600"
          : isDark
            ? "border-zinc-800 bg-zinc-800/60 text-zinc-300"
            : "border-zinc-200 bg-zinc-100 text-zinc-700"
      } ${className}`}
    >
      <IconComp className="size-5" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DROPZONE.FILEINFO                             */
/* -------------------------------------------------------------------------- */

export type DropZoneFileInfoProps = {
  children?: ReactNode;
  className?: string;
};

function FileInfo({ children, className = "" }: DropZoneFileInfoProps) {
  return (
    <div className={`min-w-0 flex-1 flex flex-col justify-center ${className}`}>
      {children}
    </div>
  );
}

function FileName({ className = "" }: { className?: string }) {
  const { item } = useFileItem();
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <span
      className={`truncate text-xs sm:text-sm font-medium ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      } ${className}`}
      title={item.name}
    >
      {item.name}
    </span>
  );
}

function FileMeta({ className = "" }: { className?: string }) {
  const { item } = useFileItem();
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <div
      className={`flex items-center gap-2 text-ed-2xs font-normal ${className}`}
    >
      <span className={isDark ? "text-zinc-400" : "text-zinc-500"}>
        {formatBytes(item.size)}
      </span>
      {item.status === "uploading" && (
        <span className="text-blue-400 font-medium">
          {Math.round(item.progress)}%
        </span>
      )}
      {item.status === "success" && (
        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
          <CheckCircle2 className="size-3" /> Ready
        </span>
      )}
      {item.status === "error" && item.errorMessage && (
        <span className="inline-flex items-center gap-1 text-red-400 font-medium truncate max-w-xs">
          <AlertCircle className="size-3 shrink-0" /> {item.errorMessage}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          DROPZONE.FILEPROGRESS                             */
/* -------------------------------------------------------------------------- */

export type DropZoneFileProgressProps = {
  children?: ReactNode;
  className?: string;
};

function FileProgress({ children, className = "" }: DropZoneFileProgressProps) {
  const { item } = useFileItem();
  if (item.status !== "uploading") return null;

  return <div className={`mt-1.5 w-full ${className}`}>{children}</div>;
}

function FileProgressTrack({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function FileProgressFill({ className = "" }: { className?: string }) {
  const { item } = useFileItem();
  return (
    <div
      className={`h-full rounded-full bg-emerald-500 transition-all duration-200 ease-out ${className}`}
      style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                       DROPZONE RETRY & REMOVE BUTTONS                      */
/* -------------------------------------------------------------------------- */

function FileRetryTrigger({ className = "" }: { className?: string }) {
  const { item } = useFileItem();
  const { retryFile, tone } = useDropZone();
  if (item.status !== "error") return null;

  const isDark = tone === "dark";

  return (
    <button
      type="button"
      onClick={() => retryFile(item.id)}
      title="Retry upload"
      aria-label="Retry upload"
      className={`inline-flex size-8 items-center justify-center rounded-lg border transition hover:scale-105 active:scale-95 ${
        isDark
          ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
      } ${className}`}
    >
      <RotateCcw className="size-3.5" />
    </button>
  );
}

function FileRemoveTrigger({ className = "" }: { className?: string }) {
  const { item } = useFileItem();
  const { removeFile, tone } = useDropZone();
  const isDark = tone === "dark";

  return (
    <button
      type="button"
      onClick={() => removeFile(item.id)}
      title="Remove file"
      aria-label="Remove file"
      className={`inline-flex size-8 items-center justify-center rounded-lg border transition hover:scale-105 active:scale-95 ${
        isDark
          ? "border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-red-400"
          : "border-transparent text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 hover:text-red-600"
      } ${className}`}
    >
      <X className="size-4" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                   ALL-IN-ONE EASY UPLOADER WRAPPER                         */
/* -------------------------------------------------------------------------- */

export type FileUploaderProps = DropZoneProps & {
  label?: string;
  description?: string;
  buttonText?: string;
  showPreviews?: boolean;
};

/**
 * All-In-One Parent DropZone Uploader.
 * Fully configurable with custom file rules, constraints, progress tracking, and validation.
 */
export function FileUploader({
  label = "Drag files here or click to browse",
  description,
  buttonText = "Select files",
  showPreviews = true,
  maxSizeMb,
  accept,
  children,
  ...dropZoneProps
}: FileUploaderProps) {
  // Format default description if not explicitly provided
  const computedDescription = useMemo(() => {
    if (description) return description;
    const parts: string[] = [];
    if (accept) {
      const typeStr = Array.isArray(accept) ? accept.join(", ") : accept;
      parts.push(`Supports ${typeStr.toUpperCase()}`);
    }
    if (maxSizeMb) {
      parts.push(`up to ${maxSizeMb} MB`);
    }
    return parts.length > 0
      ? `${parts.join(" ")}.`
      : "Supports all common file types.";
  }, [description, accept, maxSizeMb]);

  return (
    <DropZone accept={accept} maxSizeMb={maxSizeMb} {...dropZoneProps}>
      <DropZone.Area>
        <DropZone.Icon />
        <DropZone.Label>{label}</DropZone.Label>
        <DropZone.Description>{computedDescription}</DropZone.Description>
        <DropZone.Trigger>{buttonText}</DropZone.Trigger>
      </DropZone.Area>
      <DropZone.Input />

      {/* Auto-render file list with HeroUI Pro style */}
      <DropZoneConsumerFileList showPreviews={showPreviews} />

      {children}
    </DropZone>
  );
}

function DropZoneConsumerFileList({ showPreviews }: { showPreviews: boolean }) {
  const { files } = useDropZone();
  if (files.length === 0) return null;

  return (
    <DropZone.FileList>
      {files.map((item) => (
        <DropZone.FileItem key={item.id} item={item}>
          <DropZone.FileFormatIcon showThumbnail={showPreviews} />
          <DropZone.FileInfo>
            <DropZone.FileName />
            <DropZone.FileMeta />
            <DropZone.FileProgress>
              <DropZone.FileProgressTrack>
                <DropZone.FileProgressFill />
              </DropZone.FileProgressTrack>
            </DropZone.FileProgress>
          </DropZone.FileInfo>
          <DropZone.FileRetryTrigger />
          <DropZone.FileRemoveTrigger />
        </DropZone.FileItem>
      ))}
    </DropZone.FileList>
  );
}

/* -------------------------------------------------------------------------- */
/*                     COMPOUND COMPONENT ATTACHMENTS                         */
/* -------------------------------------------------------------------------- */

DropZone.Area = Area;
DropZone.Icon = Icon;
DropZone.Label = Label;
DropZone.Description = Description;
DropZone.Trigger = Trigger;
DropZone.Input = Input;
DropZone.FileList = FileList;
DropZone.FileItem = FileItem;
DropZone.FileFormatIcon = FileFormatIcon;
DropZone.FileInfo = FileInfo;
DropZone.FileName = FileName;
DropZone.FileMeta = FileMeta;
DropZone.FileProgress = FileProgress;
DropZone.FileProgressTrack = FileProgressTrack;
DropZone.FileProgressFill = FileProgressFill;
DropZone.FileRetryTrigger = FileRetryTrigger;
DropZone.FileRemoveTrigger = FileRemoveTrigger;

export default DropZone;
