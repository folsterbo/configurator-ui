import React, {useEffect, useState} from "react";
import axios from 'axios';
import {GameCreate} from "../components/GameCreate";
import {GameEdit} from "../components/GameEdit";
import {useOutletContext} from "react-router-dom";

const Games = ({ configurationId, width, height }) => {
    const [games, setGames] = useState([])
    const [background] = useOutletContext();
    const [widthCover, setWidthCover] = useState(240);
    const [heightCover, setHeightCover] = useState(150);
    const [showCover, setShowCover] = useState(true);
    const [showElemAdd, setShowElemAdd] = useState(false);
    const [showElemEdit, setShowElemEdit] = useState(false);
    const [showBannerAdd, setShowBannerAdd] = useState(false);
    const [count, setCount] = useState(1);
    const [showBanner, setShowBanner] = useState('');
    const [hoveredContainer, setHoveredContainer] = useState(null);
    const [clickedContainer, setClickedContainer] = useState(null);
    const [bannerWidth, setBannerWidth] = useState(300);
    const [bannerHeight, setBannerHeight] = useState(300);
    const [update, setUpdate] = useState(0);

    const handleWidthCoverChange = (event) => {
        setWidthCover(event.target.value);
    };
    const handleHeightCoverChange = (event) => {
        setHeightCover(event.target.value);
    };
    const handleRadioChange = (event) => {
        setShowCover(event.target.value === 'cover');
    };
    const renderContainers = () => {
        const containers = [];
        for (let i = 0; i < count; i++) {
            containers.push(<div key={i} className={'banner'}>{i + 1}</div>);
        }
        return containers;
    };
    const handleElemAdd = () => {
        setShowElemAdd(true);
        setShowBannerAdd(false);
        setShowElemEdit(false);
    };
    const handleElemEdit = () => {
        setClickedContainer(hoveredContainer)
        setShowElemAdd(false);
        setShowBannerAdd(false);
        setShowElemEdit(true);
    };
    const handleBannerAdd = () => {
        setShowBannerAdd(true);
        setShowElemAdd(false);
        setShowElemEdit(false);
    };

    const handleInputChange = (event) => {
        const value = parseInt(event.target.value);
        setCount(value);
    };
    const handleBannerChange = (event) => {
        setShowBanner(event.target.value);
        console.log(event.target.value)
    };
    const handleGameCancel = () => {
        setShowElemAdd(false);
    };
    const handleGameCreate = () => {
        setUpdate(update + 1)
        setShowElemAdd(false);
    };
    const handleGameEdit = () => {
        setUpdate(update + 1)
        setShowElemEdit(false);
    };
    const handleGameEditCancel = () => {
        setShowElemEdit(false);
    };
    const handleMouseEnter = (id) => {
        setHoveredContainer(id);
    };
    const handleMouseLeave = () => {
        setHoveredContainer(null);
    };
    const handleElemDelete = () => {
        const fetchData = async () => {
            await axios.delete(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/games/${hoveredContainer}`)
                .catch(error => console.error(error));
        };
        fetchData().then(() => setUpdate(update + 1));
    };
    const handleBannerWidthChange = (event) => {
        setBannerWidth(event.target.value);
    };
    const handleBannerHeightChange = (event) => {
        setBannerHeight(event.target.value);
    };
    useEffect(() => {
        if (configurationId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/games`);
                    setGames(response.data.items)
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData().then();
        }
    }, [update, configurationId]);
    return (
        <div className={'content'}>
            <div className={'screen-wrapper'}>
                <div style={{
                    backgroundImage: `url(${background || ''})`,
                    width: `${width}px`,
                    height: `${height}px`
                }}
                     className={`screen ${showBanner === "down" && ('screen-column')} ${showBanner === "right" && ('screen-row')} ${showBanner === "up" && ('screen-column')} ${showBanner === "left" && ('screen-row')}`}>
                    {showBanner === "up" &&
                        <div className={'banner-list'} style={{width: `${bannerWidth}px`, height: `${bannerHeight}px`}}>
                            {renderContainers()}
                        </div>}
                    {showBanner === "left" &&
                        <div className={'banner-list'} style={{width: `${bannerWidth}px`, height: `${bannerHeight}px`}}>
                            {renderContainers()}
                        </div>}
                    <div className={'game-list'}>
                        {games.map(game => (
                            <div key={game.id} className={'game'} onMouseEnter={() => handleMouseEnter(game.id)}
                                 onMouseLeave={handleMouseLeave}>
                                {showCover && (
                                    <div className={'game-cover'}
                                         style={{
                                             width: `${widthCover}px`,
                                             height: `${heightCover}px`,
                                             backgroundImage: `url(${process.env.PUBLIC_URL}/${game.cover_img_path})`
                                         }}></div>
                                )}
                                {!showCover && (
                                    <div className={'game-icon'}
                                         style={{
                                             width: '100px',
                                             height: '100px',
                                             backgroundImage: `url(${process.env.PUBLIC_URL}/${game.icon_path})`
                                         }}></div>
                                )}
                                {hoveredContainer === game.id &&
                                    <div className={'icons-group'}>
                                        <div className={'icon-mode'} onClick={handleElemEdit}>
                                            <i className={'mdi mdi-pencil-outline'} title={'Редактировать'}></i>
                                        </div>
                                        <div className={'icon-mode'} onClick={handleElemDelete}>
                                            <i className={'mdi mdi-trash-can-outline'} title={'Удалить'}></i>
                                        </div>
                                    </div>
                                }
                                <h6 className={'game-name'}>{game.name}</h6>
                            </div>
                        ))}
                    </div>
                    {showBanner === "down" &&
                        <div className={'banner-list'} style={{width: `${bannerWidth}px`, height: `${bannerHeight}px`}}>
                            {renderContainers()}
                        </div>}
                    {showBanner === "right" &&
                        <div className={'banner-list'} style={{width: `${bannerWidth}px`, height: `${bannerHeight}px`}}>
                            {renderContainers()}
                        </div>}
                </div>
            </div>

            <div className={`screen-configuration ${!configurationId && ('configuration-disable')}`}>
                <h6 style={{marginBottom: '8px'}}>Экран "Игры"</h6>
                <div style={{marginBottom: '4px', fontWeight: 'bold'}}>
                    Обложка
                </div>
                <div style={{display: 'flex', marginBottom: '8px', flexDirection: 'column'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input style={{marginRight: '8px'}} type="radio" name="showCover" value="cover"
                               onChange={handleRadioChange} checked={showCover === true}/>
                        <div style={{marginRight: '16px'}}>Картинка</div>
                        <div style={{marginRight: '4px'}} className={`${!showCover && ('color-text-helper')}`}>X:</div>
                        <input type="number" value={widthCover} onChange={handleWidthCoverChange}
                               style={{width: '60px', marginRight: '8px'}}
                               className={`input ${!showCover && ('disabled')}`}/>
                        <div style={{marginRight: '4px'}} className={`${!showCover && ('color-text-helper')}`}>Y:</div>
                        <input type="number" value={heightCover} onChange={handleHeightCoverChange}
                               className={`input ${!showCover && ('disabled')}`} style={{width: '60px'}}/>
                    </div>
                    <div style={{marginRight: '16px'}}>
                        <input style={{marginRight: '8px'}} type="radio" name="showCover" value="icon"
                               onChange={handleRadioChange}/>
                        Иконка
                    </div>
                </div>
                <div className={'tabs'}>
                    <div className={`tab info ${showElemAdd && ('active')}`} onClick={handleElemAdd}>
                        <i className={'mdi mdi-plus'} style={{fontSize: '24px', marginRight: '4px'}}></i>
                        Элемент
                    </div>
                    <div className={`tab info ${showBannerAdd && ('active')}`} onClick={handleBannerAdd}>
                        <i className={'mdi mdi-plus'} style={{fontSize: '24px', marginRight: '4px'}}></i>
                        Баннер
                    </div>
                </div>
                {showElemAdd && (
                    <GameCreate configurationId={configurationId} onGameCancel={handleGameCancel}
                                onGameCreate={handleGameCreate}/>
                )}
                {showElemEdit && (
                    <GameEdit onGameEditCancel={handleGameEditCancel} onGameEdit={handleGameEdit}
                              configurationId={configurationId} gameId={clickedContainer}/>
                )}
                {showBannerAdd && (
                    <div>
                        <div style={{display: 'flex', marginBottom: '16px'}}>
                            <div style={{marginRight: '16px'}}>
                                <input style={{marginRight: '8px'}} type="radio" name="showBanner" value="up"
                                       onChange={handleBannerChange} /*checked={showBannerUp === true}*//>
                                <i className={'mdi mdi-arrow-up-bold'}></i>
                            </div>
                            <div style={{marginRight: '16px'}}>
                                <input style={{marginRight: '8px'}} type="radio" name="showBanner" value="left"
                                       onChange={handleBannerChange} /*checked={showBannerLeft === true}*//>
                                <i className={'mdi mdi-arrow-left-bold'}></i>
                            </div>
                            <div style={{marginRight: '16px'}}>
                                <input style={{marginRight: '8px'}} type="radio" name="showBanner" value="right"
                                       onChange={handleBannerChange} /*checked={showBannerRight === true}*//>
                                <i className={'mdi mdi-arrow-right-bold'}></i>
                            </div>
                            <div style={{marginRight: '16px'}}>
                                <input style={{marginRight: '8px'}} type="radio" name="showBanner" value="down"
                                       onChange={handleBannerChange} /*checked={showBannerDown === true}*//>
                                <i className={'mdi mdi-arrow-down-bold'}></i>
                            </div>
                        </div>
                        <input type="number" value={count} onChange={handleInputChange} max={3} className={'input'}
                               style={{marginBottom: '16px'}}/>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{marginRight: '4px'}}>X:</div>
                            <input type="number" value={bannerWidth} onChange={handleBannerWidthChange}
                                   style={{width: '60px', marginRight: '8px'}}
                                   className={'input'}/>
                            <div style={{marginRight: '4px'}}>Y:</div>
                            <input type="number" value={bannerHeight} onChange={handleBannerHeightChange}
                                   className={'input'} style={{width: '60px'}}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export {Games};