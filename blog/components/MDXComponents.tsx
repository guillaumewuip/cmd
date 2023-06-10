import * as Option from "fp-ts/Option";

import {
  H1,
  H2,
  H3,
  Paragraph,
  Code,
  Blockquote,
  Link,
  Hr,
} from "@cmd/ui-text";
import { EmbedableLink } from "@cmd/domain-player";
import { TrackPlayer } from "@cmd/ui-player";

export const components = {
  h1: (props: { children: React.ReactNode }) => <H1 {...props} />,
  h2: (props: { children: React.ReactNode }) => <H2 {...props} />,
  h3: (props: { children: React.ReactNode }) => <H3 {...props} />,
  a: (props: { href: string; children: string }) => <Link {...props} />,
  p: (props: { children: React.ReactNode }) => <Paragraph {...props} />,
  hr: () => <Hr />,
  code: (props: { children: React.ReactNode }) => <Code {...props} />,
  blockquote: (props: { children: React.ReactNode }) => (
    <Blockquote {...props} />
  ),
  player: (props: { href: string }) => {
    const parsed = EmbedableLink.parseLink(props.href);

    if (Option.isNone(parsed)) {
      return (
        <p>
          <Link href={props.href}>{props.href}</Link>
        </p>
      );
    }

    return <TrackPlayer key={parsed.value.href} embedableLink={parsed.value} />;
  },
};
