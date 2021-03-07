import React,{useRef,useState} from 'react';

import Button from './Button';

import './ImageUpload.css';

const ImageUpload=props=>{

    const [previewUrl,setPreviewUrl]=useState();
    const [isValid,setIsValid]=useState(false);
    const filePickerRef=useRef();

    const pickedHandler=event=>{
        let pickedFile
        let fileIsValid =isValid;
       if( event.target.files|| event.target.files.lenght===1 ){
            setPreviewUrl(URL.createObjectURL(event.target.files[0]));
            pickedFile=event.target.files[0];
            setIsValid(true);
            fileIsValid=true;
       }
       else{
        setIsValid(false)
        fileIsValid=false;
       }
       props.onInput(props.id,pickedFile,fileIsValid)
      
    }

    const pickImageHandler=()=>{
        filePickerRef.current.click();
    };

    return <React.Fragment>
        <div className="form-control">
            <input id={props.id} ref={filePickerRef} onChange={pickedHandler} accept=".jpg,.png,.jpeg" style={{display:'none'}} type="file"/>
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl &&<img src={previewUrl} alt="Preview"/>}
                    {!previewUrl &&  <p>Please Pick and Image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>Pick Image</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    </React.Fragment>
}

export default ImageUpload;