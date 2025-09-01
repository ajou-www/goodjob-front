import { useEffect, useRef, useState } from 'react';
import style from './styles/NotificationDialog.module.scss';
import { Newspaper, X, ClockAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewJobDialog from './NewJobDialog';
import useJobStore from '../../../store/jobStore';
import useNotificationStore from '../../../store/NotificationStore';
import { NotificationJobItem } from '../../../types/notification';
import LoadingSpinner from '../loading/LoadingSpinner';

interface NotificationDialogProps {
    onClose: () => void;
}
function NotificationDialog({ onClose }: NotificationDialogProps) {
    const dropDownRef = useRef<HTMLDivElement>(null);
    const [notificationProps, setNotificationProps] = useState<NotificationJobItem[] | null>(null);
    const [viewNewJobList, setViewNewJobList] = useState(false);

    const navigate = useNavigate();
    const { fetchNotiList, deleteNoti, fetchRead } = useNotificationStore();
    const notiList_match = useNotificationStore((state) => state.notiList_match);
    const notiList_due = useNotificationStore((state) => state.notiList_due);
    const { setSelectedJobDetail, lastSelectedJob } = useJobStore();

    const handleRemove = async (id: number) => {
        const res = await deleteNoti(id);
        console.log(res);
        if (res === 204) {
            fetchNotiList(false, 'CV_MATCH');
            fetchNotiList(false, 'APPLY_DUE');
        }
        return;
    };

    const handleClick = async (
        id: number,
        type: string,
        isRead: boolean,
        jobs?: NotificationJobItem[]
    ) => {
        let readResult: number = 0;
        if (!isRead) {
            readResult = await fetchRead(id);
        }
        if (isRead || readResult === 200) {
            if (type === 'CV_MATCH') {
                fetchNotiList(false, 'CV_MATCH');
                setNotificationProps(jobs ?? null);
                setViewNewJobList(true);
            }

            if (type === 'APPLY_DUE') {
                onClose();
                navigate('/main/manage');
            }
        }
    };

    const itemIcon = (type: string) => {
        if (type === 'CV_MATCH') {
            return <Newspaper />;
        }
        if (type === 'APPLY_DUE') {
            return <ClockAlert />;
        }
    };

    useEffect(() => {
        fetchNotiList(false, 'CV_MATCH');
        fetchNotiList(false, 'APPLY_DUE');
    }, [fetchNotiList]);

    return (
        <>
            {viewNewJobList ? (
                <NewJobDialog
                    props={notificationProps}
                    onClose={() => {
                        setViewNewJobList(!viewNewJobList);
                        setSelectedJobDetail(lastSelectedJob);
                    }}
                />
            ) : (
                <></>
            )}

            <div className={style.dropdown} ref={dropDownRef}>
                {!Array.isArray(notiList_match) ||
                (notiList_match.length === 0 && notiList_due.length === 0) ? (
                    <LoadingSpinner />
                ) : (
                    <ul className={style.notiBox}>
                        {notiList_match.map((item) => (
                            <div
                                className={`${style.notiContainer} ${item.read ? style.read : ''}`}
                                key={item.id}>
                                <div
                                    className={style.notiContainer__wrapper}
                                    onClick={(e) => {
                                        handleClick(item.id, item.type, item.read, item.jobs);
                                        e.stopPropagation();
                                    }}>
                                    {itemIcon(item.type)}
                                    <div className={style.notiContainer__textSection}>
                                        <p className={style.notiContainer__textSection__title}>
                                            {item.alarmText}
                                        </p>
                                        <p className={style.notiContainer__textSection__time}>
                                            {item.sentAt.split('T')[0]}
                                        </p>
                                    </div>
                                </div>

                                <X
                                    className={style.removeButton}
                                    size={20}
                                    onClick={() => handleRemove(item.id)}
                                />
                            </div>
                        ))}
                        {notiList_due.map((item) => (
                            <div
                                className={`${style.notiContainer} ${item.read ? style.read : ''}`}
                                key={item.id}>
                                <div
                                    className={style.notiContainer__wrapper}
                                    onClick={(e) => {
                                        handleClick(item.id, item.type, item.read, item.jobs);
                                        e.stopPropagation();
                                    }}>
                                    {itemIcon(item.type)}
                                    <div className={style.notiContainer__textSection}>
                                        <p className={style.notiContainer__textSection__title}>
                                            {item.alarmText}
                                        </p>
                                        <p className={style.notiContainer__textSection__time}>
                                            {item.sentAt.split('T')[0]}
                                        </p>
                                    </div>
                                </div>

                                <X
                                    className={style.removeButton}
                                    size={20}
                                    onClick={() => handleRemove(item.id)}
                                />
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

export default NotificationDialog;
