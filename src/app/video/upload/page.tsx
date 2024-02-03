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
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    if (name === 'thumbnailImage' && files) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
    } else if (name === 'video' && files) {
      const file = files[0];
      setVideoPreview(URL.createObjectURL(file));
    }
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
      let errorSting = error as string
      console.log(errorSting)
      if (errorSting == "ApolloError: id is nil") {
        // /loginに移動
        alert("再度ログインしてください")
        window.location.href = '/login';
        return
      }
      alert(errorSting)
      console.error('アップロードエラー:', errorSting == "ApolloError: id is nil");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-white text-center mb-4">ビデオアップロード</h1>
        <div>
          <div className="mb-4">
            <input
              type="file"
              accept="video/*"
              name="video"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleInputChange}
            />
            {videoPreview && (
              <video src={videoPreview} className="mt-4 w-full" controls />
            )}
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              name="thumbnailImage"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={handleInputChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="プロファイル画像プレビュー" className="mt-4  object-cover " />
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="タイトル"
              name="title"
              value={formData.title}
              className="block w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="説明"
              name="description"
              value={formData.description}
              className="block w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white"
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={handleUpload}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:bg-blue-700"
          >
            アップロード
          </button>
        </div>
      </div>
    </div>
  );
}
