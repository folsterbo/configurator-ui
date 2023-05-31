import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from "react-select";

const GameCreate = ({ configurationId, onGameCancel, onGameCreate }) => {
    const [name, setName] = useState('');
    const [cover_img_path, setCover] = useState('game_cover_default.png');
    const [icon_path, setIcon] = useState('bat.svg');
    const [file, setFile] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    const [path1, setPath1] = useState('');
    const [path2, setPath2] = useState('');
    const [path3, setPath3] = useState('');
    const [args, setGameArgs] = useState('');
    const [work_dir, setGameWorkDir] = useState('');
    const [description, setGameDescription] = useState('');
    const [age_restrictions, setAgeRestrictions] = useState(0);
    const [is_for_admin, setIsForAdmin] = useState(0);
    const [age, setAge] = useState(null);
    const [gameTypes, setGameTypes] = useState({});
    const [game_type_id, setGameTypeId] = useState(1);
    const handleSubmit = (event) => {
        event.preventDefault();
        const gameData = {data:{name, path1, path2, path3, args, work_dir, description, age_restrictions, is_for_admin, cover_img_path, icon_path, game_type_id}}

        const fetchData = async () => {
            await axios.post(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games`, gameData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => onGameCreate());
    };
    function handleChangeAgeRestrictions(event) {
        setAgeRestrictions(0)
        setAge(event.target.checked ? 1 : 0);
    }
    function handleChangeIsForAdmin(event) {
        setIsForAdmin(event.target.checked ? 1 : 0);
    }
    function handleCancel() {
        onGameCancel();
    }
    function handleChooseTypeGame(selectedOption) {
        if (selectedOption.value === 'rpg') {
            setGameTypeId(1);
        } else if (selectedOption.value === 'strategy') {
            setGameTypeId(2);
        } else {
            setGameTypeId(3);
        }
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
    const handleFileIconDelete = () => {
        setCover('bat.svg')
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://dcc4.langame.ru/configurator-api/api/v1/shell/references/game_types');
                handleOptions(response.data.items)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().then();
    }, []);
    const handleOptions = (items) => {
        const options = items.map(item => ({
            label: item.description,
            value: item.type,
        }));
        setGameTypes(options)
    };
    return (
        <div className={'configuration-elem'}>
            <form onSubmit={handleSubmit} className={'form'}>
                        <div className={'cover-editor'}>
                            <div className={'cover'}
                                 style={{backgroundImage: cover_img_path ? `url(${process.env.PUBLIC_URL}/${cover_img_path})` : `url(${process.env.PUBLIC_URL}/game_cover_default.png)`}}
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
                <div style={{marginBottom: '8px'}}>
                    <Select options={gameTypes} placeholder="Тип игры" onChange={handleChooseTypeGame}></Select>
                </div>
                <label className={'label'}>
                    <span>Название игры</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 1 к игре</span>
                    <input
                        type="text"
                        value={path1}
                        onChange={(event) => setPath1(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 2 к игре</span>
                    <input
                        type="text"
                        value={path2}
                        onChange={(event) => setPath2(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 3 к игре</span>
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
                        onChange={(event) => setGameArgs(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Рабочая директория</span>
                    <input
                        type="text"
                        value={work_dir}
                        onChange={(event) => setGameWorkDir(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'} style={{marginBottom: '16px'}}>
                    <span>Описание</span>
                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setGameDescription(event.target.value)}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <div style={{display: 'flex'}}>
                        <input type="checkbox" onChange={handleChangeAgeRestrictions} className={'checkbox'}/> Ограничить возрастной контент
                    </div>
                </label>
                {age === 1 && (
                    <div className={'tabs'}>
                        <div className={`tab info ${age_restrictions===1 && ('active')}`} onClick={()=>setAgeRestrictions(1)}>0+</div>
                        <div className={`tab info ${age_restrictions===6 && ('active')}`} onClick={()=>setAgeRestrictions(6)}>6+</div>
                        <div className={`tab info ${age_restrictions===12 && ('active')}`} onClick={()=>setAgeRestrictions(12)}>12+</div>
                        <div className={`tab info ${age_restrictions===16 && ('active')}`} onClick={()=>setAgeRestrictions(16)}>16+</div>
                        <div className={`tab info ${age_restrictions===18 && ('active')}`} onClick={()=>setAgeRestrictions(18)}>18+</div>
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

export {GameCreate};