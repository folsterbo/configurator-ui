import { useState, useEffect } from 'react';

const ThemeToggle = ({nightMode, onToggle}) => {
    const [isNightMode, setIsNightMode] = useState(localStorage.getItem('isNightMode') === 'true');
    useEffect(() => {
        if (nightMode === 0) {
            setIsNightMode(false);
        } else {
            setIsNightMode(true);
        }
    }, [nightMode]);
    useEffect(() => {
        localStorage.setItem('isNightMode', isNightMode);
        const body = document.querySelector('body');
        if (isNightMode) {
            body.classList.add('night-mode');
        } else {
            body.classList.remove('night-mode');
        }
    }, [isNightMode]);

    function handleToggle() {
        setIsNightMode(!isNightMode);
        onToggle();
    }
    return (
        <div onClick={handleToggle} className={'icon-mode'}>
            {isNightMode ? <i className={'mdi mdi-moon-waning-crescent'} title={'Применить светлую тему'}></i> : <i className={'mdi mdi-white-balance-sunny'} title={'Применить тёмную тему'}></i>}
        </div>
    );
};

export {ThemeToggle};