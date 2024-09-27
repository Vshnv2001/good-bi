import IconCloud from "@/app/components/Landing/IconCloud";
import { useEffect, useState } from "react";

const slugs = [
  "zoho",
  "googlemarketingplatform",
  "libreoffice",
  "salesforce",
  "hubspot",
  "zendesk",
  "sage",
  "cloudflare",
  "cloudinary",
  "icloud",
  "googlecloud",
  "amazonwebservices",
  "equinixmetal",
  "akamai",
  "digitalocean",
  "alibabacloud",
  "googledrive",
  "notion",
  "oracle",
  "amazonec2"
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
