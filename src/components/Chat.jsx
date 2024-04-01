import React, { useContext } from 'react'
import Add from "../img/add.png"
import cam from "../img/cam.png"
import more from "../img/more.png"
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
  const {data}=useContext(ChatContext)
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Add} alt="add"/>
          <img src={cam} alt="cam"/>
          <img src={more} alt="more"/>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat
