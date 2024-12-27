import React from 'react'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'
import {Tooltip} from '@mui/material';

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote}) => {
  return (
    <div className='w-96 rounded p-4 bg-cardbg transition-all ease-in-out'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-white mb-2'>{title}</h1>
          <span className='text-xs text-[#eee]'>{date}</span>
        </div>

        <MdOutlinePushPin size={22} className={`icon-btn cursor-pointer ${isPinned ? 'text-primary' : 'text-[#eee]'}`} onClick={onPinNote} />
      </div>
      <p className='text-md text-white mt-2'>{content?.slice(0,60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className="text-xs flex flex-wrap gap-x-2 text-primary">{
          tags.map((tag, index)=>(
            <span key={index}>#{tag}</span>
          ))
        }</div>

        <div className='flex items-center gap-x-2'>
        <Tooltip title="Edit">
          <MdCreate className='icon-btn cursor-pointer rounded-full text-[#ccc] hover:text-[#333] hover:bg-[#eeeeee] p-[6px] h-8 w-8' onClick={onEdit}/>
        </Tooltip>
        
          <MdDelete className='icon-btn cursor-pointer rounded-full text-[#ccc] hover:text-[#333] hover:bg-[#eeeeee] p-[6px] h-8 w-8' onClick={onDelete}/>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
