"use client";
<<<<<<< HEAD
export function SheetsTable() {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <h3 className="text-xl font-bold self-start px-2">我的播放列表</h3>
      <iframe 
        allow="autoplay *; encrypted-media *;" 
        frameBorder="0" 
        height="450" 
        style={{
          width: '100%',
          maxWidth: '660px',
          overflow: 'hidden',
          background: 'transparent',
          borderRadius: '12px' // 增加一点圆角，更符合苹果风格
        }} 
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
        src="https://embed.music.apple.com/cn/playlist/music/pl.u-38oWZplFYmaJMBd"
      ></iframe>
    </div>
  );
}
=======

import { useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import type { ArrayElement } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import sheets from "@/data/sheets/sheets.json";

const columns: ColumnDef<ArrayElement<typeof sheets>>[] = [
  {
    accessorKey: "name",
    header() {
      return <span className="block px-3">曲目</span>;
    },
    cell({ getValue, row }) {
      const name = getValue() as string;
      const src = row.getAllCells()[4].getValue() as string;
      return (
        <Button
          className="h-5 font-semibold"
          variant="link"
          size="sm"
          asChild>
          <Link href={`/sheets/${src}`}>{name}</Link>
        </Button>
      );
    }
  },
  {
    accessorKey: "author",
    header: "作曲 / 编曲",
    cell({ getValue }) {
      const author = getValue() as string;
      return <span className="text-center">{author}</span>;
    }
  },
  {
    accessorKey: "tune",
    header() {
      return <span className="block text-center">曲调</span>;
    },
    cell({ getValue }) {
      const tune = getValue() as string;
      return <span className="block text-green-600 text-center">{tune}</span>;
    }
  },
  {
    accessorKey: "capo",
    header() {
      return <span className="block text-center">变调夹</span>;
    },
    cell({ getValue }) {
      const capo = getValue() as number;
      return <span className="block text-yellow-600 text-center">{capo}</span>;
    }
  },
  {
    accessorKey: "src",
    header() {
      return <span className="block text-right px-3">曲谱</span>;
    },
    cell({ getValue }) {
      const src = getValue() as string;
      return (
        <Button
          className="h-5 float-right"
          variant="link"
          size="sm"
          asChild>
          <Link href={`/sheets/${src}`}>查看</Link>
        </Button>
      );
    }
  },
];

export function SheetsTable() {
  const inputRef = useRef<HTMLInputElement>(null);

  const table = useReactTable({
    columns,
    data: sheets,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleSearch = () => {
    if(!inputRef.current) return;

    table.getColumn("name")?.setFilterValue(inputRef.current.value);
  };

  const handleClearInput = () => {
    if(!inputRef.current) return;

    inputRef.current.value = "";
    table.getColumn("name")?.setFilterValue("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Input
          placeholder="查找曲谱..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={() => handleSearch()}
          ref={inputRef}/>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={() => handleClearInput()}>
          <X />
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {
                    header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                  }
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {
                row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
