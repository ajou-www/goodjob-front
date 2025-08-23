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

interface NewJobDialogProps {
    onClose: () => void;
    props: NotificationJobItem[] | null;
}

function NewJobDialog({ onClose, props }: NewJobDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const notiJobList = useNotificationStore((state) => state.notiJobList);
    const { fetchNotiJobList } = useNotificationStore();
    const [isJobDetailDialogOpen, setIsJobDetailDialogOpen] = useState(false);
    const { setSelectedJobDetail, lastSelectedJob } = useJobStore();
    const { name } = useUserStore();

    // 다이얼로그가 열릴 때 input이 focus 상태면 blur 처리
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
                                                // isBookmarked: !!bookmarkedList?.some((b) => b.id === job.id),
                                            }}
                                            isSelected={false}
                                            onSelect={() => {
                                                setIsJobDetailDialogOpen(true);
                                                // mountJobDetailDialog();
                                                setSelectedJobDetail(job);
                                            }}
                                            onToggleBookmark={() => {}}
                                        />
                                    ))
                                ) : (
                                    <></>
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
