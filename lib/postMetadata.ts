export type PostMetadata = {
  type: 'cmd',
  title: string,
  image: {
    src: string,
    alt: string,
    caption?: string,
  },
};

export function create(data: PostMetadata): PostMetadata {
  return data;
}
