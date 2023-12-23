import { getMDXComponent } from "next-contentlayer/hooks";

import { Post } from "@cmd/domain-content";

export async function PostContent({
  post,
  components,
}: {
  post: Post.Post;
  components: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    a: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => JSX.Element;
    hr: () => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    player: (props: any) => JSX.Element;
  };
}) {
  const MDXContent = getMDXComponent(post.content);

  return <MDXContent components={components} />;
}
