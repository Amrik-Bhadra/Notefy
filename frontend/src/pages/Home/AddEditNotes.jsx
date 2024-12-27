import React, { useState } from "react";
import TagInput from "../../Components/Pw_Input/TagInput";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddEditNotes = ({ noteData, type, onClose, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  // const [error, setError] = useState(null);

  const navigate = useNavigate();

  //Add New Note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add_notes", {
        title,
        content,
        tags,
      });

      if (response?.data && response?.data?.note) {
        getAllNotes();
        onClose();
        toast.success("Note Added!");
      }
    } catch (error) {
      toast.error("Error while adding note");
    }
  };

  //Edit Note
  const editNote = async () => {
    try {
      const response = await axiosInstance.put(`/edit_notes/${noteData._id}`, {
        title,
        content,
        tags,
      });

      if (response?.data && response?.data?.note) {
        getAllNotes();
        onClose();
        navigate('/')
        toast.success("Note Updated Successfully!");
      }
    } catch (error) {
      toast.error("Error while updating note");
    }
  };

  const handleAddNote = () => {
    if (!title) {
      toast.error("Please enter the Title");
      return;
    }
    if (!content) {
      toast.error("Please enter the Content");
      return;
    }

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-[#eeeeee]"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400 hover:text-slate-900" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label text-white">Title</label>
        <input
          type="text"
          className="text-md outline-none bg-formInput p-2 rounded text-white"
          placeholder=""
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-white">Content</label>
        <textarea
          type="text"
          className="text-sm text-white outline-none bg-formInput p-2 rounded"
          placeholder=""
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className="mt-3">
        <label className="input-label text-white">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* {error && <p className='text-red-500 text-xs pt-4'>{error}</p>} */}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        { (type === 'edit') ? "Update" : "Add" }
      </button>
    </div>
  );
};

export default AddEditNotes;
