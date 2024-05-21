import { collection, getDocs, limit, orderBy, query, startAt } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function Board({ boardName }: { boardName: string }) {
  const [posts, setPosts] = useState<{ id: string; title: string; content: string; username: string; time: string }[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 14;
  const [totalPosts, setTotalPosts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchTotalPosts();
  }, []);

  const fetchPosts = async () => {
    const firstPageQuery = query(collection(db, boardName), orderBy("createAt", "desc"), limit(postsPerPage));
    const querySnapshot = await getDocs(firstPageQuery);
    const postsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      username: doc.data().username,
      time: doc.data().createAt.toDate().toLocaleString(),
    }));
    setPosts(postsData);
  };

  const fetchTotalPosts = async () => {
    const querySnapshot = await getDocs(collection(db, boardName));
    setTotalPosts(querySnapshot.size);
  };

  const goToPage = async (pageNumber: number) => {
    let pageQuery;

    if (pageNumber === 1) {
      pageQuery = query(collection(db, boardName), orderBy("createAt", "desc"), limit(postsPerPage));
    } else {
      const startAtDocument = await getStartAtDocumentForPage(pageNumber, postsPerPage);
      pageQuery = query(
        collection(db, boardName),
        orderBy("createAt", "desc"),
        startAt(startAtDocument),
        limit(postsPerPage)
      );
    }

    const querySnapshot = await getDocs(pageQuery);
    const postsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      username: doc.data().username,
      time: doc.data().createAt.toDate().toLocaleString(),
    }));

    setPosts(postsData);
    setCurrentPage(pageNumber);
  };

  async function getStartAtDocumentForPage(pageNumber: number, postsPerPage: number) {
    const skipDocs = (pageNumber - 1) * postsPerPage;
    const pageQuery = query(collection(db, boardName), orderBy("createAt", "desc"), limit(skipDocs + 1));
    const querySnapshot = await getDocs(pageQuery);
    return querySnapshot.docs[querySnapshot.docs.length - 1];
  }

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const currentPageGroup = Math.ceil(currentPage / 5);
  const startPage = (currentPageGroup - 1) * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const handleClick = (id: string) => {
    navigate(`/${boardName}/${id}`);
  };
  return (
    <>
      <div className="board flex justify-center ">
        {/* 가운데 정렬해주는 div를 감싸서  */}
        <div className="bg-oklch pb-4 px-4 rounded-md w-2/3 ">
          <div className="flex justify-between w-full pt-6 ">
            <p className="title ml-3 text-gray-300">게시판</p>
            <svg width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
          </div>
          <div className="w-full flex justify-end px-2 mt-2">
            <div className="w-full sm:w-64 inline-block relative ">
              <input
                type=""
                name=""
                className="leading-snug border border-gray-300 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg"
                placeholder="Search"
              />

              <div className="pointer-events-none absolute pl-3 inset-y-0 left-0 flex items-center px-2 text-gray-300">
                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999">
                  <path d="M508.874 478.708L360.142 329.976c28.21-34.827 45.191-79.103 45.191-127.309C405.333 90.917 314.416 0 202.666 0S0 90.917 0 202.667s90.917 202.667 202.667 202.667c48.206 0 92.482-16.982 127.309-45.191l148.732 148.732c4.167 4.165 10.919 4.165 15.086 0l15.081-15.082c4.165-4.166 4.165-10.92-.001-15.085zM202.667 362.667c-88.229 0-160-71.771-160-160s71.771-160 160-160 160 71.771 160 160-71.771 160-160 160z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr
                  className="rounded-lg text-sm font-medium text-gray-300 text-left"
                  style={{ fontSize: "0.9674rem" }}
                >
                  <th className="px-4 py-2 bg-oklch border-b border-gray-200">Title</th>
                  <th className="px-4 py-2 bg-oklch border-b border-gray-200">Author</th>
                  <th className="px-4 py-2 bg-oklch border-b border-gray-200">Times</th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-300">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-500 border-b border-gray-200 py-10 "
                    onClick={() => handleClick(post.id)}
                  >
                    <td className="px-4 py-4 w-2/3 cursor-pointer">{post.title}</td>
                    <td className="px-4 py-4">{post.username}</td>
                    <td className="px-4 py-4">{post.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex float-end mt-5 pr-">
            <a className="btn write" href={boardName === "contents" ? "/normalWrite" : "spoWrite"}>
              글쓰기
            </a>
          </div>
          <div id="pagination" className="w-full flex justify-center  border-gray-100 pt-4 items-center">
            <svg
              onClick={() => goToPage(currentPage - 1)}
              className="h-6 w-6 cursor-pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 12C9 12.2652 9.10536 12.5196 9.29289 12.7071L13.2929 16.7072C13.6834 17.0977 14.3166 17.0977 14.7071 16.7072C15.0977 16.3167 15.0977 15.6835 14.7071 15.293L11.4142 12L14.7071 8.70712C15.0977 8.31659 15.0977 7.68343 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9.29289 11.2929C9.10536 11.4804 9 11.7348 9 12Z"
                fill="#18A0FB"
              />
            </svg>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                pageNumber >= startPage &&
                pageNumber <= endPage && (
                  <p
                    key={pageNumber}
                    className={`leading-relaxed cursor-pointer mx-2 text-white hover:text-blue-600 text-sm ${
                      pageNumber === currentPage ? "font-bold" : ""
                    } ${pageNumber === currentPage ? "text-blue-600" : ""}`}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </p>
                )
              );
            })}
            <svg
              onClick={() => goToPage(currentPage + 1)}
              className="h-6 w-6 cursor-pointer"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.2929C10.3166 6.9024 9.6834 6.9024 9.2929 7.2929C8.9024 7.6834 8.9024 8.3166 9.2929 8.7071L12.5858 12L9.2929 15.2929C8.9024 15.6834 8.9024 16.3166 9.2929 16.7071C9.6834 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12Z"
                fill="#18A0FB"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
export default Board;
