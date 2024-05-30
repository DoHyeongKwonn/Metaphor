import { useState, useEffect } from "react";
import { storage, db } from "../firebase"; // Firebase 설정에서 초기화된 Firebase Storage와 Firestore 인스턴스를 가져옵니다.
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function ImageComponent() {
  const { collectionName, id } = useParams<{ collectionName: string; id: string }>();
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL을 저장할 상태 변수

  useEffect(() => {
    const fetchImageFileName = async () => {
      try {
        if (!collectionName || !id) {
          throw new Error("Missing collection name or document ID");
        }

        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data();
          if (docData) {
            const imageFileName = docData.imageFileName;
            if (imageFileName) {
              const storageRef = ref(storage, `${collectionName}/${docData.userId}/${imageFileName}`);
              const url = await getDownloadURL(storageRef);
              setImageUrl(url);
            } else {
              throw new Error("Image file name not found in document");
            }
          } else {
            throw new Error("No data found in document");
          }
        } else {
          throw new Error("Document does not exist");
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    fetchImageFileName();
  }, [collectionName, id]);

  return <div className="ml-12 w-1/3 h-1/3">{imageUrl && <img src={imageUrl} alt="Firebase Image" />}</div>;
}

export default ImageComponent;
