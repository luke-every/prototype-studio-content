import type { Headline as HeadlineText } from "./types";

type Props = {
  text: HeadlineText;
};

/** A headline whose second half is set in italic */
export function Headline({ text }: Props) {
  return (
    <>
      {text.lead}
      {text.lineBreak && <br />}
      <i className="font-book-italic">{text.italic}</i>
    </>
  );
}
