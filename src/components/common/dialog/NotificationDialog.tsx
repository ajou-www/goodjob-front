import { useRef } from 'react';
import style from './styles/NotificationDialog.module.scss';
import { Newspaper, X } from 'lucide-react';

function AlertDialog() {
    const dropDownRef = useRef<HTMLDivElement>(null);

    const mockAlertList = [
        '업로드 한 CV에 맞는 새로운 공고가 5개 있습니다.',
        '어제 가장 인기 있었던 공고를 확인해보세요!.',
        '업로드 한 CV에 맞는 새로운 공고가 5개 있습니다.',
    ];

    const handleRemove = () => {};

    return (
        <div className={style.dropdown} ref={dropDownRef}>
            <ul className={style.notiBox}>
                {mockAlertList.map((item) => (
                    <div className={style.notiContainer}>
                        <div className={style.notiContainer__wrapper}>
                            <Newspaper />
                            <div className={style.notiContainer__textSection}>
                                <p className={style.notiContainer__textSection__title}>{item}</p>
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
    );
}

export default AlertDialog;
