import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from './Calendar.module.scss';
import moment from 'moment';
import { useState, useRef, useEffect } from 'react';

// CalendarEvent 타입이 외부에 정의되어 있다고 가정합니다.
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

    // 1. 필요한 DOM 요소와 마지막 클릭 요소를 저장하기 위한 Ref들
    const calendarWrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 자체의 Ref
    const lastClickedElementRef = useRef<HTMLElement | null>(null); // 마지막으로 클릭된 요소를 저장

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

    // 2. 페이지 전체의 클릭 이벤트를 감지하여 마지막 클릭 요소를 저장하는 Effect
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            lastClickedElementRef.current = e.target as HTMLElement;
        };
        // mousedown 이벤트가 click보다 먼저 발생하므로 더 안정적으로 타겟을 잡을 수 있습니다.
        window.addEventListener('mousedown', handleGlobalClick);
        return () => {
            window.removeEventListener('mousedown', handleGlobalClick);
        };
    }, []);

    // 3. 드롭다운 외부 클릭 시 닫기 위한 Effect
    useEffect(() => {
        if (!showDropdown) return;

        const handleClickOutside = (e: MouseEvent) => {
            // 드롭다운 자기 자신이나 그 자식 요소를 클릭한게 아니라면 닫습니다.
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        // setTimeout을 사용해 mousedown 이벤트와의 충돌을 피합니다.
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div ref={calendarWrapperRef} style={{ position: 'relative', height: '100%' }}>
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
                    // 4. onShowMore가 호출되면, 저장해둔 마지막 클릭 요소로 위치를 계산합니다.
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
                        setShowDropdown(!showDropdown); // 모든 준비가 끝나면 드롭다운을 표시합니다.
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
