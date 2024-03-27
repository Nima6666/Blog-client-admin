import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PostCreateForm from "./components/postCreateForm";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../store/slices/posts";
import { authDataActions } from "../store/slices/authData";

export default function Blogs() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [isForm, setIsForm] = useState(false);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const responseDataFromRedux = useSelector((state) => state.postReducer.posts);

  async function getPosts() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            admin: user,
          },
        }
      );

      const responseDataRecieved = await response.data;

      dispatch(postActions.setPosts(responseDataRecieved));
    } catch (err) {
      navigate("/");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  function togglePostForm() {
    setIsForm(true);
  }

  function handlePostClick(event) {
    const index = event.target.id.split("t")[1];
    const id = responseDataFromRedux[index].url;
    navigate(`/blogs/${id}`);
  }

  useEffect(() => {
    getPosts();

    dispatch(authDataActions.setToken(localStorage.getItem("token")));
    dispatch(authDataActions.setUser(localStorage.getItem("user")));
  }, [isForm]);

  return (
    <>
      <>
        <header className="sticky z-10 top-0 flex items-center justify-between shadow-md shadow-blue-950 bg-blue-900 bg-opacity-70 backdrop-blur-sm p-4 pr-20 pl-20">
          <div className="">
            <h1 className="text-2xl text-white">
              Welcome Admin
              <span className="font-bold"> {user}</span>
            </h1>
          </div>
          <div>
            <button
              id="logout"
              className="border border-red-600 rounded-md shadow-md shadow-red-950 p-2 bg-red-400 transition-all hover:shadow-sm hover:shadow-red-950"
              onClick={handleLogout}
            >
              logout
            </button>
          </div>
        </header>
        {responseDataFromRedux && responseDataFromRedux.length < 1 && (
          <h1 className="text-2xl text-center p-5">No Posts Available</h1>
        )}
        {responseDataFromRedux && responseDataFromRedux.length > 0 && (
          <div className="m-9 p-5 grid grid-rows-1 gap-4">
            {responseDataFromRedux.map((data, index) => {
              return (
                <div
                  id={`post${index}`}
                  key={index}
                  className={`relative bg-gray-200 rounded-md shadow-lg p-4 h-36 overflow-hidden duration-300 hover:scale-[1.02] hover:cursor-pointer ${
                    data._doc.published ? "bg-[#c9c9c9]" : ""
                  }`}
                  onClick={(e) => handlePostClick(e)}
                >
                  <h1 className="text-xl font-semibold mb-2 pointer-events-none">
                    {data._doc.title}
                  </h1>
                  <p className="pointer-events-none text-justify">
                    {data._doc.content}
                  </p>
                  <div
                    className={`pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-b from-transparent to-gray-200`}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
        {isForm && <PostCreateForm setIsForm={setIsForm} />}
        <div className="w-100 flex justify-center">
          <button
            id="addPostBtn"
            className="mt-3 mb-5 border border-green-700 rounded-md shadow-md shadow-green-950 p-2 bg-green-400 transition-all hover:shadow-sm hover:shadow-green-950"
            onClick={togglePostForm}
          >
            Add Post
          </button>
        </div>
      </>

      <ToastContainer position="top-center" />
    </>
  );
}
