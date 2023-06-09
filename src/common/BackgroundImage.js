import React, {useState} from 'react';
import axios from "axios";

const BackgroundImage = ({ onChangeBackground, configurationId }) => {
    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('wallpaper', file);
        axios.post(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/desktops`, formData)
            .then((response) => {
                onChangeBackground(response.data.payload['img_path']);
                console.log(response.data.payload['img_path'])
            })
            .catch((error) => console.error(error));
    };
    /*const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('wallpaper', file);

        fetch(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/desktops`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.error(error));
        setBackground(data.payload.img_path
        console.log(background)
    };*/
    /*const handleButtonClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                localStorage.setItem('background', reader.result);
                onChange(reader.result);
            };
        };
        input.click();
    };*/
    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
        /*<div onClick={handleButtonClick} className={'icon-mode'}>
            <i className={'mdi mdi-monitor-screenshot'} title={'Обои рабочего стола'}></i>
        </div>*/
    );
};

export {BackgroundImage};