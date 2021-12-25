export type Metadata = {
  type: 'cmd',
  title: string,
  image: {
    src: string,
    alt: string,
    caption?: string,
  },
};

export function create(data: Metadata): Metadata {
  return data;
}
