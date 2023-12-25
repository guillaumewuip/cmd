import { Image } from "./image";

export type Mix = Readonly<{
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
   * Url to the mix
   */
  externalUrl: string;

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

export function create(mix: Mix): Mix {
  return mix;
}
