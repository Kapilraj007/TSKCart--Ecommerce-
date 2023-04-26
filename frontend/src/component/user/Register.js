import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../../actions/userActions";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Register () {
    const [userData, setUserData] = useState({
        name:"",
        email:"",
        password:"",
    });
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png")
    const dispatch = useDispatch();
    const {loading, error, isAuthenticated} = useSelector(state => state.authState)
    const navigate = useNavigate();

    const onChange = (e) =>{
        if(e.target.name === 'avatar'){
            const reader = new FileReader(); //nama use panna data eduthu vachukum entha filereader
            reader.onload = () =>{ //data read panni mudicha piraka onload function  call pannum
                if(reader.readyState === 2){ //readyState na file read panni mudichutha illia nu check pannum
                   setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0])
                }
            }
            reader.readAsDataURL(e.target.files[0])//file oda data va url ha eduthu vachukum
        }else{

            setUserData({...userData,[e.target.name]:e.target.value})
        }
    }
    const submitHander = (e) =>{
        e.preventDefault();
        const formData = new FormData();//js class input ku ethaa marri values ha kuldukula
        formData.append('name', userData.name)
        formData.append('email', userData.email)
        formData.append('password', userData.password)
        formData.append('avatar', avatar)
        dispatch(register(formData))
    }
    useEffect(()=>{
        if(isAuthenticated){
            navigate('/');
            return
        }
        if(error){
            toast(error, {
              position:toast.POSITION.BOTTOM_CENTER,
              type:'error',
              onOpen:()=>{ dispatch(clearAuthError) }
            })
            return
        }
    },[error,isAuthenticated,dispatch,navigate])
    return(
        <div className="container container-fluid">
             <div className="row wrapper">
		        <div className="col-10 col-lg-5">
                    <form onSubmit={submitHander} className="shadow-lg" encType='multipart/form-data'>
                      <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                           <label htmlFor="email_field">Name</label>
                           <input name="name" onChange={onChange} id="name_field" className="form-control" />
                         </div>

                        <div className="form-group">
                           <label htmlFor="email_field">Email</label>
                            <input
                               
                                name="email"
                                onChange={onChange}
                                id="email_field"
                                className="form-control"
                               
                            />
                        </div>
  
                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                
                                id="password_field"
                                name="password"
                                onChange={onChange}
                                className="form-control"
                               
                            />
                         </div> 

                         <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        onChange={onChange}
                                        className='custom-file-input'
                                        id='customFile'
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                 </div>
                                 </div>
                             </div>
  
                           <button
                                id="register_button"
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                                >
                                REGISTER
                           </button>
                     </form>
		         </div>
             </div>
        </div>
    )
}