export type PostMetadata = {
  type: 'cmd',
  title: string,
  description: string,
  image: {
    src: string,
    alt: string,
    caption?: string,
  },
};

export function create(data: PostMetadata): PostMetadata {
  return data;
}
