import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const CHUNK_SIZE_IN_BYTES = 1000000; // 1 mb

function getStream(req: NextApiRequest, res: NextApiResponse) {
  const path = req.query.id;
  const range = req.headers.range;

  if (typeof path !== "string") {
    return res.status(400).send("Invalid path");
  }
  if (!range) {
    return res.status(400).send("Rang must be provided");
  }

  const videoSizeInBytes = fs.statSync(path).size;
  const chunkStart = Number(range.replace(/\D/g, ""));
  const chunkEnd = Math.min(
    chunkStart + CHUNK_SIZE_IN_BYTES,
    videoSizeInBytes - 1
  );
  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(path, {
    start: chunkStart,
    end: chunkEnd,
  });

  videoStream.pipe(res);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method || "";

  if (method === "GET") {
    return getStream(req, res);
  }

  return res.status(405).json({ error: `Method ${method} is not allowed` });
}
