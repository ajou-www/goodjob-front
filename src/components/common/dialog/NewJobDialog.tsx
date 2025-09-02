import { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import style from './styles/NewJobDialog.module.scss';
import { X } from 'lucide-react';
import JobCard from '../../../pages/index/components/jobList/JobCard';
import useJobStore from '../../../store/jobStore';
import JobDetailDialog from '../../../pages/index/components/bookmark/JobDetailDialog';
import useNotificationStore from '../../../store/NotificationStore';
import JobDetail from '../../../pages/index/components/jobList/JobDetail';
import { NotificationJobItem } from '../../../types/notification';
import useUserStore from '../../../store/userStore';
import LoadingAnime1 from '../loading/LoadingAnime1';
import useBookmarkStore from '../../../store/bookmarkStore';

interface NotificationJobItems {
    props: NotificationJobItem[];
    cvId: number;
}
interface NewJobDialogProps {
    onClose: () => void;
    props: NotificationJobItems | null;
}

function NewJobDialog({ onClose, props }: NewJobDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const notiJobList = useNotificationStore((state) => state.notiJobList);
    const { fetchNotiJobList } = useNotificationStore();
    const [isJobDetailDialogOpen, setIsJobDetailDialogOpen] = useState(false);
    const { setSelectedJobDetail, lastSelectedJob } = useJobStore();
    const { name } = useUserStore();
    const bookmarkedList = useBookmarkStore((state) => state.bookmarkList);
    const { addBookmark, removeBookmark, getBookmark } = useBookmarkStore();

    // 낙관적 렌더링용 북마크 id 배열
    const [optimisticBookmarks, setOptimisticBookmarks] = useState<number[]>([]);

    // 북마크 목록이 바뀌면 동기화
    useEffect(() => {
        setOptimisticBookmarks(bookmarkedList?.map((job) => job.id) ?? []);
    }, [bookmarkedList]);

    useEffect(() => {
        if (document.activeElement && document.activeElement instanceof HTMLInputElement) {
            document.activeElement.blur();
        }
    }, []);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            setSelectedJobDetail(lastSelectedJob);
            onClose();
        }
    };

    const toggleDialog = () => {
        setIsJobDetailDialogOpen(!isJobDetailDialogOpen);
        mountJobDetailDialog();
    };

    const JobDetailDialogWrapper = () => {
        return <JobDetailDialog isOpen={isJobDetailDialogOpen} onClose={toggleDialog} />;
    };

    const mountJobDetailDialog = () => {
        if (isJobDetailDialogOpen) {
            return ReactDOM.createPortal(<JobDetailDialogWrapper />, document.body);
        }
        return null;
    };

    useEffect(() => {
        fetchNotiJobList(props);
    }, [fetchNotiJobList]);

    const toggleBookmark = async (jobId: number) => {
        const isBookmarked = optimisticBookmarks.includes(jobId);

        // UI 즉시 반영
        setOptimisticBookmarks((prev) =>
            isBookmarked ? prev.filter((id) => id !== jobId) : [...prev, jobId]
        );

        try {
            if (isBookmarked) {
                await removeBookmark(jobId);
            } else {
                await addBookmark(jobId);
            }
            await getBookmark();
        } catch (error) {
            // 실패 시 롤백
            setOptimisticBookmarks((prev) =>
                isBookmarked ? [...prev, jobId] : prev.filter((id) => id !== jobId)
            );
            console.error('북마크 토글 중 오류 발생:', error);
        }
    };

    const dialog = (
        <>
            <div
                className={style.dialogOverlay}
                onClick={handleOverlayClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialogTitle">
                <div
                    className={`${style.dialogContent} ${
                        isJobDetailDialogOpen ? style.noPadding : ''
                    }`}
                    ref={dialogRef}
                    onClick={(e) => e.stopPropagation()}>
                    {isJobDetailDialogOpen ? (
                        <div className={style.dialog}>
                            <div className={style.header}>
                                <button
                                    className={style.closeButton}
                                    onClick={() => setIsJobDetailDialogOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div className={style.content}>
                                <JobDetail isDialog={true} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={style.dialogContent__header}>
                                <h2 id="dialogTitle" className={style.dialogContent__title}>
                                    새로운 매칭 공고
                                </h2>
                                <button
                                    className={style.dialogContent__closeButton}
                                    onClick={onClose}
                                    aria-label="닫기">
                                    <X size={24} />
                                </button>
                            </div>
                            <p className={style.dialogContent__description}>
                                {name} 님의 CV에 맞는 새로운 공고들입니다.
                            </p>
                            <div className={style.dialogContent__jobListContainer}>
                                {Array.isArray(notiJobList) && notiJobList.length > 0 ? (
                                    notiJobList.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={{
                                                ...job,
                                                isBookmarked: optimisticBookmarks.includes(job.id),
                                            }}
                                            isSelected={false}
                                            onSelect={() => {
                                                setIsJobDetailDialogOpen(true);
                                                setSelectedJobDetail(job);
                                            }}
                                            onToggleBookmark={() => toggleBookmark(job.id)}
                                        />
                                    ))
                                ) : (
                                    <LoadingAnime1 />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );

    // Portal로 body에 렌더링
    return ReactDOM.createPortal(dialog, document.body);
}

export default NewJobDialog;
