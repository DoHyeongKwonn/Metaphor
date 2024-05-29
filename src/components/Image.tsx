import { useState, useEffect } from "react";
import { storage } from "../firebase"; // Firebase 설정에서 초기화된 Firebase Storage 인스턴스를 가져옵니다.
import { getDownloadURL, ref } from "firebase/storage";
import { useParams } from "react-router-dom";

function ImageComponent() {
  const { boardName, id } = useParams<{ boardName: string; id: string }>();
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL을 저장할 상태 변수

  useEffect(() => {
    // 이미지 다운로드 함수
    const fetchImage = async () => {
      try {
        // Storage에 저장된 이미지의 경로 설정
        const storageRef = ref(storage, `${boardName}/${id}/`); // 여기서 'images/example.jpg'는 실제 이미지의 경로입니다.

        // 이미지 다운로드 URL 가져오기
        const url = await getDownloadURL(storageRef);

        // 상태 변수에 이미지 URL 설정
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    // 이미지 다운로드 함수 호출
    fetchImage();
  }, [boardName, id]); // 컴포넌트가 마운트될 때 한 번만 실행됩니다.

  return (
    <div>
      {/* 이미지 URL이 존재하는 경우 이미지를 표시합니다. */}
      {imageUrl && <img src={imageUrl} alt="Firebase Image" />}
    </div>
  );
}

export default ImageComponent;
//보류
