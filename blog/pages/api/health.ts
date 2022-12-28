import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    message: "hello world",
  });
}
