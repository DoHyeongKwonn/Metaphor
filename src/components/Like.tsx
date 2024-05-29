import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface LikeButtonProps {
  id: string | undefined;
}

const LikeButton: React.FC<LikeButtonProps> = ({ id }) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "review", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLikes(docSnap.data().likes);
        } else {
          await setDoc(docRef, { likes: 0 });
          setLikes(0);
        }

        if (user) {
          const userLikeDoc = await getDoc(doc(db, "review", id, "likes", user.uid));
          if (userLikeDoc.exists()) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [id, user]);

  const handleLike = async () => {
    if (!id) return;

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const docRef = doc(db, "review", id);
      const userLikeRef = doc(db, "review", id, "likes", user.uid);

      if (liked) {
        await updateDoc(docRef, { likes: increment(-1) });
        await deleteDoc(userLikeRef);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await updateDoc(docRef, { likes: increment(1) });
        await setDoc(userLikeRef, { liked: true });
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="mt-3">
      {/* <button className="like bg-pink-600 font-bold text-gray-300" onClick={handleLike} disabled={!id}>
        {liked ? "Unlike" : "Like"} ({likes})
      </button> */}
      <button className="btn  justify-start flex-grow" onClick={handleLike} disabled={!id}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={liked ? "red" : "none"}
          viewBox="0 0 24 24"
          stroke="red"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {likes}
      </button>
    </div>
  );
};

export default LikeButton;
