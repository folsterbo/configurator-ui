import React, {useEffect, useState} from "react";
import axios from "axios";
import {ThemeToggle} from "./ThemeToggle";
import {BackgroundImage} from "./BackgroundImage";

const Configuration = ({configurationId, onConfigurationChange, onSetBackground}) => {
    const [update, setUpdate] = useState(0);
    const [clickedId, setClickedId] = useState(configurationId);
    const [configurationsList, setConfigurationsList] = useState([]);
    const [changeConfigMode, setChangeConfigMode] = useState(false);
    const [addConfigMode, setAddConfigMode] = useState(false);
    const [editConfigMode, setEditConfigMode] = useState(false);
    const [background, setBackground] = useState('')
    const [settings, setSettings] = useState({
        value: configurationId,
    });
    const [configuration, setConfiguration] = useState({
        id: null,
        name: "",
        width: 1920,
        height: 1024,
        desktop_wallpaper_path: null,
        is_night_mode: 0,
        created_at: null,
        updated_at: null,
        deleted_at: null,
        _method: "PUT",
    });
    const [is_night_mode, setIsNightMode] = useState(0);
    const [editConfigurationId, setEditConfigurationId] = useState(configurationId);
    const handleDeleteConfiguration = (id) => {
        const fetchData = async () => {
            await axios.delete(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${id}`)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
    };
    const handleCreateMode = () => {
        setChangeConfigMode (true)
        setAddConfigMode(true)
    };
    const handleEditConfiguration = (id) => {
        setEditConfigurationId(id)
        setChangeConfigMode (true)
        setEditConfigMode (true)
    };
    const handleInputChange = event => {
        const {name, value} = event.target;
        setConfiguration(prevData => ({...prevData, [name]: value}));
    };
    const handleCreateSubmit = (event) => {
        event.preventDefault();
        const newConfigurationData = {data: configuration}

        const fetchData = async () => {
            await axios.post(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations`, newConfigurationData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
        setAddConfigMode(false)
        setChangeConfigMode (false)
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const newConfigurationData = {data: configuration}
        const fetchData = async () => {
            await axios.post(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${editConfigurationId}`, newConfigurationData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
        setEditConfigMode(false)
        setChangeConfigMode (false)
    };
    const handleConfigurationChange = () => {
        setSettings({
            value: clickedId
        })
        const newSettingsData = {data: settings}
        const fetchData = async () => {
            await axios.put(`https://dcc4.langame.ru/configurator-api/api/v1/shell/settings/active_configuration?data[value]=${clickedId}`, newSettingsData)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
        onConfigurationChange(clickedId);
    };
    const handleConfigurationClick = (id) => {
        setClickedId(id);
    };
    const handleNightMode = () => {
        if (is_night_mode === 0) {
            setIsNightMode(1);
            configuration.is_night_mode = 1;
        } else {
            setIsNightMode(0);
            configuration.is_night_mode = 0;
        }
        console.log(is_night_mode)
    };
    const handleChangeBackground = (backgroundPath) => {
        onSetBackground(backgroundPath);
        setBackground(`http://localhost:8181/${backgroundPath}`)
    };
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations')
                .then(response => {
                    setConfigurationsList(response.data.items)
                })
                .catch(error => {
                    console.log(error);
                });
        };
        fetchData().then();
    }, [update]);
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${editConfigurationId}`)
                .then(response => setConfiguration(response.data.payload[0]))
                .catch(error => {
                    console.log(error);
                });
        };
        fetchData().then();
    }, [editConfigurationId]);
    return (
        <div>
            <BackgroundImage configurationId={configurationId} onChangeBackground={handleChangeBackground}/>
            <div className={'table'}>
                <div className={'table-header'}>
                    <div className={'header-cell'} style={{width: '30px'}}></div>
                    <div className={'header-cell'} style={{width: '250px'}}>Наименование</div>
                    <div className={'header-cell'} style={{width: '160px'}}>Ширина экрана (px)</div>
                    <div className={'header-cell'} style={{width: '150px'}}>Высота экрана (px)</div>
                    <div className={'header-cell'} style={{width: '40px'}}>Тема</div>
                    <div className={'header-cell'} style={{width: '30px'}}></div>
                    <div className={'header-cell'} style={{width: '30px'}}></div>
                </div>
                <div className={'table-body'}>
                    {configurationsList.map((item) => (
                        <div key={item.id} className={`table-row ${item.id === clickedId && ('active')}`} onClick={() => handleConfigurationClick(item.id)}>
                            <div className={'cell'} style={{width: '30px'}}>
                                {item.id === clickedId && <i className={'mdi mdi-check-bold'} title={'Активная конфигурация'}></i>}
                            </div>
                            <div className={'cell'} style={{width: '250px'}}>{item.name}</div>
                            <div className={'cell'} style={{width: '160px'}}>{item.width}</div>
                            <div className={'cell'} style={{width: '150px'}}>{item.height}</div>
                            <div className={'cell'} style={{width: '40px'}}>
                                {item.is_night_mode === 0 && <i className={'mdi mdi-white-balance-sunny'} title={'Светлая тема'}></i>}
                                {item.is_night_mode === 1 && <i className={'mdi mdi-moon-waning-crescent'} title={'Темная тема'}></i>}
                            </div>
                            <div onClick={() => handleDeleteConfiguration(item.id)} style={{width: '30px'}}><i className={'mdi mdi-trash-can-outline'} title={'Удалить'}></i></div>
                            <div onClick={() => handleEditConfiguration(item.id)} style={{width: '30px'}}><i className={'mdi mdi-pencil-outline'} title={'Редактировать'}></i></div>
                        </div>
                    ))}
                </div>
            </div>
            {!changeConfigMode && <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div className={`btn btn-add`} onClick={handleCreateMode} style={{marginTop: '8px'}}>
                    <i className={'mdi mdi-plus'} style={{fontSize: '24px', marginRight: '4px'}}></i>
                    Добавить конфигурацию
                </div>
            </div>}
            {changeConfigMode && (
                <div className={'table-row-edit'}>
                    <div className={'cell'} style={{width: '30px'}}></div>
                    <div className={'cell'} style={{width: '250px'}}>
                        <input
                            type="text"
                            placeholder={'Наименование'}
                            name="name"
                            value={configuration.name || ''}
                            onChange={handleInputChange}
                            className={'input'}
                            style={{marginRight: '16px'}}
                        />
                    </div>
                    <div className={'cell'} style={{width: '160px'}}>
                        <input type="number" max={16000} name="width" value={configuration.width || ''} onChange={handleInputChange}
                               className={'input'}
                               style={{width: '70px'}}/>
                    </div>
                    <div className={'cell'} style={{width: '150px'}}>
                        <input type="number" max={16000} name="height" value={configuration.height || ''} onChange={handleInputChange}
                               className={'input'}
                               style={{width: '70px'}}/>
                    </div>
                    <div className={'cell'} style={{width: '40px'}}>
                        <ThemeToggle nightMode={configuration.is_night_mode} onToggle={handleNightMode}/>
                    </div>
                    <div className={'cell'} style={{width: '30px'}}>
                        {addConfigMode && (<div className={'icon-mode'} style={{marginRight: '8px'}} onClick={handleCreateSubmit}>
                            <i className={'mdi mdi-content-save-outline'} title={'Создать конфигурацию'}></i>
                        </div>)}
                        {editConfigMode && (<div className={'icon-mode'} style={{marginRight: '8px'}} onClick={handleEditSubmit}>
                            <i className={'mdi mdi-content-save-outline'} title={'Создать конфигурацию'}></i>
                        </div>)}
                    </div>
                </div>
            )}
            {clickedId !== configurationId && <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div className={`btn btn-primary`} onClick={handleConfigurationChange} style={{marginTop: '8px'}}>
                    Подтвердить изменение активной конфигурации
                </div>
            </div>}
        </div>
    );
};

export {Configuration};