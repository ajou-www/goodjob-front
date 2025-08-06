import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { CalendarEvent } from '../../../types/calendar';

interface CalendarViewProps {
    events: CalendarEvent[];
}

function CalendarView({ events }: CalendarViewProps) {
    const localizer = momentLocalizer(moment);

    return (
        <Calendar
            localizer={localizer}
            startAccessor="start"
            events={events}
            endAccessor="end"
            style={{
                height: 500,
            }}
        />
    );
}

export default CalendarView;
