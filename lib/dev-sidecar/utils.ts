export function isPreviewVersion(version: string) {
  return version.includes("pre") || version.includes("rc") || version.includes("test");
}

export function formatDataSize(bytes: number): string {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  const tb = gb / 1024;
  const pb = tb / 1024;

  if(tb >= 1024) return `${pb.toFixed(2)} PB`;
  if(gb >= 1024) return `${tb.toFixed(2)} TB`;
  if(mb >= 1024) return `${gb.toFixed(2)} GB`;
  if(kb >= 1024) return `${mb.toFixed(2)} MB`;
  return `${kb.toFixed(2)} KB`;
}

/** 从 tag_name 中提取版本号（去掉 v 前缀） */
export function normalizeVersion(tag: string): string {
  return tag.replace(/^v/, "");
}

/** 获取 asset 文件名中的人类可读描述 */
export function describeAsset(filename: string): string {
  const map: Record<string, string> = {
    "windows-universal.exe": "Windows 通用安装包",
    "windows-x86_64.exe": "Windows x64 安装包",
    "windows-x64.exe": "Windows x64 安装包",
    "windows-arm64.exe": "Windows ARM64 安装包",
    "windows-ia32.exe": "Windows x86 安装包",
    "macos-universal.dmg": "macOS 通用安装包",
    "macos-arm64.dmg": "macOS ARM64 安装包",
    "macos-x86_64.dmg": "macOS Intel 安装包",
    "linux-x86_64.deb": "Linux x64 (.deb)",
    "linux-arm64.deb": "Linux ARM64 (.deb)",
    "linux-armv7l.deb": "Linux ARM v7l (.deb)",
    "linux-x86_64.AppImage": "Linux x64 (.AppImage)",
    "linux-arm64.AppImage": "Linux ARM64 (.AppImage)",
    "linux-armv7l.AppImage": "Linux ARM v7l (.AppImage)",
    "linux-x86_64.tar.gz": "Linux x64 (.tar.gz)",
    "linux-arm64.tar.gz": "Linux ARM64 (.tar.gz)",
    "linux-armv7l.tar.gz": "Linux ARM v7l (.tar.gz)",
    "linux-x86_64.rpm": "Linux x64 (.rpm)",
    "linux-arm64.rpm": "Linux ARM64 (.rpm)",
    "linux-armv7l.rpm": "Linux ARM v7l (.rpm)",
  };
  // 从文件名中提取关键部分，例如 DevSidecar-2.0.2-windows-universal.exe → windows-universal.exe
  const match = filename.match(/DevSidecar-\d+\.\d+\.[^-]+-(.+)/);
  if (!match) return filename;
  const key = match[1];
  return map[key] ?? filename;
}

export async function copyToClipboard(str: string) {
  try {
    await navigator.clipboard.writeText(str);
  } catch (err) {
    console.error('Could not copy text: ', err);
  }
}
