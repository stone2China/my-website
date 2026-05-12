"use client";
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
