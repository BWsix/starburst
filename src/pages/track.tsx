/* eslint-disable @typescript-eslint/require-await */
import { type GetServerSideProps, type NextPage } from "next";
import { useRouter } from "next/router";

const Track: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  return (
    <>
      <video src={`/api/stream?id=${id}`} controls />
    </>
  );
};

export default Track;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.query },
  };
};
