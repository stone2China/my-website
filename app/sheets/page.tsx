import Link from "next/link";
import { Page } from "@/components/page";

export default function Sheets() {
  return (
    <Page title="我的歌单">
      <p>这是我的Apple Music歌单，包含了我喜欢的音乐。</p>

      <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%', maxWidth:'660px', overflow:'hidden', background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/cn/playlist/music/pl.u-38oWZplFYmaJMBd"></iframe>
    </Page>
  );
}
