import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import style from './styles/CalendarDialog.module.scss';
import buttonStyle from '../buttons/styles/CloseButton.module.scss';
import { useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';
import moment from 'moment';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarDialogProps {
    toggle: () => void;
    onSelectDate: (date: string) => void;
    title: string | null;
}

function CalendarDialog({ toggle, onSelectDate, title }: CalendarDialogProps) {
    const [calendarValue, setCalendarValue] = useState<Value>(new Date());
    const calenderRef = useRef<HTMLDivElement>(null);

    const onChangeCalendar = useCallback((value: Value) => {
        setCalendarValue(value);
        let dateObj: Date | null = null;
        if (value instanceof Date) {
            dateObj = value;
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            dateObj = value[0];
        }
        let dateString = '';
        if (dateObj) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            dateString = `${year}-${month}-${day}`;
        }
        onSelectDate(dateString);
        toggle();
    }, []);

    return (
        <div className={style.modalOverlay}>
            <div className={style.modal} ref={calenderRef}>
                <div className={style.modal__header}>
                    <h2 className={style.modal__header__title}>{title}</h2>
                    <X className={buttonStyle.closeButton} size={20} onClick={toggle} />
                </div>
                <div className={style.modal__content}>
                    <Calendar
                        onChange={onChangeCalendar}
                        value={calendarValue}
                        formatDay={(_locale, date) => moment(date).format('DD')}
                    />
                </div>
            </div>
        </div>
    );
}

export default CalendarDialog;
