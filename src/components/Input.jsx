import React, { useContext, useState } from 'react'
import Attach from "../img/attach.png"
import Img from "../img/img.png"
import { AuthContext } from '../context/AuthContent'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'


const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          // Handle upload error
          console.error('Error uploading image:', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateChat(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        }
      );
    } else {
      await updateChat();
    }
     await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp()
     });
     await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp()
     });

    setText('');
    setImg(null);
  };

  const updateChat = async (downloadURL = null) => {
    const message = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (downloadURL) {
      message.img = downloadURL;
    }

    try {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion(message),
      });
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  };
  
  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e => setText(e.target.value)} value={text}/>
      <div className="send">
        <img src={Attach} alt='attach' />
        <input type='file' style={{ display: "none" }} id="file" onChange={e => setImg(e.target.files[0])} />
        <label htmlFor='file'>
          <img src={Img} alt='img' />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input
