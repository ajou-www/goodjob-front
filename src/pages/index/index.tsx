import styles from './styles/index.module.scss';
import SideBar from '../../components/common/sideBar/SideBar';
import MainHeader from '../../components/common/header/MainHeader';
import usePageStore from '../../store/pageStore';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/common/header/Header';

function Index() {
    const isCompactMenu = usePageStore((state) => state.isCompactMenu);
    const location = useLocation();
    const path = location.pathname;
    const isMobile = window.matchMedia('only screen and (max-width: 480px)').matches;

    // admin 관련 경로에서는 MainHeader를 숨김
    const hideHeader =
        path.includes('admin/dashboard') ||
        path.includes('admin/jobManage') ||
        path.includes('admin/feedback');

    return (
        <div className={styles.layout__wrapper}>
            <div className={styles.layout}>
                {!isMobile && <SideBar />}
                <div className={`${styles.mainContent} ${isCompactMenu ? styles.hidden : ''}`}>
                    {!hideHeader && !isMobile && <MainHeader />}
                    {isMobile && <Header />}
                    <div className={styles.mainContent__container}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
