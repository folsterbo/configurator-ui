import React, {useState} from 'react';
import axios from 'axios';

const CourseCreate = ({ configurationId, onCourseCancel, onCourseCreate }) => {
    const [cover_file_path, setCover] = useState('game_cover_default.png');
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    function handleCancel() {
        onCourseCancel();
    }
    const handleFileChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const selectedFile = event.target.files[0];
            setCover(event.target.files[0].name)
            const reader = new FileReader();
            reader.onload = () => {
                setFile(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        };
        input.click();
    };
    const handleFileDelete = () => {
        setCover('game_cover_default.png')
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const good_type_id = 3;
        const good_id = 33;
        const courseData = {data:{description, cover_file_path, good_type_id, good_id}}

        const fetchData = async () => {
            await axios.post(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/goods`, courseData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => onCourseCreate());
    };
    return (
        <div className={'configuration-elem'}>
            <form className={'form'} onSubmit={handleSubmit}>
                <div className={'cover-editor'}>
                    <div className={'cover'}
                         style={{backgroundImage: cover_file_path ? `url(${process.env.PUBLIC_URL}/${cover_file_path})` : `url(${process.env.PUBLIC_URL}/game_cover_default.png)`}}
                    ></div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div className={'icon-mode'} onClick={handleFileChange} style={{marginBottom: '8px'}}>
                            <i className={'mdi mdi-pencil-outline'} title={'Редактировать обложку'}></i>
                        </div>
                        <div className={'icon-mode'} onClick={handleFileDelete}>
                            <i className={'mdi mdi-trash-can-outline'} title={'Удалить обложку'}></i>
                        </div>
                    </div>
                </div>

                <label className={'label'} style={{marginBottom: '16px'}}>
                    <span>Описание</span>
                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className={'input'}
                    />
                </label>

                <div className={'tabs'}>
                    <div className={'tab info'} onClick={handleCancel}>Отмена</div>
                    <div className={'tab primary'} onClick={handleSubmit}>Создать</div>
                </div>
            </form>
        </div>
    );
};

export {CourseCreate};