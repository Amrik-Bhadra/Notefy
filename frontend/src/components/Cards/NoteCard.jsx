import React from 'react'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'
import {Tooltip} from '@mui/material';

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote}) => {
  return (
    <div className='w-96 border rounded p-4 bg-white transition-all ease-in-out'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-lg font-semibold'>{title}</h1>
          <span className='text-xs text-slate-500'>{date}</span>
        </div>

        <MdOutlinePushPin size={22} className={`icon-btn cursor-pointer ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
      </div>
      <p className='text-xs text-slate-600 mt-2'>{content?.slice(0,60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className="text-xs flex flex-wrap gap-x-2 text-primary">{
          tags.map((tag, index)=>(
            <span key={index}>#{tag}</span>
          ))
        }</div>

        <div className='flex items-center gap-x-2'>
        <Tooltip title="Edit">
          <MdCreate className='icon-btn cursor-pointer rounded-full text-[#464646] hover:bg-[#eeeeee] p-[6px] h-8 w-8' onClick={onEdit}/>
        </Tooltip>
        
          <MdDelete className='icon-btn cursor-pointer rounded-full text-[#464646] hover:bg-[#eeeeee] p-[6px] h-8 w-8' onClick={onDelete}/>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
