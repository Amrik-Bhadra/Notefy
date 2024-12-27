import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal, { setAppElement } from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import toast from "react-hot-toast";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [notes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  //search note
  const onSearch = async (query) => {
    try{
      const response = await axiosInstance.get('/search_note', {
        params: {query},
      });

      if(response?.data){
        setIsSearch(true);
        setAllNotes(response?.data?.notes)
      }else{
        toast.error('No such note available!');
      }
    }catch(error){
      toast.error('Unexpected error');
    }
  }

  // handle delete note
  const handleDeleteNote = async (noteDetails) => {
    try{
      const response = await axiosInstance.delete(`/delete_note/${noteDetails._id}`);
      if(response?.data){
        toast.success(response?.data?.message);
        navigate('/');
      }
    }catch(error){
      toast.error('Note not deleted');
    }
  }

  // handle the pin or unpin of the note
  const handlePinNote = async (noteDetails) => {
    try{
      const response = await axiosInstance.put(`/update_note_pinned/${noteDetails._id}`);
      if(response?.data){
        if(response?.data?.note?.isPinned){
          toast.success('Note Pinned!');
        }else{
          toast.success('Note Unpinned!');
        }
        navigate('/');
      }
    }catch(error){
      toast.error('Note not pinned');
    }
  }

  // handle edit the note
  const handleEdit = (noteDetails) => {
    console.log('Note details: ', noteDetails);
    setOpenAddEditModal({ isShown: true,  type: "edit", data:noteDetails });
  }

  // get user information
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get_user_details");
      // console.log('user info: ', response.data.userData);
      if (response.data && response.data.userData) {
        setUserInfo(response.data.userData);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get all notes data
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get_all_notes");
      console.log(response.data);

      if (response?.data && response?.data?.notes) {
        setAllNotes(response?.data?.notes);
      }
    } catch (error) {
      toast.error("Error in fetching notes");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, [notes]);

  return (
    <div className="font-semibold">
      <Navbar userInfo={userInfo} onSearch={onSearch}/>

      <div className="container px-16 py-6">
        <div className="flex flex-wrap gap-6 mt-4">
          {notes.map((item, index) => (
            <NoteCard
              key={index}
              title= {item.title}
              date={moment(item.createdOn).format('DD MMM, YYYY')}
              content= {item.content}
              tags= {item.tags}
              isPinned={item.isPinned}
              onEdit={() => {handleEdit(item)}}
              onDelete={() => {handleDeleteNote(item)}}
              onPinNote={() => {handlePinNote(item)}}
            />
          ))}
        </div>
      </div>

      {/* button to open add edit note */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:text-[#333] hover:bg-white absolute right-10 bottom-10 drop-shadow-md"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white hover:text-[#333]" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{ overlay: { background: "rgba(0,0,0,0.6)" } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-cardbg rounded-md mx-auto mt-20 p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </div>
  );
};

export default Home;
