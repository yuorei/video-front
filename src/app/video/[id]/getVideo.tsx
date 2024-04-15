import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GetVideoQueryData } from '@/app/model/video';


const GET_VIDEO_QUERY = gql`
  query GetVideo($id: ID!) {
    video(id: $id) {
      videoURL
      title
      description
      createdAt
      uploader {
        id
        name
        profileImageURL
      }
    }
  }
`;

export  function getVideo({ params }: { params: { id: string } }) {
  const { loading: videoLoading, error: videoError, data: videoData } = useQuery<GetVideoQueryData>(GET_VIDEO_QUERY, {
    variables: { id: params.id },
  });

    return videoData?.video
}