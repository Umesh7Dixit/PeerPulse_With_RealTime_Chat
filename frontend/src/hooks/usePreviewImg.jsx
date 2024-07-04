// to show image anywhere the app


import { useState } from 'react'
import useShowToast from '../hooks/useShowToast' 

const usePreviewImg = () => {

    const [imgUrl,setImgUrl] = useState(null);

    const showToast = useShowToast()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // console.log(file);
        // we need only image not any other type like video so we do this
        //using clg of file it get type of file


        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();        // reader js api
            reader.onloadend = () => {
                setImgUrl(reader.result);         //set image
            };
            reader.readAsDataURL(file);
        }else{   //if not an image
            showToast("Invalid file type", "please select an image file","error");
            setImgUrl(null);  //reset image url to null
        }
    }

//   console.log(imgUrl);
  return { handleImageChange, imgUrl }
}

export default usePreviewImg