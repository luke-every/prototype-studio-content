type Props = {
  lead: string;
  /** The serif italic part; the section's headline styles (`[&_em]:font-book-italic`) set the face */
  italic?: string;
};

/** Stands in for production's rich-text headlines, which carry the italic part as <em>. */
export function Headline({ lead, italic }: Props) {
  return (
    <>
      {lead}
      {italic && <em>{italic}</em>}
    </>
  );
}
