import React, {useState, useEffect} from 'react';
import axios from 'axios';

const ProgramEdit = ({configurationId, programId, onProgramEditCancel, onProgramEdit}) => {
    const [data, setData] = useState({});
    const [age, setAge] = useState(null);
    const [file, setFile] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    useEffect(() => {
        axios.get(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/programs/${programId}`)
            .then(response => setData(response.data.payload[0]))
            .catch(error => console.error(error));
    }, [configurationId, programId]);

    const handleInputChange = event => {
        const {name, value} = event.target;
        setData(prevData => ({...prevData, [name]: value}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const fetchData = async () => {
            await axios.put(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/programs/${programId}`, {data})
                .catch(error => console.error(error));
        };
        fetchData().then(() => onProgramEdit());
    };
    function handleCancel() {
        onProgramEditCancel();
    }
    function handleChangeAgeRestrictions(event) {
        setAge(0)
        setData(event.target.checked ? prevData => ({...prevData, age_restrictions: 1}) : prevData => ({...prevData, age_restrictions: 0}));
    }
    function handleChangeIsForAdmin(event) {
        setData(event.target.checked ? prevData => ({...prevData, is_for_admin: 1}) : prevData => ({...prevData, is_for_admin: 0}));
    }
    const handleFileIconChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const selectedIcon = event.target.files[0];
            setData(prevData => ({...prevData, icon_path: event.target.files[0].name}));
            const reader = new FileReader();
            reader.onload = () => {
                setFileIcon(reader.result);
            };
            reader.readAsDataURL(selectedIcon);
        };
        input.click();
    };
    const handleFileIconDelete = () => {
        setData(prevData => ({...prevData, icon_path: 'bat.svg'}));
    };
    return (
        <div className={'configuration-elem'}>
            <form onSubmit={handleSubmit} className={'form'}>
                <div className={'cover-editor'}>
                    <div className={'cover icon'}
                         style={{backgroundImage: data.icon_path ? `url(${process.env.PUBLIC_URL}/${data.icon_path})` : `url(${process.env.PUBLIC_URL}/bat.svg)`}}
                    ></div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div className={'icon-mode'} onClick={handleFileIconChange} style={{marginBottom: '8px'}}>
                            <i className={'mdi mdi-pencil-outline'} title={'Редактировать обложку'}></i>
                        </div>
                        <div className={'icon-mode'} onClick={handleFileIconDelete}>
                            <i className={'mdi mdi-trash-can-outline'} title={'Удалить обложку'}></i>
                        </div>
                    </div>
                </div>
                <label className={'label'}>
                    <span>Название программы</span>
                    <input
                        type="text"
                        name="name"
                        value={data.name || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 1 к программе</span>
                    <input
                        type="text"
                        name="path1"
                        value={data.path1 || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 2 к программе</span>
                    <input
                        type="text"
                        name="path2"
                        value={data.path2 || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 3 к программе</span>
                    <input
                        type="text"
                        name="path3"
                        value={data.path3 || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Аргумент командной строки</span>
                    <input
                        type="text"
                        name="args"
                        value={data.args || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Рабочая директория</span>
                    <input
                        type="text"
                        name="work_dir"
                        value={data.work_dir || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
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
                <label className={'label'}>
                    <div style={{display: 'flex'}}>
                        <input type="checkbox" onChange={handleChangeAgeRestrictions} checked={data.age_restrictions === 1} className={'checkbox'}/> Ограничить
                        возрастной контент
                    </div>
                </label>
                {data.age_restrictions === 1 && (
                    <div className={'tabs'}>
                        <div className={`tab info ${age===0 && ('active')}`} onClick={()=>setAge(0)}>0+</div>
                        <div className={`tab info ${age===6 && ('active')}`} onClick={()=>setAge(6)}>6+</div>
                        <div className={`tab info ${age===12 && ('active')}`} onClick={()=>setAge(12)}>12+</div>
                        <div className={`tab info ${age===16 && ('active')}`} onClick={()=>setAge(16)}>16+</div>
                        <div className={`tab info ${age===18 && ('active')}`} onClick={()=>setAge(18)}>18+</div>
                    </div>)}
                <label className={'label'} style={{marginBottom: '16px'}}>
                    <div style={{display: 'flex'}}>
                        <input type="checkbox" onChange={handleChangeIsForAdmin} className={'checkbox'} checked={data.is_for_admin === 1}/> Запускать от имени
                        администратора
                    </div>
                </label>
                <div className={'tabs'}>
                    <div className={'tab info'} onClick={handleCancel}>Отмена</div>
                    <div className={'tab primary'} onClick={handleSubmit}>Сохранить</div>
                </div>
            </form>
        </div>
    );
};

export {ProgramEdit};