import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface CommentProps {
  collectionName: string; // 컬렉션 이름을 prop으로 받습니다.
  postId: string; // 게시글의 ID를 prop으로 받습니다.
}

function Comment({ collectionName, postId }: CommentProps) {
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("로그아웃 상태에서는 작성하실 수 없습니다.");
      navigate("/");
      return;
    }
    if (!user || isLoading || content === "" || content.length > 1024) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, `${collectionName}/${postId}/comments`), {
        content,
        createdAt: serverTimestamp(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });

      console.log("Document successfully written!", doc.id);
      setContent(""); // 댓글 작성 후 입력 필드 초기화

      navigate(`/${collectionName}/${postId}`, { state: { needUpdate: true } });
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="Type your comment here"
          className="input input-bordered w-full pt-3 resize-none overflow-y-auto"
          style={{ height: "150px" }}
          value={content} // 값 상태 관리 추가
          onChange={(e) => setContent(e.target.value)} // 상태 업데이트
        />
        <button type="submit" className="push btn btn-primary" disabled={isLoading}>
          Post
        </button>
      </form>
    </div>
  );
}
export default Comment;
