import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  photos: string[];
  alt: string;
}

export function VehicleGallery({ photos, alt }: Props) {
  const [active, setActive] = useState(0);
  if (photos.length === 0) return null;

  const main = photos[active];
  const thumbs = photos.slice(0, 4);

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4 aspect-video overflow-hidden rounded-sm bg-muted">
        <img src={main} alt={alt} className="size-full object-cover" />
      </div>
      {thumbs.map((p, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={cn(
            "aspect-[4/3] overflow-hidden rounded-sm border-2 bg-muted transition-all",
            active === i ? "border-foreground" : "border-transparent hover:border-border",
          )}
        >
          <img src={p} alt={`${alt} ${i + 1}`} className="size-full object-cover" />
        </button>
      ))}
      {photos.length > 4 && (
        <div className="grid aspect-[4/3] cursor-pointer place-items-center rounded-sm bg-foreground text-background transition-colors hover:bg-foreground/90">
          <span className="font-bold">+{photos.length - 4}</span>
        </div>
      )}
    </div>
  );
}
