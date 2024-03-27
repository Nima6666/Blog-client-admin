import axios from "axios";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

export default function PostEditForm({ setIsForm, formData }) {
  const token = localStorage.getItem("token");

  const { id } = useParams();

  const [postTitle, setPostTitle] = useState(formData.title);
  const [postContent, setPostContent] = useState(formData.content);

  function handleFormCross() {
    setIsForm(false);
  }

  async function handlePostEdit(event) {
    event.preventDefault();

    const formData = {
      title: postTitle,
      content: postContent,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast("Post Edited");
        setIsForm(false);
      }
    } catch (error) {
      console.error("Error Editing:", error);
    }
  }

  return (
    <>
      <div
        className="h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-40 backdrop-blur-sm z-[15]"
        onClick={handleFormCross}
      ></div>
      <form
        action="post"
        className="z-[20] min-h-60 min-w-96 flex flex-col rounded-lg bg-slate-100 justify-around align-middle p-5 border shadow-2xl border-gray-500  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h1 className="text-lg self-center mb-2">Edit Post</h1>
        <label htmlFor="title" className="flex flex-col">
          Title
          <input
            type="text"
            name="title"
            id="title"
            className="border-2 border-green-500 rounded-md mt-2 p-1 pl-2 pr-2 transition focus:bg-slate-300"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </label>
        <label htmlFor="content" className="flex flex-col mt-2">
          Content
          <textarea
            type="text"
            name="content"
            id="content"
            className="border-2 h-40 resize-none border-green-500 rounded-md mt-2 p-1 pl-2 pr-2 transition focus:bg-slate-300"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </label>
        <button
          className="border border-green-700 w-1/2 self-center mt-2 rounded-md shadow-md shadow-green-950 p-2 bg-green-400 transition-all hover:shadow-sm hover:shadow-green-950"
          onClick={handlePostEdit}
        >
          Save
        </button>
        <BiX
          className=" rounded-full absolute top-3 right-3 scale-150 text-gray-500 transition-all hover:text-red-900 hover:bg-red-300 hover:cursor-pointer"
          onClick={handleFormCross}
        />
      </form>
    </>
  );
}

PostEditForm.propTypes = {
  setIsForm: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};
