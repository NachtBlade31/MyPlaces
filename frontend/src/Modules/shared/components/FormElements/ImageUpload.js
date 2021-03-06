import React,{useRef} from 'react';

import Button from './Button';

import './ImageUpload.css';

const ImageUpload=props=>{

    const filePickerRef=useRef()

    const pickedHandler=event=>{
        console.log(event.target);
    }

    const pickImageHandler=()=>{
        filePickerRef.current.click();
    };

    return <React.Fragment>
        <div className="form-control">
            <input id={props.id} ref={filePickerRef} onChange={pickedHandler} accept=".jpg,.png,.jpeg" style={{display:'none'}} type="file"/>
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    <img src="" alt="Preview"/>
                </div>
                <Button type="button" onClick={pickImageHandler}>Pick Image</Button>
            </div>
        </div>
    </React.Fragment>
}

export default ImageUpload;