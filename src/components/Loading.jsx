import React from 'react'

const Loading = () => {
  return (
    <div className="w-full top-0 right-0 h-full absolute bg-slate-50 flex justify-center items-center">
        <div className='spinner absolute flex h-full justify-center items-center gap-1 top-[50%] translate-y-[-50%]'>
            <div className='spinner-item bg-second'></div>
            <div className='spinner-item bg-second'></div>
            <div className='spinner-item bg-second'></div>
            <div className='spinner-item bg-second'></div>
            <div className='spinner-item bg-second'></div>
        </div>
    </div>
  )
}

export default Loading