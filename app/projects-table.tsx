import Link from "next/link";
import { ExternalLink } from "lucide-react";

import projects from "@/data/info/projects.json";

interface Project {
  name: string;
  year: number;
  description: string;
  repo?: string;
}

export function ProjectsTable() {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-3xl font-semibold">项目</h2>
      <div className="flex flex-col gap-4">
        {projects.length === 0 ? (
          <span className="text-secondary-foreground">暂无</span>
        ) : (
          (projects as Project[]).map((item, i) => (
            <div
              className="flex justify-between max-md:flex-col max-md:gap-2 pb-4 border-b last:border-0"
              key={i}>
              <span className="flex-1 !font-semibold text-foreground">{item.name}</span>
              <div className="flex-1 flex justify-between items-center">
                {item.repo && (
                  <span className="text-secondary-foreground">
                    <ExternalLink size={17} className="inline-block mr-2"/>
                    {item.repo}
                  </span>
                )}
                <span className="text-sm text-yellow-600">{item.year}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
