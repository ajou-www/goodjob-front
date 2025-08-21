import { useRef, useState } from 'react';
import style from './styles/NotificationDialog.module.scss';
import { Newspaper, X, Rocket, ClockAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewJobDialog from './NewJobDialog';
import useJobStore from '../../../store/jobStore';

interface AlertDialogProps {
    onClose: () => void;
}
function AlertDialog({ onClose }: AlertDialogProps) {
    const dropDownRef = useRef<HTMLDivElement>(null);
    const [viewNewJobList, setViewNewJobList] = useState(false);
    const [viewPopularJobList, setViewPopularJobList] = useState(false);
    const navigate = useNavigate();
    const { setSelectedJobDetail, lastSelectedJob } = useJobStore();
    const mockNotiData = [
        { id: '새로운공고', data: '**님에게 적합한 공고 5개 발견!!', icon: Newspaper },
        {
            id: '인기공고',
            data: '어제 goodJob에서 인기가 많았던 공고들을 확인하세요!!',
            icon: Rocket,
        },
        { id: '마감임박', data: '2개 공고의 마감일이 다가오고 있습니다!!', icon: ClockAlert },
    ] as const;

    const handleRemove = () => {};

    const handleClick = (id: string) => {
        if (id === '새로운공고') {
            setViewNewJobList(true);
        }
        if (id === '인기공고') {
            setViewPopularJobList(true);
        }
        if (id === '마감임박') {
            onClose();
            navigate('/main/manage');
        }
    };

    return (
        <>
            {viewNewJobList ? (
                <NewJobDialog
                    onClose={() => {
                        setViewNewJobList(false);
                        setSelectedJobDetail(lastSelectedJob);
                    }}
                />
            ) : (
                <></>
            )}
            {viewPopularJobList ? <></> : <></>}
            <div className={style.dropdown} ref={dropDownRef}>
                <ul className={style.notiBox}>
                    {mockNotiData.map((item) => (
                        <div className={style.notiContainer}>
                            <div
                                className={style.notiContainer__wrapper}
                                onClick={(e) => {
                                    handleClick(item.id);
                                    e.stopPropagation();
                                }}>
                                <item.icon />
                                <div className={style.notiContainer__textSection}>
                                    <p className={style.notiContainer__textSection__title}>
                                        {item.data}
                                    </p>
                                    <p className={style.notiContainer__textSection__time}>
                                        2025년 8월 13일
                                    </p>
                                </div>
                            </div>

                            <X className={style.removeButton} size={20} onClick={handleRemove} />
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default AlertDialog;
