import JobDetail from './JobDetail';
import JobList from './JobList';
import style from './styles/RecommendJob.module.scss';

function RecommendJob() {
    const isMobile = window.matchMedia('only screen and (max-width: 480px)').matches;

    return (
        <div className={style.mainContent__jobSection}>
            <div className={style.mainContent__jobList}>
                <JobList />
            </div>

            {isMobile ? (
                <></>
            ) : (
                <div className={style.mainContent__jobDetail}>
                    <JobDetail isDialog={false} />
                </div>
            )}
        </div>
    );
}

export default RecommendJob;
