export interface CalendarEvent {
    id: number;
    title: string;
    companyName: string;
    applyStatus: string;
    start: Date | undefined | null;
    end: Date | undefined | null;
}
