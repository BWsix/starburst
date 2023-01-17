import fs from "fs";
import { parseFile } from "music-metadata";
import path from "path";
import { createTRPCRouter, publicProcedure } from "../trpc";

function getAllFiles(dirPath: string, arrayOfFiles: string[]) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    const fileStat = fs.statSync(dirPath + "/" + file);

    if (fileStat.isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith("flac") || file.endsWith("mp3")) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

type Album = {
  title: string | undefined;
  artist: string | undefined;
  tracks: Track[];
};

type Track = {
  path: string;
  meta: {
    title?: string | null;
    artist?: string;
    track: {
      no: number | null;
      of: number | null;
    };
    disk: {
      no: number | null;
      of: number | null;
    };
  };
};

async function parseAlbums(arrayOfFiles: string[]) {
  const albums = new Map<string, Album>();

  for (const file of arrayOfFiles) {
    const m = (await parseFile(file)).common;
    const album = m.album as string;
    const meta = {
      title: m.title,
      disk: m.disk,
      track: m.track,
      artist: m.artist,
    } satisfies Track["meta"];

    if (albums.has(album)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tmp = albums.get(album)!;
      tmp.tracks = [...tmp.tracks, { path: file, meta }];
      albums.set(album, tmp);
    } else {
      albums.set(album, {
        title: m.album,
        artist: m.albumartist,
        tracks: [{ path: file, meta }],
      });
    }
  }

  return albums;
}

export const albumRouter = createTRPCRouter({
  all: publicProcedure.query(() => {
    return parseAlbums(getAllFiles("assets", []));
  }),
});
