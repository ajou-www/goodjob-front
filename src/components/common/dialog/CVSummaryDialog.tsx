import { Suspense, useEffect, useRef, useState } from 'react';
import style from './styles/CVSummaryDialog.module.scss';
import { X } from 'lucide-react';
import { parseMarkdown } from '../../../utils/markdown';
import Loading from '../loading/Loading';
import LoadingSpinner from '../loading/LoadingSpinner';
import ErrorFallback from '../error/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import useFileStore from '../../../store/fileStore';

interface CVSummaryDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

function CVSummaryDialog({ isOpen, onClose }: CVSummaryDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const summaryText = useFileStore((state) => state.summary);
    const [hasError, setHasError] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
        <div>
            <div className={style.overlay}>
                <div className={style.dialog} ref={dialogRef}>
                    <div className={style.header}>
                        <button className={style.closeButton} onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className={style.content}>
                        {' '}
                        <ErrorBoundary FallbackComponent={ErrorFallback}>
                            {hasError ? (
                                <div className={style.info__content__error}>
                                    <ErrorFallback />
                                </div>
                            ) : (
                                <div className={style.info__content}>
                                    {isSummaryLoading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <Suspense fallback={<Loading content="Summary" />}>
                                            <div
                                                className={style.feedbackText}
                                                dangerouslySetInnerHTML={{
                                                    __html: parseMarkdown(summaryText ?? ''),
                                                }}></div>
                                        </Suspense>
                                    )}
                                </div>
                            )}
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CVSummaryDialog;
