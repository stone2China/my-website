import { googleSansCode } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={cn("py-7 flex flex-col items-center gap-2 [&>span]:text-xs [&>span]:text-muted-foreground", googleSansCode.className)}>
      <span>
        <Link href="https://github.com/docmirror/dev-sidecar" target="_blank">DevSidecar</Link> — 给开发者的边车辅助工具
      </span>
      <span>
        Copyright &copy; {new Date().getFullYear()} <Link href="https://github.com/docmirror" target="_blank">docmirror</Link>
      </span>
      <span>
        Designed by <Link href="https://nocp.space/" target="_blank">NriotHrreion</Link>，由 <Link href="https://stone-dev.top/" target="_blank">stone</Link> 修改
      </span>
    </footer>
  );
}
