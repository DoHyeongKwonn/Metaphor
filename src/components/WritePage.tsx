import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

interface WritePageProps {
  collectionName: string; // 컬렉션 이름을 prop으로 받습니다.
}

function WritePage({ collectionName }: WritePageProps) {
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFileURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onClick = () => {
    setFileURL(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("로그아웃 상태에서는 작성하실 수 없습니다.");
      navigate("/login");
      return;
    }
    if (!user || isLoading || content === "" || content.length > 4096) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, collectionName), {
        // prop으로 받은 collectionName 사용
        title,
        content,
        createAt: serverTimestamp(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `${collectionName}/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      console.log("Document successfully written!");
      navigate(collectionName === "spoils" ? "/spoils" : "/contents");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bor">
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="writepage block text-lg font-semibold text-gray-800 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={onTitleChange}
            value={title}
            className="write input-bordered w-full px-4 py-2 rounded-md focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="writepage block text-lg font-semibold text-gray-800 mb-1">
            Content
          </label>
          <textarea
            onChange={onChange}
            maxLength={4096}
            value={content}
            placeholder="what is happening?!"
            className="write input-bordered w-full px-4 py-2 rounded-md focus:outline-none resize-none h-96"
            rows={6}
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label
            htmlFor="image"
            className="upload px-5 py-2 font-semibold text-white cursor-pointer mb-1 rounded-md bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
          >
            {file ? "Image added" : "Add Image"}
          </label>

          <input
            type="file"
            onChange={onFileChange}
            id="image"
            name="image"
            accept="image/*"
            className="w-full hidden"
          />
          {fileURL && (
            <div className="relative mt-4 pt-5">
              <button className="deleteImage btn btn-circle bg-current absolute top-0 left-72 z-10 " onClick={onClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="red"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img src={fileURL} alt="Selected" className="max-h-80 max-w-80 pr-2" />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WritePage;
