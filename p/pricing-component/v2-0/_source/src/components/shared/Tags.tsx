import { Tag } from "@/components/shared/Tag";

type Props = {
  tags: string[];
  variant?: "filled" | "outlined" | "muted";
};

export function Tags({ tags, variant }: Props) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag} label={tag} variant={variant} />
      ))}
    </div>
  );
}
