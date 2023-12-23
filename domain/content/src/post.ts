export type Image = {
  src: string;
  alt: string;
  caption?: string;
};

export type Post = Readonly<{
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

export function create(post: Post): Post {
  return post;
}
