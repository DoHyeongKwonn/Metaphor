import { doc, collection, getDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import Comment from "./Comment";

function Content() {
  const { boardName, id } = useParams<{ boardName: string; id: string }>();
  const [contents, setContents] = useState<{ title: string; content: string; username: string; time: string } | null>(
    null
  );
  const [comments, setComments] = useState<{ content: string; username: string; time: string }[]>([]);
  const [isContentLoading, setContentLoading] = useState(true);
  const [isCommentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (boardName && id) {
        const docRef = doc(db, boardName, id); // 동적으로 컬렉션 이름을 설정
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContents({
            title: docSnap.data().title,
            content: docSnap.data().content,
            username: docSnap.data().username,
            time: docSnap.data().createAt.toDate().toLocaleString(),
          });
        } else {
          console.log("No such document!");
        }
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [boardName, id]);

  useEffect(() => {
    const fetchComments = () => {
      if (boardName && id) {
        const commentsRef = collection(db, `${boardName}/${id}/comments`);
        const q = query(commentsRef, orderBy("createdAt"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const commentsList: { content: string; username: string; time: string }[] = [];
          querySnapshot.forEach((doc) => {
            commentsList.push({
              content: doc.data().content,
              username: doc.data().username,
              time: doc.data().createdAt.toDate().toLocaleString(),
            });
          });
          setComments(commentsList);
          setCommentsLoading(false);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
      }
    };

    fetchComments();
  }, [boardName, id]);

  if (isContentLoading) {
    return <div>Loading...</div>;
  }
  if (!contents) {
    return <div>No content found</div>;
  }
  if (isCommentsLoading) {
    return <div>Loading comments...</div>;
  }
  if (!boardName || !id) {
    return <div>Error: Missing board name or post ID.</div>;
  }
  return (
    <>
      <div className="board flex justify-center mt-10">
        <div className="pb-4 px-4 w-2/3">
          {contents && (
            <div className="area rounded-lg shadow-md">
              <div className="px-6 py-4 ">
                <h2 className="area text-2xl font-semibold text-gray-800 mb-2">{contents.title}</h2>
                <p className="area text-gray-600 text-sm text-right">글쓴이: {contents.username}</p>
                <p className="area text-gray-600 text-sm text-right">{contents.time}</p>
              </div>
              <div className="px-6 py-4 min-h-28">
                <p className="area text-gray-700">{contents.content}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="commentBox mt-10">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="commentDisplay mb-2">
              <div className="area rounded-lg shadow-md pb-1 min-h-15">
                <div className="px-4 pt-2">{comment.content}</div>
                <div className="px-4 text-right">
                  {comment.username} - {comment.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No comments found</div>
        )}
      </div>
      <div className="comment pb-4 px-4 w-2/3">
        <Comment collectionName={boardName} postId={id} />
      </div>
    </>
  );
}

export default Content;
