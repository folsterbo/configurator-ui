import {Outlet} from "react-router-dom";
import {Menu} from './Menu';
import {Configuration} from "./Configuration";
import {Modal} from "./Modal";
import React, {useState} from "react";

const Layout = ({configurationName, configurationId, onNewConfigurationActive}) => {
    const [modalActive, setModalActive] = useState(false)
    const [background, setBackground] = useState('')
    const [newConfigurationId, setNewConfigurationId] = useState(0)
    const handleConfigurationChange = (id) => {
        setNewConfigurationId(id);
        setModalActive(false);
        onNewConfigurationActive(id);
    };
    const handleBackground = (backgroundPath) => {
        setBackground(`http://localhost:8181/${backgroundPath}`)
    };
    return (
        <div className={'main-wrapper'}>
            <>
                <Menu onModalActive={() => setModalActive(true)} configurationName={configurationName}></Menu>
                <div className={'main-content'}>
                    <Outlet context={[background]}>
                    </Outlet>
                </div>
                <Modal active={modalActive} setActive={setModalActive}>
                    <Configuration configurationId={configurationId} onConfigurationChange={handleConfigurationChange} onSetBackground={handleBackground}></Configuration>
                </Modal>
            </>
        </div>
    );
};

export {Layout};