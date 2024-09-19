import IconCloud from "@/app/components/Landing/IconCloud";
import {useEffect, useState} from "react";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export function IntegrationIconCloud() {
  const [render, setRender] = useState(false)
  useEffect(() => {
    setRender(true)
  }, []);
  return (
    <div className="relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg bg-background p-0 sm:px-8 sm:pb-8 sm:pt-8">
      {render && <IconCloud iconSlugs={slugs} />}
    </div>
  );
}
