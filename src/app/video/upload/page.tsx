'use client'
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const UPLOAD_VIDEO_MUTATION = gql`
  mutation UploadVideo($input: UploadVideoInput!) {
    UploadVideo(input: $input) {
      id
      videoURL
      title
      thumbnailImageURL
      description
      createdAt
      updatedAt
      uploader {
        id
        name
      }
    }
  }
`;

export default function Page() {
  const [uploadVideo] = useMutation(UPLOAD_VIDEO_MUTATION);
  const [formData, setFormData] = useState({
    video: null,
    thumbnailImage: null,
    title: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleUpload = async () => {
    try {
      const { data } = await uploadVideo({
        variables: {
          input: {
            video: formData.video,
            thumbnailImage: formData.thumbnailImage,
            title: formData.title,
            description: formData.description,
          },
        },
        context: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      });

      console.log('アップロード成功:', data);
    } catch (error) {
      console.error('アップロードエラー:', error);
    }
  };

  return (
    <div>
      <h1>ビデオアップロード</h1>
      <input
        type="file"
        accept="video/*"
        name="video"
        onChange={handleInputChange}
      />
      <input
        type="file"
        accept="image/*"
        name="thumbnailImage"
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="タイトル"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="説明"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <button onClick={handleUpload}>アップロード</button>
    </div>
  );
}
