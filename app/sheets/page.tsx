import Link from "next/link";
import { Page } from "@/components/page";
import { SheetsTable } from "./sheets-table";
export default function Sheets() {
  return (
    <Page title="我的歌单">
      <p>这是我的apple music歌单，欢迎聆听！</p>
      <SheetsTable />
    </Page>
  );
}
