import { Accordion, ActionIcon, List } from "@mantine/core";
import { IconHeadphones, IconPlayerPlay } from "@tabler/icons";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const useAlbumQuery = api.album.groupByArtist.useQuery();
  const albums = Array.from(useAlbumQuery.data?.entries() || []);

  const [id, setId] = useState("");

  return (
    <>
      <Head>
        <title>Music Library</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <audio src={`/api/stream?id=${id}`} controls autoPlay />

      <Accordion>
        {albums.map(([artist, albums]) => (
          <>
            <Accordion.Item value={artist}>
              <Accordion.Control>{artist}</Accordion.Control>
              <Accordion.Panel>
                {albums.map((album) => (
                  <>
                    <Accordion>
                      <Accordion.Item value={album.title || "N/A"}>
                        <Accordion.Control>{album.title}</Accordion.Control>
                        <Accordion.Panel>
                          <List>
                            {album.tracks.map((track) => (
                              <>
                                <List.Item
                                  icon={
                                    <ActionIcon
                                      onClick={() => setId(track.path)}
                                      disabled={id === track.path}
                                    >
                                      {id === track.path ? (
                                        <IconHeadphones />
                                      ) : (
                                        <IconPlayerPlay />
                                      )}
                                    </ActionIcon>
                                  }
                                >
                                  {track.meta.title}
                                </List.Item>
                              </>
                            ))}
                          </List>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </>
        ))}
      </Accordion>
    </>
  );
};

export default Home;
