const Modal = ({active, setActive, children}) => {
    return (
        <div className={active ? 'modal active' : 'modal'} onClick={() => setActive(false)}>
            <div className={active ? 'modal__content active' : 'modal__content'} onClick={e => e.stopPropagation()}>
                <div className={'close'}>
                    <div className={'icon-mode'} onClick={() => setActive(false)}>
                        <i className={'icon-mode mdi mdi-close'}></i>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export {Modal};