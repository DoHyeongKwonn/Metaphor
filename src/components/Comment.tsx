import { auth, db } from "../firebase";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface CommentProps {
  collectionName: string;
  postId: string; //컬렉션 이름이랑 게시글의 ID를 prop으로 받기
}

function Comment({ collectionName, postId }: CommentProps) {
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("로그아웃 상태에서는 작성하실 수 없습니다.");
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
      setContent(""); // 댓글 작성 후 입력창 초기화
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        placeholder="Type your comment here"
        className="input input-bordered w-full pt-3 resize-none overflow-y-auto"
        style={{ height: "150px" }}
        value={content}
        onChange={(e) => setContent(e.target.value)} // 상태 업데이트
      />
      <button type="submit" className=" btn btn-accent float-end" disabled={isLoading}>
        Post
      </button>
    </form>
  );
}
export default Comment;
