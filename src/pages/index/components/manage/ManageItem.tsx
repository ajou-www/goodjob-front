import { useState, useRef, useEffect } from 'react';
import type application from '../../../../types/application';
import style from './styles/ManageItem.module.scss';
import { Trash, Check, X, MoreHorizontal, Trash2 } from 'lucide-react';
import CalendarDialog from '../../../../components/common/dialog/CalendarDialog';
import 'react-calendar/dist/Calendar.css';

interface ManageItemProps {
    job: application;
    onRemove: () => void;
    onStatusChange: (status: string) => void;
    onNoteChange: (note: string) => void;
    onApplyDueDateChange: (endDate: string) => void;
    statusOptions: string[];
}

function ManageItem({
    job,
    onRemove,
    onStatusChange,
    onNoteChange,
    onApplyDueDateChange,
    statusOptions,
}: ManageItemProps) {
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [editedNote, setEditedNote] = useState(job.note || '');
    const [dropUp, setDropUp] = useState(false);
    const [actionMenuUp, setActionMenuUp] = useState(false);
    const noteInputRef = useRef<HTMLTextAreaElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const actionsMenuRef = useRef<HTMLDivElement>(null);
    const isMobile = window.matchMedia('only screen and (max-width: 480px)').matches;

    // 상태에 따른 색상 매핑
    const getStatusColor = (status: string) => {
        switch (status) {
            case '준비중':
                return '#9e9e9e';
            case '지원':
                return '#2196f3';
            case '서류전형':
                return '#ff9800';
            case '코테':
                return '#9c27b0';
            case '면접':
                return '#673ab7';
            case '최종합격':
                return '#4caf50';
            case '불합격':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target as Node)
            ) {
                setShowStatusDropdown(false);
            }

            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isEditingNote && noteInputRef.current) {
            noteInputRef.current.focus();
        }
    }, [isEditingNote]);

    useEffect(() => {
        if (showStatusDropdown && statusDropdownRef.current) {
            const rect = statusDropdownRef.current.getBoundingClientRect();
            const dropdownHeight = 40 + statusOptions.length * 36;
            if (rect.bottom + dropdownHeight > window.innerHeight) {
                setDropUp(true);
            } else {
                setDropUp(false);
            }
        }
    }, [showStatusDropdown, statusOptions.length]);

    useEffect(() => {
        if (showActions && actionsMenuRef.current) {
            const rect = actionsMenuRef.current.getBoundingClientRect();
            const dropdownHeight = 70;
            if (rect.bottom + dropdownHeight > window.innerHeight) {
                setActionMenuUp(true);
            } else {
                setActionMenuUp(false);
            }
        }
    }, [showActions]);

    const handleNoteEdit = () => {
        setIsEditingNote(true);
    };

    const handleNoteSave = () => {
        setIsEditingNote(false);
        onNoteChange(editedNote);
    };

    const handleNoteCancel = () => {
        setEditedNote(job.note || '');
        setIsEditingNote(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleCardClick = () => {
        // setSelectedJobDetail(job);
        // setSelectedJobId(job.id);s
        // setIsDialogOpen(true);
    };

    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev);
    };

    const handleDateSelect = (date: string) => {
        onApplyDueDateChange(date);
    };

    return (
        <>
            {showCalendar ? (
                <CalendarDialog
                    toggle={toggleCalendar}
                    onSelectDate={handleDateSelect}
                    title="이 공고의 마감일을 지정하세요"
                />
            ) : (
                <></>
            )}
            {isMobile ? (
                <>
                    <div className={style.jobCard} onClick={handleCardClick}>
                        <div className={style.jobCard__header}>
                            <div className={style.jobCard__companyInfo}>
                                <div className={style.jobCard__companyName}>{job.companyName}</div>
                            </div>
                            <button
                                className={style.jobCard__deleteButton}
                                onClick={() => {
                                    onRemove();
                                    alert('관리 중인 공고가 삭제되었습니다');
                                }}>
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className={style.jobCard__content}>
                            <h3 className={style.jobCard__title}>{job.jobTitle}</h3>
                            {!job.applyDueDate ||
                            job.applyDueDate === 'undefined' ||
                            job.applyDueDate === 'null' ? (
                                <p className={style.jobCard__dueDate} onClick={toggleCalendar}>
                                    {(job.applyDueDate ? job.applyDueDate.replace(/-/g, '.') : '') +
                                        ' 마감'}
                                </p>
                            ) : (
                                <button className={style.calendarButton} onClick={toggleCalendar}>
                                    이 공고의 마감일을 설정하세요
                                </button>
                            )}
                            <div className={style.jobCard__footer}>
                                <div className={style.jobCard__tags}>
                                    <div className={style.jobCard__tags__container}>
                                        <div
                                            className={style.item__statusContainer}
                                            ref={statusDropdownRef}>
                                            <button
                                                className={style.item__status}
                                                onClick={() =>
                                                    setShowStatusDropdown(!showStatusDropdown)
                                                }
                                                style={{
                                                    backgroundColor: getStatusColor(
                                                        job.applyStatus
                                                    ),
                                                }}>
                                                {job.applyStatus}
                                            </button>

                                            {showStatusDropdown && (
                                                <div
                                                    className={`${style.item__statusDropdown} ${
                                                        dropUp ? style.dropUp : ''
                                                    }`}>
                                                    {statusOptions.map((status) => (
                                                        <div
                                                            key={status}
                                                            className={style.item__statusOption}
                                                            onClick={() => {
                                                                onStatusChange(status);
                                                                setShowStatusDropdown(false);
                                                            }}>
                                                            <span
                                                                className={style.item__statusDot}
                                                                style={{
                                                                    backgroundColor:
                                                                        getStatusColor(status),
                                                                }}></span>
                                                            {status}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {isEditingNote ? (
                                        <div className={style.item__editField}>
                                            <textarea
                                                ref={noteInputRef}
                                                value={editedNote}
                                                onChange={(e) => setEditedNote(e.target.value)}
                                                className={style.item__textarea}
                                                placeholder="메모를 입력하세요..."
                                            />
                                            <div className={style.item__editActions}>
                                                <button
                                                    className={style.item__editButton}
                                                    onClick={handleNoteSave}>
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className={style.item__editButton}
                                                    onClick={handleNoteCancel}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`${style.item__note} ${
                                                !job.note ? style.item__notePlaceholder : ''
                                            }`}
                                            onClick={handleNoteEdit}>
                                            {job.note || '메모 추가...'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* <div className={style.jobCard__footer}>
                                <button
                                    className={style.jobCard__viewButton}
                                    onClick={handleCardClick}>
                                    <ExternalLink size={16} />
                                    <span>상세보기</span>
                                </button>
                            </div> */}
                        </div>
                    </div>
                </>
            ) : (
                <div className={style.item}>
                    <div className={style.item__cell}>
                        <div className={style.item__text}>{job.jobTitle}</div>
                    </div>

                    <div className={style.item__cell}>
                        <div className={style.item__text}>{job.companyName}</div>
                    </div>

                    <div className={style.item__cell}>
                        <div className={style.item__date} onClick={toggleCalendar}>
                            {!job.applyDueDate ? '마감일 지정' : formatDate(job.applyDueDate ?? '')}
                        </div>
                    </div>

                    <div className={style.item__cell}>
                        {isEditingNote ? (
                            <div className={style.item__editField}>
                                <textarea
                                    ref={noteInputRef}
                                    value={editedNote}
                                    onChange={(e) => setEditedNote(e.target.value)}
                                    className={style.item__textarea}
                                    placeholder="메모를 입력하세요..."
                                />
                                <div className={style.item__editActions}>
                                    <button
                                        className={style.item__editButton}
                                        onClick={handleNoteSave}>
                                        <Check size={16} />
                                    </button>
                                    <button
                                        className={style.item__editButton}
                                        onClick={handleNoteCancel}>
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`${style.item__note} ${
                                    !job.note ? style.item__notePlaceholder : ''
                                }`}
                                onClick={handleNoteEdit}>
                                {job.note || '메모 추가...'}
                            </div>
                        )}
                    </div>

                    <div className={style.item__cell}>
                        <div className={style.item__statusContainer} ref={statusDropdownRef}>
                            <button
                                className={style.item__status}
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                style={{ backgroundColor: getStatusColor(job.applyStatus) }}>
                                {job.applyStatus}
                            </button>

                            {showStatusDropdown && (
                                <div
                                    className={`${style.item__statusDropdown} ${
                                        dropUp ? style.dropUp : ''
                                    }`}>
                                    {statusOptions.map((status) => (
                                        <div
                                            key={status}
                                            className={style.item__statusOption}
                                            onClick={() => {
                                                onStatusChange(status);
                                                setShowStatusDropdown(false);
                                            }}>
                                            <span
                                                className={style.item__statusDot}
                                                style={{
                                                    backgroundColor: getStatusColor(status),
                                                }}></span>
                                            {status}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={style.item__cell}>
                        <div className={style.item__actions} ref={actionsMenuRef}>
                            <button
                                className={style.item__actionsButton}
                                onClick={() => setShowActions(!showActions)}>
                                <MoreHorizontal size={16} />
                            </button>

                            {showActions && (
                                <div
                                    className={`${style.item__actionsMenu} ${
                                        actionMenuUp ? style.dropUp : ''
                                    }`}>
                                    <button
                                        className={`${style.item__actionsMenuItem} ${style.item__actionsMenuItemDanger}`}
                                        onClick={() => {
                                            onRemove();
                                            setShowActions(false);
                                        }}>
                                        <Trash size={14} />
                                        <span>삭제</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageItem;
