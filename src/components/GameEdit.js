import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Select from "react-select";

const GameEdit = ({configurationId, gameId, onGameEditCancel, onGameEdit}) => {
    const [data, setData] = useState({});
    const [file, setFile] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    const [age_restrictions, setAgeRestrictions] = useState(0);
    const [gameTypes, setGameTypes] = useState({});
    const [defaultOption, setDefaultOption] = useState({});
    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games/${gameId}`);
                    setData(response.data.payload[0])
                    setAgeRestrictions(response.data.payload[0].age_restrictions)
                    const game_type_id = response.data.payload[0].game_type_id
                    if (game_type_id === 1) {
                        setDefaultOption({label: 'RPG', value: 'rpg'});
                    } else if (game_type_id === 2) {
                        setDefaultOption({label: 'Стратегия', value: 'strategy'});
                    } else {
                        setDefaultOption({label: 'Стрелялка', value: 'shooter'});
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData().then();
    }, [configurationId, gameId]);
    const handleInputChange = event => {
        const {name, value} = event.target;
        setData(prevData => ({...prevData, [name]: value}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const fetchData = async () => {
            await axios.put(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${configurationId}/games/${gameId}`, {data} )
                .catch(error => console.error(error));
        };
        fetchData().then(() => onGameEdit());
    };
    function handleCancel() {
        onGameEditCancel();
    }
    function handleChangeAge(event) {
        setData(event.target.checked ? prevData => ({...prevData, age_restrictions: 1}) : prevData => ({...prevData, age_restrictions: 0}));
    }
    function handleChangeAgeRestrictions(event) {
        setAgeRestrictions(event)
        setData(prevData => ({...prevData, age_restrictions: event}));
    }
    function handleChangeIsForAdmin(event) {
        setData(event.target.checked ? prevData => ({...prevData, is_for_admin: 1}) : prevData => ({...prevData, is_for_admin: 0}));
    }
    const handleFileChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const selectedFile = event.target.files[0];
            setData(prevData => ({...prevData, cover_img_path: event.target.files[0].name}));
            const reader = new FileReader();
            reader.onload = () => {
                setFile(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        };
        input.click();
    };
    const handleFileDelete = () => {
        setData(prevData => ({...prevData, cover_img_path: 'game_cover_default.png'}));
    };
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
    function handleChooseTypeGame(selectedOption) {
        if (selectedOption.value === 'rpg') {
            setData(prevData => ({...prevData, game_type_id: 1}));
        } else if (selectedOption.value === 'strategy') {
            setData(prevData => ({...prevData, game_type_id: 2}));
        } else {
            setData(prevData => ({...prevData, game_type_id: 3}));
        }
        setDefaultOption(selectedOption);
    }
    return (
        <div className={'configuration-elem'}>
            <form onSubmit={handleSubmit} className={'form'}>
                <div className={'cover-editor'}>
                    <div className={'cover'}
                         style={{backgroundImage: data.cover_img_path ? `url(${process.env.PUBLIC_URL}/${data.cover_img_path})` : `url(${process.env.PUBLIC_URL}/game_cover_default.png)`}}
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
                <div style={{marginBottom: '8px'}}>
                    <Select options={gameTypes} placeholder="Тип игры" onChange={handleChooseTypeGame} value={defaultOption}></Select>
                </div>
                <label className={'label'}>
                    <span>Название игры</span>
                    <input
                        type="text"
                        name="name"
                        value={data.name || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 1 к игре</span>
                    <input
                        type="text"
                        name="path1"
                        value={data.path1 || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 2 к игре</span>
                    <input
                        type="text"
                        name="path2"
                        value={data.path2 || ''}
                        onChange={handleInputChange}
                        className={'input'}
                    />
                </label>
                <label className={'label'}>
                    <span>Путь 3 к игре</span>
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
                        <input type="checkbox" onChange={handleChangeAge}
                               className={'checkbox'} checked={data.age_restrictions !== 0}/> Ограничить
                        возрастной контент
                    </div>
                </label>
                {data.age_restrictions !== 0 && (
                    <div className={'tabs'}>
                        <div className={`tab info ${age_restrictions===1 && ('active')}`} onClick={()=>handleChangeAgeRestrictions(1)}>0+</div>
                        <div className={`tab info ${age_restrictions === 6 && ('active')}`} onClick={()=>handleChangeAgeRestrictions(6)}>6+</div>
                        <div className={`tab info ${age_restrictions === 12 && ('active')}`} onClick={()=>handleChangeAgeRestrictions(12)}>12+</div>
                        <div className={`tab info ${age_restrictions === 16 && ('active')}`} onClick={()=>handleChangeAgeRestrictions(16)}>16+</div>
                        <div className={`tab info ${age_restrictions === 18 && ('active')}`} onClick={()=>handleChangeAgeRestrictions(18)}>18+</div>
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

export {GameEdit};