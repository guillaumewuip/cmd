import {
  defineNestedType,
  defineDocumentType,
  makeSource,
} from "contentlayer/source-files";
// eslint-disable-next-line import/no-extraneous-dependencies
import remarkLinkPlugin from "@remark-embedder/core";

function idFromFilename(filename: string): string {
  const match = filename.match(/(?<fullName>\d\d\d\d-\d\d-\d\d-[\w\-_]*)/);

  if (match === null) {
    throw new Error(
      `Can't apply fullName regex pattern on filename ${filename}`
    );
  }

  const { groups: { fullName } = { fullName: undefined } } = match;

  if (!fullName) {
    throw new Error(`Can't extract fullName from filename ${filename}`);
  }

  return fullName;
}

function dateFromFilename(filename: string): Date {
  const match = filename.match(/(?<date>\d\d\d\d-\d\d-\d\d)/);

  if (match === null) {
    throw new Error(`Can't apply date regex pattern on filename ${filename}`);
  }

  const { groups: { date } = { date: undefined } } = match;

  if (!date) {
    throw new Error(`Can't extract date from filename ${filename}`);
  }

  return new Date(`${date}T00:00:00`);
}

const Image = defineNestedType(() => ({
  name: "Image",
  fields: {
    src: {
      type: "string",
      required: true,
    },
    alt: {
      type: "string",
      required: true,
    },
    caption: {
      type: "string",
      required: true,
    },
  },
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.md`,
  contentType: "mdx", // using mdx to be able to inject a custom player
  fields: {
    title: {
      type: "string",
      required: true,
    },
    image: {
      type: "nested",
      of: Image,
      required: true,
    },
  },
  computedFields: {
    id: {
      type: "string",
      resolve: (doc) => {
        // eslint-disable-next-line no-underscore-dangle
        const filename = doc._raw.flattenedPath;
        return idFromFilename(filename);
      },
    },
    relativeUrl: {
      type: "string",
      resolve: (doc) => {
        // eslint-disable-next-line no-underscore-dangle
        const filename = doc._raw.flattenedPath;
        return `/${idFromFilename(filename)}`;
      },
    },
    publishedAt: {
      type: "string",
      resolve: (doc) => {
        // eslint-disable-next-line no-underscore-dangle
        const filename = doc._raw.flattenedPath;
        return dateFromFilename(filename).toISOString();
      },
    },
  },
}));

export const Mix = defineDocumentType(() => ({
  name: "Mix",
  filePathPattern: `mixes/**/*.md`,
  contentType: "mdx", // using mdx to be able to inject a custom player
  fields: {
    title: {
      type: "string",
      required: true,
    },
    image: {
      type: "nested",
      of: Image,
      required: true,
    },
    externalUrl: {
      type: "string",
      required: true,
    },
  },
  computedFields: {
    id: {
      type: "string",
      resolve: (doc) => {
        // eslint-disable-next-line no-underscore-dangle
        const filename = doc._raw.flattenedPath;
        return idFromFilename(filename);
      },
    },
    relativeUrl: {
      type: "string",
      resolve: (doc) => {
        // eslint-disable-next-line no-underscore-dangle
        const filename = doc._raw.flattenedPath;
        return `/${idFromFilename(filename)}`;
      },
    },
    publishedAt: {
      type: "string",
      resolve: (doc) => {
        // eslint-disable-next-line no-underscore-dangle
        const filename = doc._raw.flattenedPath;
        return dateFromFilename(filename).toISOString();
      },
    },
  },
}));

const LinkToPlayerTransformer = {
  name: "MusicPlayer",
  shouldTransform() {
    return true;
  },
  getHTML(url: string) {
    return `<player href="${url}"></player>`;
  },
};

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Mix],
  mdx: {
    remarkPlugins: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore default added following this issue @https://github.com/contentlayerdev/contentlayer/issues/326#issuecomment-1365198976
      [remarkLinkPlugin.default, { transformers: [LinkToPlayerTransformer] }],
    ],
  },
  disableImportAliasWarning: true,
});
