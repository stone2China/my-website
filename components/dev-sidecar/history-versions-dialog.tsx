"use client";

import { useContext, type PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReleasesContext } from "@/contexts/dev-sidecar-releases";
import { DataTable } from "@/components/dev-sidecar/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { findAsset } from "@/lib/dev-sidecar/api";
import { isPreviewVersion, normalizeVersion, formatDataSize, describeAsset } from "@/lib/dev-sidecar/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RowData {
  tagName: string
  version: string
  isPreview: boolean
  publishedAt: string
  assetUrl: string | null
  assetSize: number | null
  assetDesc: string | null
}

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: "version",
    header: "版本",
  },
  {
    id: "tag",
    header: "",
    cell: ({ row }) => (
      row.original.isPreview
      ? <Badge className="bg-background text-destructive">预览版</Badge>
      : <Badge>稳定版</Badge>
    )
  },
  {
    accessorKey: "assetSize",
    header: "大小",
    cell: ({ row }) => (
      row.original.assetSize != null
      ? <span className="text-xs">
          {formatDataSize(row.original.assetSize)}
        </span>
      : <span className="text-xs text-muted-foreground">-</span>
    )
  },
  {
    id: "controls",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          {row.original.assetUrl ? (
            <Button
              variant="ghost"
              size="icon-xs"
              asChild>
              <Link href={row.original.assetUrl} target="_blank">
                <Download />
              </Link>
            </Button>
          ) : (
            <span className="text-[10px] text-muted-foreground">无匹配</span>
          )}
        </div>
      );
    }
  }
];

export function HistoryVersionsDialog({ children }: PropsWithChildren) {
  const { releases, os, arch } = useContext(ReleasesContext);

  if(!releases || !os || !arch) return <></>;

  const tableData: RowData[] = releases.map((r) => {
    const asset = findAsset(r, os, arch);
    return {
      tagName: r.tag_name,
      version: normalizeVersion(r.tag_name),
      isPreview: isPreviewVersion(r.tag_name) || r.prerelease,
      publishedAt: r.published_at,
      assetUrl: asset?.browser_download_url ?? null,
      assetSize: asset?.size ?? null,
      assetDesc: asset ? describeAsset(asset.name) : null,
    };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>历史版本</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto pr-2">
          <DataTable
            columns={columns}
            data={tableData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
