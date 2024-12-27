import React from 'react'
import { formAvatar } from '../../utils/helper'

const ProfileInfo = ({userInfo, onLogout}) => {
  return (
    <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>{formAvatar(userInfo?.name)}</div>
        <div>
            {/* <p className='text-sm font-medium'>{userInfo?.name}</p> */}
            <button className='text-sm text-white underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfo