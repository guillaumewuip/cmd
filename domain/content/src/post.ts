import { Image } from "./image";

export type Post = Readonly<{
  type: "POST";

  /**
   * Unique identifier of the post
   */
  id: string;

  /**
   * Title of the post
   */
  title: string;

  /**
   * Thumbnail of the post
   */
  image: Image;

  /**
   * Date after which the post is considered published
   * ISO date
   */
  publishedAt: string;

  /**
   * Content of the post
   */
  content: string;
}>;

export function create(post: Omit<Post, "type">): Post {
  return { type: "POST", ...post };
}
