import Calendar from 'react-calendar';
import style from './styles/CalendarDialog.module.scss';
import 'react-calendar/dist/Calendar.css';
import { useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarDialogProps {
    toggle: () => void;
    onSelectDate: (date: string) => void;
}

function CalendarDialog({ toggle, onSelectDate }: CalendarDialogProps) {
    const [calendarValue, setCalendarValue] = useState<Value>(new Date());
    const calenderRef = useRef<HTMLDivElement>(null);

    const onChangeCalendar = useCallback(() => {
        setCalendarValue(calendarValue);
        let dateObj: Date | null = null;
        if (calendarValue instanceof Date) {
            dateObj = calendarValue;
        } else if (Array.isArray(calendarValue) && calendarValue[0] instanceof Date) {
            dateObj = calendarValue[0];
        }
        let dateString = '';
        if (dateObj) {
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            // dateString = `${year}년 ${month}월 ${day}일`;
            dateString = `${year}-${month}-${day}`;
        }
        onSelectDate(dateString);
        toggle();
    }, [calendarValue]);

    return (
        <div className={style.modalOverlay}>
            <div className={style.modal} ref={calenderRef}>
                <div className={style.modal__header}>
                    <h2 className={style.modal__header__title}>마감 일자를 지정하세요</h2>
                    <X className={style.modal__closeButton} size={30} onClick={toggle} />
                </div>
                <div className={style.modal__content}>
                    <Calendar onChange={onChangeCalendar} value={calendarValue} />
                </div>
            </div>
        </div>
    );
}

export default CalendarDialog;
