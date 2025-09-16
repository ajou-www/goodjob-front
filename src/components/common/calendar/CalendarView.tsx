import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from './Calendar.module.scss';
import moment from 'moment';
import { useState, useRef, useEffect } from 'react';

interface CalendarEvent extends Event {
    title: string;
    start: Date | undefined;
    end: Date | undefined;
}

interface CalendarViewProps {
    events: CalendarEvent[];
}

function CalendarView({ events }: CalendarViewProps) {
    const [moreEvents, setMoreEvents] = useState<CalendarEvent[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null);

    const calendarWrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const lastClickedElementRef = useRef<HTMLElement | null>(null);

    const localizer = momentLocalizer(moment);
    const messages = {
        today: '오늘',
        previous: '이전 달',
        next: '다음 달',
        month: '월',
        week: '주',
        day: '일',
        agenda: '일정',
        showMore: (total: number) => `+${total}개 더 보기`,
    };

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            lastClickedElementRef.current = e.target as HTMLElement;
        };

        window.addEventListener('mousedown', handleGlobalClick);
        return () => {
            window.removeEventListener('mousedown', handleGlobalClick);
        };
    }, []);

    useEffect(() => {
        if (!showDropdown) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div
            ref={calendarWrapperRef}
            style={{ position: 'relative', height: '100%', maxWidth: 1050 }}>
            <Calendar
                className={style.myCalendar}
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                events={events}
                style={{ height: '100%', width: '100%' }}
                views={['month']}
                messages={messages}
                onShowMore={(evts) => {
                    const showMoreLink = lastClickedElementRef.current?.closest('.rbc-show-more');

                    if (showMoreLink && calendarWrapperRef.current) {
                        const parentRect = calendarWrapperRef.current.getBoundingClientRect();
                        const targetRect = showMoreLink.getBoundingClientRect();

                        const position = {
                            x: targetRect.left - parentRect.left,
                            y: targetRect.bottom - parentRect.top,
                        };

                        setMoreEvents(evts);
                        setDropdownPosition(position);
                        setShowDropdown(!showDropdown);
                    }
                }}
            />

            {showDropdown && dropdownPosition && (
                <div
                    ref={dropdownRef}
                    className={style.statusDropdown}
                    style={{
                        position: 'absolute',
                        top: `${dropdownPosition.y}px`,
                        left: `${dropdownPosition.x}px`,
                        background: '#fff',
                        border: '1px solid #ccc',
                        padding: '8px',
                        zIndex: 1000,
                    }}>
                    {moreEvents.map((evt, i) => (
                        <div
                            key={i}
                            className={style.statusOption}
                            onClick={() => {
                                console.log(evt.title);
                                setShowDropdown(false);
                            }}>
                            <span className={style.statusDot}></span>
                            {evt.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CalendarView;
