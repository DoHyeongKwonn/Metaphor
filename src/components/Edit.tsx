import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function Edit() {
  const { collectionName, id } = useParams<{ collectionName: string; id: string }>();
  const [contents, setContents] = useState<{ title: string; content: string; username: string; time: string } | null>(
    null
  );
  const [isContentLoading, setContentLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      if (collectionName && id) {
        const docRef = doc(db, collectionName, id);
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

  const handleUpdateContent = async (event: React.FormEvent) => {
    event.preventDefault();

    if (collectionName && id && contents) {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          title: contents.title,
          content: contents.content,
        });
        alert("게시글 수정이 완료되었습니다.");
        navigate(`/${collectionName}/${id}`);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContents((prevContents) => {
      if (!prevContents) return null;
      return { ...prevContents, [name]: value };
    });
  };

  if (isContentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bor">
      <form onSubmit={handleUpdateContent}>
        <div className="mb-6">
          <label htmlFor="title" className="writepage block text-lg font-semibold text-gray-800 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={contents?.title || ""}
            onChange={handleChange}
            className="write input-bordered w-full px-4 py-2 rounded-md focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="writepage block text-lg font-semibold text-gray-800 mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            maxLength={4096}
            value={contents?.content || ""}
            onChange={handleChange}
            placeholder="What is happening?!"
            className="write input-bordered w-full px-4 py-2 rounded-md focus:outline-none resize-none h-96"
            rows={6}
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
