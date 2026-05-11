"use client";

import { useEffect, useRef } from "react";
import Gitalk from "gitalk";

export function GitalkComments({
  issue
}: {
  issue: number
}) {
  const gitalkOptions: Gitalk.GitalkOptions = {
    clientID: process.env["NEXT_PUBLIC_GITALK_CLIENT_ID"] ?? "",
    clientSecret: process.env["NEXT_PUBLIC_GITALK_CLIENT_SECRET"] ?? "",
<<<<<<< HEAD
    repo: "nocp.space-comments",
    owner: "NriotHrreion",
    admin: ["NriotHrreion"],
=======
    repo: "stone-comments",
    owner: "stone2China",
    admin: ["stone2China"],
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
    number: issue
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!containerRef.current) return;

    const gitalk = new Gitalk(gitalkOptions);
    gitalk.render(containerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef}/>;
}
