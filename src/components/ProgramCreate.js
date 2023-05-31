import React, { useState } from 'react';
import axios from 'axios';

const ProgramCreate = ({ configurationId, onProgramCancel, onProgramCreate }) => {
    const [name, setName] = useState('');
    const [icon_path, setIcon] = useState('bat.svg');
    const [file, setFile] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    const [path1, setPath1] = useState('');
    const [path2, setPath2] = useState('');
    const [path3, setPath3] = useState('');
    const [args, setProgramArgs] = useState('');
    const [work_dir, setProgramWorkDir] = useState('');
    const [description, setProgramDescription] = useState('');
    const [age_restrictions, setAgeRestrictions] = useState(0);
    const [is_for_admin, setIsForAdmin] = useState(0);
    const [age, setAge] = useState(null);
    const [program_type_id, setProgramTypeId] = useState(1);
    const handleSubmit = (event) => {
        event.preventDefault();
        const programData = {data:{name, path1, path2, path3, args, work_dir, description, age_restrictions, is_for_admin, icon_path, program_type_id}}

        const fetchData = async () => {
            await axios.post(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/programs`, programData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => onProgramCreate());
        setProgramTypeId(configurationId);
    };
    function handleChangeAgeRestrictions(event) {
        setAge(0)
        setAgeRestrictions(event.target.checked ? 1 : 0);
    }
    function handleChangeIsForAdmin(event) {
        setIsForAdmin(event.target.checked ? 1 : 0);
    }
    function handleCancel() {
        onProgramCancel();
    }
    const handleFileIconChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const selectedIcon = event.target.files[0];
            setIcon(event.target.files[0].name)
            const reader = new FileReader();
            reader.onload = () => {
                setFileIcon(reader.result);
            };
            reader.readAsDataURL(selectedIcon);
        };
        input.click();
    };
    const handleFileIconDelete = () => {
        setIcon('bat.svg')
    };
    return (
        <div className={'configuration-elem'}>
            <form onSubmit={handleSubmit} className={'form'}>
                <div className={'cover-editor'}>
                    <div className={'cover icon'}
                         style={{backgroundImage: icon_path ? `url(${process.env.PUBLIC_URL}/${icon_path})` : `url(${process.env.PUBLIC_URL}/bat.svg)`}}
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
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 1 к программе</span>
                    <input
                        type="text"
                        value={path1}
                        onChange={(event) => setPath1(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 2 к программе</span>
                    <input
                        type="text"
                        value={path2}
                        onChange={(event) => setPath2(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 3 к программе</span>
                    <input
                        type="text"
                        value={path3}
                        onChange={(event) => setPath3(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Аргумент командной строки</span>
                    <input
                        type="text"
                        value={args}
                        onChange={(event) => setProgramArgs(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Рабочая директория</span>
                    <input
                        type="text"
                        value={work_dir}
                        onChange={(event) => setProgramWorkDir(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'} style={{marginBottom: '16px'}}>
                    <span>Описание</span>
                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setProgramDescription(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <div style={{display: 'flex'}}>
                        <input type="checkbox" onChange={handleChangeAgeRestrictions} className={'checkbox'}/> Ограничить возрастной контент
                    </div>
                </label>
                {age_restrictions === 1 && (
                    <div className={'tabs'}>
                        <div className={`tab info ${age===0 && ('active')}`} onClick={()=>setAge(0)}>0+</div>
                        <div className={`tab info ${age===6 && ('active')}`} onClick={()=>setAge(6)}>6+</div>
                        <div className={`tab info ${age===12 && ('active')}`} onClick={()=>setAge(12)}>12+</div>
                        <div className={`tab info ${age===16 && ('active')}`} onClick={()=>setAge(16)}>16+</div>
                        <div className={`tab info ${age===18 && ('active')}`} onClick={()=>setAge(18)}>18+</div>
                    </div>)}
                <label  className={'label'} style={{marginBottom: '16px'}}>
                    <div style={{display: 'flex'}}>
                        <input type="checkbox" onChange={handleChangeIsForAdmin} className={'checkbox'}/> Запускать от имени администратора
                    </div>
                </label>
                <div className={'tabs'}>
                    <div className={'tab info'} onClick={handleCancel}>Отмена</div>
                    <div className={'tab primary'} onClick={handleSubmit}>Создать</div>
                </div>
            </form>
        </div>
    );
};

export {ProgramCreate};