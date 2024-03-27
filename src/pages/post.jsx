import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { postActions } from "../store/slices/posts";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MdPublishedWithChanges } from "react-icons/md";
import { MdUnpublished } from "react-icons/md";
import { GrFormEdit } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { HiArrowSmLeft } from "react-icons/hi";
import PostEditForm from "./components/postEditForm";

export default function Post() {
  const [isForm, setIsForm] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  let theOne = useSelector((state) => state.postReducer.selPost);

  const { id } = useParams();

  async function getSelectedPost() {
    try {
      const responseSelectedPost = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            admin: user,
          },
        }
      );

      dispatch(postActions.setSelPost(responseSelectedPost.data.post));
    } catch (err) {
      console.error(err.response.data.message);
      navigate("/");
    }
  }

  useEffect(() => {
    getSelectedPost();
  }, [isForm]);

  async function handleDelete() {
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVERAPI}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast("deleted");
      navigate("/blogs");
    } else {
      console.error("error deleting post");
    }
  }

  async function handlePublish() {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVERAPI}/posts/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      dispatch(postActions.setSelPost(response.data.updatedOne));
    } else {
      console.error("error updating post");
    }
  }

  function toggleEditForm() {
    setIsForm(true);
  }

  function goBack() {
    navigate("/blogs");
  }

  return (
    <>
      {isForm && <PostEditForm setIsForm={setIsForm} formData={theOne} />}
      <div className="relative bg-gray-200 rounded-md shadow-lg p-8 m-8">
        <HiArrowSmLeft
          className="absolute top-1 left-1 size-7 rounded-full transition-all duration-300 hover:bg-slate-500 hover:cursor-pointer hover:text-white"
          onClick={goBack}
        />
        <div id="iconsED" className="flex justify-end w-[100%]">
          {theOne && theOne.published && (
            <button
              className=" flex items-center m-2 border border-red-600 rounded-md shadow-md shadow-yellow-950 p-2 bg-yellow-500 transition-all hover:shadow-sm hover:shadow-yellow-950"
              onClick={handlePublish}
            >
              Unpublish
              <MdUnpublished className="size-7 " />
            </button>
          )}
          {theOne && !theOne.published && (
            <button
              className="flex items-center m-2  border border-green-700 mt-2 rounded-md shadow-md shadow-green-950 p-2 bg-green-400 transition-all hover:shadow-sm hover:shadow-green-950"
              onClick={handlePublish}
            >
              Publish
              <MdPublishedWithChanges className="size-7 " />
            </button>
          )}
          <button
            className="flex items-center m-2  border border-green-700 mt-2 rounded-md shadow-md shadow-green-950 p-2 bg-green-400 transition-all hover:shadow-sm hover:shadow-green-950"
            onClick={toggleEditForm}
          >
            Edit
            <GrFormEdit className="size-7 " />
          </button>
          <button
            className=" flex items-center m-2 border border-red-600 rounded-md shadow-md shadow-red-950 p-2 bg-red-400 transition-all hover:shadow-sm hover:shadow-red-950"
            onClick={handleDelete}
          >
            Delete
            <MdDeleteOutline className="size-7" />
          </button>
        </div>
        <h1 className="font-bold text-xl mb-2">{theOne.title}</h1>
        <p className="text-justify">{theOne.content}</p>
      </div>
      <ToastContainer />
    </>
  );
}
