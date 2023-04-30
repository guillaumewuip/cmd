import { Post } from "@cmd/domain-post";

export const postUrl = (post: Post.Post) => `/post/${post.id}`;
