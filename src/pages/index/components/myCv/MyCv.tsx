import { useState, useEffect, useRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useFileStore from '../../../../store/fileStore';
import CvViewer from './CvViewer';
import style from './styles/MyCv.module.scss';
import { Trash, CloudUpload, ScrollText } from 'lucide-react';
import CVReuploadDialog from '../../../../components/common/dialog/CVReuploadDialog';
import Loading from '../../../../components/common/loading/Loading';
import ErrorFallback from '../../../../components/common/error/ErrorFallback';
import LoadingSpinner from '../../../../components/common/loading/LoadingSpinner';
import { parseMarkdown } from '../../../../utils/markdown';
import { useLocation, useNavigate } from 'react-router-dom';
import useCvStore from '../../../../store/cvStore';
import usePageStore from '../../../../store/pageStore';
import CVDeleteDialog from '../../../../components/common/dialog/CVDeleteDialog';
import useActionStore from '../../../../store/actionStore';
import CVSummaryDialog from '../../../../components/common/dialog/CVSummaryDialog';
import useRecommendationStore from '../../../../store/recommendationCacheStore';

function MyCv() {
    const { getSummary, setSummaryCache } = useFileStore();
    const [hasError, setHasError] = useState(false);
    // 로딩
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const action = useActionStore((state) => state.cvAction);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [reuploadDialogHidden, setReuploadDialogHidden] = useState(false);
    const [deleteDialogHidden, setDeleteDialogHidden] = useState(false);
    const [summaryDialogHidden, setSummaryDialogHidden] = useState(false);
    const hasFile = useFileStore((state) => state.hasFile);
    const summaryText = useFileStore((state) => state.summary);
    const summaryCache = useFileStore((state) => state.summaryCache);
    const userCvList = useCvStore((state) => state.userCvList);
    const selectedCVId = useRecommendationStore((state) => state.selectedCVId);
    const getSelectedCVId = useRecommendationStore((state) => state.getSelectedCVId);
    const isMobile = window.matchMedia('only screen and (max-width: 480px)').matches;

    const navigate = useNavigate();
    const setPreviousPage = usePageStore((state) => state.setPreviousPage);
    const location = useLocation();

    const handleDeleteCV = () => {
        setDeleteDialogHidden((prev) => !prev);
    };

    const handleButtonClick = () => {
        setPreviousPage(location.pathname);
        navigate('/upload');
    };

    const viewSummary = () => {
        setSummaryDialogHidden((prev) => !prev);
    };

    useEffect(() => {
        const fetchCVSummary = async () => {
            try {
                setIsSummaryLoading(true);
                console.log(summaryCache[selectedCVId ?? 0]);
                if (!summaryCache[selectedCVId ?? 0]) {
                    if (selectedCVId) {
                        await getSummary(selectedCVId);
                        setSummaryCache(selectedCVId, summaryText ?? '');
                    } else {
                        getSelectedCVId();
                    }
                }
            } catch (error) {
                console.error('데이터 가져오기 에러:', error);
                setHasError(true);
            } finally {
                setIsSummaryLoading(false);
            }
        };
        setHasError(false);
        fetchCVSummary();
    }, [
        hasFile,
        userCvList,
        selectedCVId,
        action,
        getSummary,
        setSummaryCache,
        summaryCache,
        summaryText,
        getSelectedCVId,
    ]);

    useEffect(() => {
        if (hasError) {
            getSelectedCVId();
        }
    }, [hasError]);

    return (
        <>
            {summaryDialogHidden && (
                <CVSummaryDialog
                    isOpen={summaryDialogHidden}
                    onClose={() => setSummaryDialogHidden((prev) => !prev)}
                    isSummaryLoading={isSummaryLoading}
                    hasError={hasError}
                />
            )}
            {deleteDialogHidden && (
                <CVDeleteDialog
                    isOpen={deleteDialogHidden}
                    onClose={() => setDeleteDialogHidden((prev) => !prev)}
                    deleteAll={true}
                />
            )}
            {reuploadDialogHidden && (
                <CVReuploadDialog
                    isOpen={reuploadDialogHidden}
                    onClose={() => setReuploadDialogHidden((prev) => !prev)}
                />
            )}
            <div className={style.container}>
                <div className={style.info}>
                    {isMobile ? (
                        <button
                            className={`${style.button} ${style.normalButton}`}
                            onClick={viewSummary}>
                            <ScrollText size={18} />
                            나의 CV 요약
                        </button>
                    ) : (
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
                                                    __html: parseMarkdown(
                                                        summaryCache[selectedCVId ?? 0] ?? ''
                                                    ),
                                                }}></div>
                                        </Suspense>
                                    )}
                                </div>
                            )}
                        </ErrorBoundary>
                    )}

                    <div className={style.buttons}>
                        <button
                            className={`${style.button} ${style.criticalButton}`}
                            onClick={handleDeleteCV}>
                            <Trash size={18} />
                            업로드된 모든 CV 제거
                        </button>
                        <button className={style.button} onClick={handleButtonClick}>
                            <input
                                type="file"
                                accept=".pdf"
                                className={style.hiddenInput}
                                ref={fileInputRef}
                            />
                            <>
                                <CloudUpload size={18} />
                                CV 업로드
                            </>
                        </button>
                    </div>
                </div>
                <div className={style.cvviewer}>
                    <CvViewer />
                </div>
            </div>
        </>
    );
}

export default MyCv;
