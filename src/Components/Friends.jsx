import React from 'react'

const Friends = ({name,  photoUrl,refToClickedPeople,setRefToClickedPeople,id}) => {
  return (
    
        <div className={`one-friend ${(refToClickedPeople && refToClickedPeople.toString() === id)? "one-friend-on-click" : ""}`}  onClick={(e) => {
             setRefToClickedPeople(id);
        }}>
            <img src={photoUrl} alt="" />
            <div className='one-friend-right-side'>
                <div className='friend-name'>{name}</div>
                {/* <div className='friend-chat'>{lastChat}</div> */}
            </div>
        </div>
  )
}

export default Friends