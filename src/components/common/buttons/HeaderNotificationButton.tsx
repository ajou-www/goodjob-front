import { useRef, useState } from 'react';
import NotificationDialog from '../dialog/NotificationDialog';
import style from './styles/HeaderNotificationButton.module.scss';
import { Bell } from 'lucide-react';
import useNotificationStore from '../../../store/NotificationStore';

function HeaderNotificationButton() {
    const [showAlertDropdown, setShowAlertDropdown] = useState(false);
    const notiList_match = useNotificationStore((state) => state.notiList_match);
    const notiList_due = useNotificationStore((state) => state.notiList_due);
    const alertDropdownRef = useRef<HTMLDivElement>(null);

    const toggleAlertDropdown = () => {
        setShowAlertDropdown(!showAlertDropdown);
    };

    return (
        <>
            <button
                className={style.actionButton}
                aria-label="알림"
                onClick={(e) => {
                    toggleAlertDropdown();
                    e.stopPropagation();
                }}>
                <li
                    {...((notiList_match.length > 0 || notiList_due.length > 0) && {
                        'data-badge': '',
                    })}
                    style={{
                        display: 'inline-block',
                    }}>
                    <Bell size={24} className={style.actionButton__icon} />
                </li>
            </button>
            {showAlertDropdown ? (
                <div className={style.alertDropdownWrapper} ref={alertDropdownRef}>
                    <NotificationDialog toggle={toggleAlertDropdown} isClose={showAlertDropdown} />
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default HeaderNotificationButton;
