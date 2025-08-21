import { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import style from './styles/NewJobDialog.module.scss';
import { X } from 'lucide-react';
import Job from '../../../types/job';
import JobCard from '../../../pages/index/components/jobList/JobCard';
import useJobStore from '../../../store/jobStore';
import JobDetailDialog from '../../../pages/index/components/bookmark/JobDetailDialog';

interface NewJobDialogProps {
    onClose: () => void;
}

function NewJobDialog({ onClose }: NewJobDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const [isJobDetailDialogOpen, setIsJobDetailDialogOpen] = useState(false);
    const { setSelectedJobDetail, lastSelectedJob } = useJobStore();

    const mockJobList: Job[] = [
        {
            id: 1,
            regions: [{ id: 1, cd: '11', sido: '서울', sigungu: '강남구' }],
            companyName: '네이버',
            title: '프론트엔드 개발자',
            department: 'FE팀',
            requireExperience: '경력',
            jobType: '정규직',
            requirements: 'React, TypeScript 경험',
            preferredQualifications: 'Next.js 경험',
            idealCandidate: null,
            jobDescription: '웹 서비스 개발 및 유지보수',
            applyStartDate: '2024-07-01',
            applyEndDate: '2024-07-31',
            isPublic: true,
            createdAt: '2024-06-01',
            lastUpdatedAt: '2024-06-15',
            expiredAt: null,
            archivedAt: null,
            rawJobsText: null,
            url: 'https://naver.com/jobs/1',
            favicon: null,
            regionText: '서울 강남구',
            score: 98.5,
            cosineScore: 0.95,
            bm25Score: 0.9,
            isBookmarked: false,
        },
        {
            id: 2,
            regions: [{ id: 2, cd: '26', sido: '부산', sigungu: '해운대구' }],
            companyName: '카카오',
            title: '백엔드 개발자',
            department: 'BE팀',
            requireExperience: '신입',
            jobType: '정규직',
            requirements: 'Java, Spring 경험',
            preferredQualifications: 'AWS 경험',
            idealCandidate: null,
            jobDescription: 'API 서버 개발',
            applyStartDate: '2024-07-05',
            applyEndDate: '2024-07-25',
            isPublic: true,
            createdAt: '2024-06-05',
            lastUpdatedAt: '2024-06-20',
            expiredAt: null,
            archivedAt: null,
            rawJobsText: null,
            url: 'https://kakao.com/jobs/2',
            favicon: null,
            regionText: '부산 해운대구',
            score: 92.3,
            cosineScore: 0.91,
            bm25Score: 0.88,
            isBookmarked: true,
        },
        {
            id: 3,
            regions: [{ id: 3, cd: '41', sido: '경기', sigungu: '성남시' }],
            companyName: '라인',
            title: '데이터 엔지니어',
            department: '데이터팀',
            requireExperience: '경력',
            jobType: '계약직',
            requirements: 'Python, SQL 경험',
            preferredQualifications: '빅데이터 처리 경험',
            idealCandidate: null,
            jobDescription: '데이터 파이프라인 구축',
            applyStartDate: '2024-07-10',
            applyEndDate: '2024-08-10',
            isPublic: true,
            createdAt: '2024-06-10',
            lastUpdatedAt: '2024-06-22',
            expiredAt: null,
            archivedAt: null,
            rawJobsText: null,
            url: 'https://linecorp.com/jobs/3',
            favicon: null,
            regionText: '경기 성남시',
            score: 89.7,
            cosineScore: 0.89,
            bm25Score: 0.85,
            isBookmarked: false,
        },
        {
            id: 4,
            regions: [{ id: 4, cd: '11', sido: '서울', sigungu: '마포구' }],
            companyName: '토스',
            title: 'QA 엔지니어',
            department: 'QA팀',
            requireExperience: '경력무관',
            jobType: '인턴',
            requirements: '테스트 자동화 경험',
            preferredQualifications: 'Jest, Cypress 경험',
            idealCandidate: null,
            jobDescription: '서비스 품질 관리',
            applyStartDate: '2024-07-15',
            applyEndDate: '2024-08-05',
            isPublic: true,
            createdAt: '2024-06-12',
            lastUpdatedAt: '2024-06-25',
            expiredAt: null,
            archivedAt: null,
            rawJobsText: null,
            url: 'https://toss.im/jobs/4',
            favicon: null,
            regionText: '서울 마포구',
            score: 85.2,
            cosineScore: 0.87,
            bm25Score: 0.82,
            isBookmarked: false,
        },
        {
            id: 5,
            regions: [{ id: 5, cd: '28', sido: '인천', sigungu: '연수구' }],
            companyName: '배달의민족',
            title: '프로덕트 매니저',
            department: 'PM팀',
            requireExperience: '경력',
            jobType: '정규직',
            requirements: '프로덕트 관리 경험',
            preferredQualifications: 'IT 서비스 기획 경험',
            idealCandidate: null,
            jobDescription: '서비스 기획 및 운영',
            applyStartDate: '2024-07-20',
            applyEndDate: '2024-08-15',
            isPublic: true,
            createdAt: '2024-06-15',
            lastUpdatedAt: '2024-06-28',
            expiredAt: null,
            archivedAt: null,
            rawJobsText: null,
            url: 'https://baemin.com/jobs/5',
            favicon: null,
            regionText: '인천 연수구',
            score: 90.1,
            cosineScore: 0.92,
            bm25Score: 0.86,
            isBookmarked: true,
        },
    ];

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

    // 포탈로 띄울 수 있는 방법이 있나? => NewJobDialog를 언마운트하고 그 다음에 JobDetailDialog를 마운트
    const JobDetailDialogWrapper = () => {
        return <JobDetailDialog isOpen={isJobDetailDialogOpen} onClose={toggleDialog} />;
    };

    // JobDetailDialog를 토글 형식으로 포탈에 렌더링
    const mountJobDetailDialog = () => {
        if (isJobDetailDialogOpen) {
            return ReactDOM.createPortal(<JobDetailDialogWrapper />, document.body);
        }
        return null;
    };

    const dialog = (
        <>
            {/* {isJobDetailDialogOpen ? (
                <JobDetailDialog isOpen={isJobDetailDialogOpen} onClose={toggleDialog} />
            ) : (
                <></>
            )} */}
            <div
                className={style.dialogOverlay}
                onClick={handleOverlayClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialogTitle">
                <div
                    className={style.dialogContent}
                    ref={dialogRef}
                    onClick={(e) => e.stopPropagation()}>
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
                        **님의 CV에 맞는 새로운 공고들입니다.
                    </p>
                    <div className={style.dialogContent__jobListContainer}>
                        {mockJobList.map((job) => (
                            <JobCard
                                key={job.id}
                                job={{
                                    ...job,
                                    // isBookmarked: !!bookmarkedList?.some((b) => b.id === job.id),
                                }}
                                isSelected={false}
                                onSelect={() => {
                                    setIsJobDetailDialogOpen(true);
                                    mountJobDetailDialog();
                                    setSelectedJobDetail(job);
                                }}
                                onToggleBookmark={() => {}}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    // Portal로 body에 렌더링
    return ReactDOM.createPortal(dialog, document.body);
}

export default NewJobDialog;
