import { auth, db } from "../firebase";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface ReviewProps {
  id: string | undefined;
}

function Review({ id }: ReviewProps) {
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
      const doc = await addDoc(collection(db, `review/${id}/reviews`), {
        // postId에 해당하는 리뷰 컬렉션에 추가
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
    <div className="pl-[440px] pr-[435px]">
      <form onSubmit={onSubmit}>
        <textarea
          placeholder="Type your review here"
          className="input input-bordered w-full pt-3 resize-none overflow-y-auto"
          style={{ height: "150px" }}
          value={content}
          onChange={(e) => setContent(e.target.value)} // 상태 업데이트
        />
        <button type="submit" className="push btn btn-primary" disabled={isLoading}>
          Post
        </button>
      </form>
    </div>
  );
}
export default Review;
