import { doc, collection, getDoc, query, onSnapshot, orderBy, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "./Comment";
// import ImageComponent from "./Image";

function Content() {
  const { collectionName, id } = useParams<{ collectionName: string; id: string }>();
  const [contents, setContents] = useState<{ title: string; content: string; username: string; time: string } | null>(
    null
  );
  const [comments, setComments] = useState<
    {
      [x: string]: string;
      content: string;
      username: string;
      time: string;
    }[]
  >([]);
  const [isContentLoading, setContentLoading] = useState(true);
  const [isCommentsLoading, setCommentsLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;
  useEffect(() => {
    const fetchContent = async () => {
      if (collectionName && id) {
        const docRef = doc(db, collectionName, id); // 동적으로 컬렉션 이름을 설정
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
  }, [collectionName, id]);

  const handleDeleteContent = async () => {
    try {
      if (collectionName && id) {
        // 해당 게시물의 DocumentReference 가져오기
        const docRef = doc(db, collectionName, id);

        // 해당 DocumentReference를 사용하여 문서 삭제
        await deleteDoc(docRef);

        // 삭제 후 필요한 작업 수행 (예: 리다이렉션 등)
        navigate(`/${collectionName}`);
        alert("게시글이 삭제되었습니다.");
      } else {
        console.log("Missing collection name or document ID");
      }
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    const fetchComments = () => {
      if (collectionName && id) {
        const commentsRef = collection(db, `${collectionName}/${id}/comments`);
        const q = query(commentsRef, orderBy("createdAt"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const commentsList: { content: string; username: string; time: string; id: string }[] = [];
          querySnapshot.forEach((doc) => {
            commentsList.push({
              content: doc.data().content,
              username: doc.data().username,
              time: doc.data().createdAt.toDate().toLocaleString(),
              id: doc.id,
            });
          });
          setComments(commentsList);
          setCommentsLoading(false);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
      }
    };

    fetchComments();
  }, [collectionName, id]);
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, `${collectionName}/${id}/comments`, commentId));
      alert("댓글이 삭제되엇습니다.");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  const goToEdit = () => {
    collectionName === "contents" ? navigate(`/contents/${id}/edit`) : navigate(`/spoils/${id}/edit`);
  };

  if (isContentLoading) {
    return <div>Loading...</div>;
  }
  if (!contents) {
    return <div>No content found</div>;
  }
  if (isCommentsLoading) {
    return <div>Loading comments...</div>;
  }
  if (!collectionName || !id) {
    return <div>Error: Missing board name or post ID.</div>;
  }
  return (
    <>
      <div className="board flex justify-center mt-10">
        <div className="pb-4 px-4 w-2/3">
          {/* <div>
            <ImageComponent />
          </div> */}
          {contents && (
            <div className="area rounded-lg shadow-md">
              <div className="px-6 py-4 flex justify-between">
                <h2 className="area text-2xl font-semibold text-gray-800 mb-2">{contents.title}</h2>
                <div>
                  <p className="area text-gray-600 text-sm text-right">글쓴이: {contents.username}</p>
                  <p className="area text-gray-600 text-sm text-right">{contents.time}</p>
                </div>
              </div>
              <div className="px-6 py-4 min-h-28">
                <p className="area text-gray-700">{contents.content}</p>
              </div>
              {user !== null && user.displayName === contents.username && (
                <div className="flex px-6 py-4 justify-end">
                  <button className="btn btn-primary text-white px-4 py-2 rounded mx-2" onClick={goToEdit}>
                    수정
                  </button>
                  <button
                    className="btn btn-primary text-white px-4 py-2 rounded mx-2 hover:bg-red-600 hover:border-red-600 hover:text-zinc-50"
                    onClick={handleDeleteContent}
                  >
                    삭제
                  </button>
                </div>
              )}
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
                  {user !== null && user.displayName === comment.username && (
                    <button
                      className="btn btn-circle w-[24px] h-[24px] ml-[16px]"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="pl-2 my-2">등록된 댓글이 없습니다.</div>
        )}
      </div>
      <div className="comment pb-4 px-4 w-2/3">
        <Comment collectionName={collectionName} postId={id} />
      </div>
    </>
  );
}

export default Content;
