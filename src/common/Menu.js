import {NavLink} from "react-router-dom";
import React, {useState} from "react";

const Menu = ({onModalActive, configurationName}) => {
    const [contentVisible, setContentVisible] = useState(true)
    const handleContentClick = () => {
        setContentVisible(!contentVisible);
        setShopVisible(false);
    };
    const [shopVisible, setShopVisible] = useState(false)
    const handleShopClick = () => {
        setShopVisible(!shopVisible);
        setContentVisible(false);
    };
    return (<div className={'main-menu'}>
            <div className={'menu'}>
                <div className={'menu-logo'}>
                    <div className={'logo'}></div>
                </div>
                <div className={'menu-configurator'}>
                    <div className={'menu-configurator-name'}>{configurationName}</div>
                    <div className={'icon-mode'} onClick={onModalActive}>
                        <i className={'mdi mdi-account-cog'}></i>
                    </div>
                </div>
                <div className={`menu-item ${contentVisible && ('active')}`} onClick={handleContentClick}>
                    <i className={'mdi mdi-gamepad-square-outline'}></i>
                    <h6>Контент</h6>
                </div>
                {contentVisible && (<>
                    <NavLink exact="true" to="/games" activeclassname={'active'} className={'menu-link'}>
                        <h6>Игры</h6>
                    </NavLink>
                    <NavLink exact="true" to="/programs" activeclassname={'active'} className={'menu-link'}>
                        <h6>Программы</h6>
                    </NavLink>
                    </>
                )}
                <div className={`menu-item ${shopVisible && ('active')}`} onClick={handleShopClick}>
                    <i className={'mdi mdi-shopping-outline'}></i>
                    <h6>Товары</h6>
                </div>
                {shopVisible && (<>
                        <NavLink exact="true" to="/drinks" activeclassname={'active'} className={'menu-link'}>
                            <h6>Напитки</h6>
                        </NavLink>
                        <NavLink exact="true" to="/snacks" activeclassname={'active'} className={'menu-link'}>
                            <h6>Снэки</h6>
                        </NavLink>
                        <NavLink exact="true" to="/courses" activeclassname={'active'} className={'menu-link'}>
                            <h6>Горячее</h6>
                        </NavLink>
                    </>
                )}
            </div>
        </div>);
};

export {Menu};