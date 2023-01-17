import {
  Accordion,
  ActionIcon,
  Container,
  List,
  Navbar,
  ScrollArea,
} from "@mantine/core";
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
        <title>VFLC&#39;s Music Library</title>
        <meta name="description" content="Take your time." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container sx={{ height: "100%" }}>
        <Navbar withBorder={false}>
          <Navbar.Section grow component={ScrollArea}>
            {useAlbumQuery.isLoading && (
              <div>
                Loading... (LOWER YOUR VOLUME BEFORE PLAYING ANY TRACKS!!!)
              </div>
            )}

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
                              <Accordion.Control>
                                {album.title}
                              </Accordion.Control>
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
          </Navbar.Section>
          <Navbar.Section>
            <audio
              src={`/api/stream?id=${id}`}
              controls
              autoPlay
              style={{ width: "100%" }}
            />
          </Navbar.Section>
        </Navbar>
      </Container>
    </>
  );
};

export default Home;
