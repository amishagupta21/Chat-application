import React, { useState } from 'react'
import addprofile from "../img/addAvatar.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, storage,db } from "../firebase";
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {

    const [err, setErr] = useState(false)
    const navigate=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0]

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    setErr("An error occurred while uploading the avatar. Please try again later.");
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(async (downloadURL) => {
                            await updateProfile(res.user, {
                                displayName,
                                photoURL: downloadURL
                            });
                            await setDoc(doc(db, "users", res.user.uid), {
                                uid: res.user.uid,
                                displayName,
                                email,
                                photoURL: downloadURL
                            });
                            await setDoc(doc(db, "userChats", res.user.uid), {});
                            navigate("/")
                        })
                        .catch((error) => {
                            setErr("An error occurred while updating profile information. Please try again later.");
                        });
                }
            );
        } catch (err) {
            setErr("An error occurred while creating the account. Please try again later.");
        }


    }
    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Chatter</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder='Display Name' />
                    <input type="email" placeholder='email' />
                    <input type="password" placeholder='password' />
                    <input style={{ display: "none" }} type='file' id="file" />
                    <label htmlFor='file'>
                        <img src={addprofile} alt="addprofile" />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>You do have a account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Register
