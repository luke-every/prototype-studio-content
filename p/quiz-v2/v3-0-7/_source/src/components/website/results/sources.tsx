// TODO(lift): sample data — replace with the references from the CMS; each needs a nutritionist's sign-off
export const SOURCES: Record<string, { label: string; url: string }> = {
  "dge-fibre": {
    label: "DGE (2021), Ausgewählte Fragen und Antworten zu Ballaststoffen",
    url: "https://www.dge.de/fileadmin/dok/gesunde-ernaehrung/faq/DGE-FAQ-Ballaststoffe-2021.pdf",
  },
  "dge-protein": {
    label:
      "DGE (2021), Ausgewählte Fragen und Antworten zu Protein und unentbehrlichen Aminosäuren",
    url: "https://www.dge.de/fileadmin/dok/gesunde-ernaehrung/faq/DGE-FAQ-Protein-2021.pdf",
  },
  "dge-energy": {
    label: "DGE (2015), Ausgewählte Fragen und Antworten zur Energiezufuhr",
    url: "https://www.dge.de/fileadmin/dok/gesunde-ernaehrung/faq/DGE-FAQ-Energie-2015.pdf",
  },
  "efsa-fibre": {
    label:
      "EFSA (2010), Scientific Opinion on Dietary Reference Values for carbohydrates and dietary fibre",
    url: "https://doi.org/10.2903/j.efsa.2010.1462",
  },
  "efsa-protein": {
    label:
      "EFSA (2012), Scientific Opinion on Dietary Reference Values for protein",
    url: "https://doi.org/10.2903/j.efsa.2012.2557",
  },
};

const MARK = /\[\[([\w-]+)\]\]/g;

/** The text with its [[id]] markers taken out, for where the references aren't shown */
export const stripCites = (text: string) =>
  text.replace(/\s*\[\[[\w-]+\]\]/g, "");

/** The text with each [[id]] marker as a numbered link to its source, numbered by where the id sits in `order` */
export function Cited({ text, order }: { text: string; order: string[] }) {
  const parts = text.split(MARK);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : (
          <a
            key={i}
            href={SOURCES[part].url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Source ${order.indexOf(part) + 1}`}
            className="text-light-text no-underline"
          >
            [{order.indexOf(part) + 1}]
          </a>
        ),
      )}
    </>
  );
}

/** The numbered list of sources, in `order` */
export function SourceList({
  order,
  className = "",
}: {
  order: string[];
  className?: string;
}) {
  if (!order.length) return null;
  return (
    <ol className={`m-0 flex list-none flex-col gap-1 p-0 ${className}`}>
      {order.map((id, i) => (
        <li
          key={id}
          className="text-xs leading-4 tracking-[-0.24px] text-light-text"
        >
          [{i + 1}]{" "}
          <a
            href={SOURCES[id].url}
            target="_blank"
            rel="noreferrer"
            className="text-light-text underline underline-offset-2"
          >
            {SOURCES[id].label}
          </a>
        </li>
      ))}
    </ol>
  );
}
