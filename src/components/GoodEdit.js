import React, {useState, useEffect} from 'react';
import axios from 'axios';

const GoodEdit = ({configurationId, goodId, onGoodEditCancel, onGoodEdit}) => {
    const [data, setData] = useState({});
    const [file, setFile] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    useEffect(() => {
        axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/goods/${goodId}`)
            .then(response => setData(response.data.payload[0]))
            .catch(error => console.error(error));
    }, [configurationId, goodId]);

    const handleInputChange = event => {
        const {name, value} = event.target;
        setData(prevData => ({...prevData, [name]: value}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const fetchData = async () => {
            await axios.put(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/goods/${goodId}`, {data})
                .catch(error => console.error(error));
        };
        fetchData().then(() => onGoodEdit());
    };
    function handleCancel() {
        onGoodEditCancel();
    }
    const handleFileChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const selectedFile = event.target.files[0];
            setData(prevData => ({...prevData, cover_file_path: event.target.files[0].name}));
            const reader = new FileReader();
            reader.onload = () => {
                setFile(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        };
        input.click();
    };
    const handleFileDelete = () => {
        setData(prevData => ({...prevData, cover_file_path: 'game_cover_default.png'}));
    };
    return (
        <div className={'configuration-elem'}>
            <form onSubmit={handleSubmit} className={'form'}>
                <div className={'cover-editor'}>
                    <div className={'cover'}
                         style={{backgroundImage: data.cover_file_path ? `url(${process.env.PUBLIC_URL}/${data.cover_file_path})` : `url(${process.env.PUBLIC_URL}/game_cover_default.png)`}}
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
                        name="description"
                        value={data.description || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>

                <div className={'tabs'}>
                    <div className={'tab info'} onClick={handleCancel}>Отмена</div>
                    <div className={'tab primary'} onClick={handleSubmit}>Сохранить</div>
                </div>
            </form>
        </div>
    );
};

export {GoodEdit};