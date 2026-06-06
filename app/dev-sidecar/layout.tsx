import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev-Sidecar下载站",
};

export default function DevSidecarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
