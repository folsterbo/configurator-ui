import React, {useEffect, useState} from "react";
import axios from 'axios';
import {SnackCreate} from "../components/SnackCreate";
import {GoodEdit} from "../components/GoodEdit";
import {useOutletContext} from "react-router-dom";

const Snacks = ({ configurationId, width, height }) => {
    const [background] = useOutletContext();
    const [snacks, setSnacks] = useState([])
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
    const handleSnackCancel = () => {
        setShowElemAdd(false);
    };
    const handleSnackCreate = () => {
        setUpdate(update + 1)
        setShowElemAdd(false);
    };
    const handleSnackEdit = () => {
        setUpdate(update + 1)
        setShowElemEdit(false);
    };
    const handleSnackEditCancel = () => {
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
            await axios.delete(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/goods/${hoveredContainer}`)
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
        axios.get(`http://localhost:8181/api/v1/shell/configurations/${configurationId}/goods`)
            .then(response => setSnacks(response.data.items.filter(item => item.good_type_id === 2)))
            .catch(error => console.error(error));
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
                        {snacks.map(snack => (
                            <div key={snack.id} className={'game'}
                                 onMouseEnter={() => handleMouseEnter(snack.id)}
                                 onMouseLeave={handleMouseLeave}>

                                <div className={'game-cover'}
                                     style={{
                                         width: '150px',
                                         height: '200px',
                                         backgroundImage: `url(${process.env.PUBLIC_URL}/${snack.cover_file_path})`
                                     }}></div>

                                {hoveredContainer === snack.id &&
                                    <div className={'icons-group'}>
                                        <div className={'icon-mode'} onClick={handleElemEdit}>
                                            <i className={'mdi mdi-pencil-outline'} title={'Редактировать'}></i>
                                        </div>
                                        <div className={'icon-mode'} onClick={handleElemDelete}>
                                            <i className={'mdi mdi-trash-can-outline'} title={'Удалить'}></i>
                                        </div>
                                    </div>
                                }
                                <h6 className={'game-name'}>{snack.id} {snack.description}</h6>
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
                <h6 style={{marginBottom: '8px'}}>Экран "Напитки"</h6>
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
                    <SnackCreate configurationId={configurationId} onSnackCancel={handleSnackCancel}
                                 onSnackCreate={handleSnackCreate}/>
                )}
                {showElemEdit && (
                    <GoodEdit onGoodEditCancel={handleSnackEditCancel} onGoodEdit={handleSnackEdit}
                              configurationId={configurationId} goodId={clickedContainer}/>
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

export {Snacks};