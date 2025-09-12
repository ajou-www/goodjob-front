import { useState } from 'react';
import style from './Header.module.scss';
import { Search, Menu, X, ClipboardList, Star, Bookmark, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import ProfileDialog from '../dialog/ProfileDialog';
import SearchDialog from '../dialog/SearchDialog';
import HeaderNotificationButton from '../buttons/HeaderNotificationButton';

function Header() {
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();
    const isMobile = window.matchMedia('only screen and (max-width: 480px)').matches;
    const path = location.pathname;

    const hideLogo = path.includes('main');

    const userMenuItems = [
        {
            id: '지원 관리',
            path: 'manage',
            icon: ClipboardList,
        },
        {
            id: '추천 공고',
            path: 'recommend',
            icon: Star,
        },
        {
            id: '북마크',
            path: 'bookmark',
            icon: Bookmark,
        },
        {
            id: '나의 CV',
            path: 'mycv',
            icon: User,
        },
    ] as const;

    const moveToSignInPage = () => {
        navigate('./signIn');
    };

    const moveToLandingPage = () => {
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className={style.header}>
            <div className={style.header__container}>
                <button
                    className={style.header__menuButton}
                    onClick={toggleMobileMenu}
                    aria-label="메뉴 열기">
                    <Menu size={24} />
                </button>

                <div className={style.header__container__subContainer}>
                    <p className={style.header__logo} onClick={moveToLandingPage}>
                        {hideLogo ? '' : 'goodJob'}
                    </p>
                </div>

                <div className={style.header__actions}>
                    {isLoggedIn ? (
                        <>
                            <HeaderNotificationButton />{' '}
                            {isMobile ? (
                                <Search
                                    className={style.header__search}
                                    aria-label="검색"
                                    size={38}
                                    onClick={() => setSearchDialogOpen(true)}
                                />
                            ) : (
                                <></>
                            )}
                            {searchDialogOpen && (
                                <SearchDialog onClose={() => setSearchDialogOpen(false)} />
                            )}
                            <ProfileDialog />
                        </>
                    ) : (
                        <>
                            {/* Desktop buttons */}

                            <button className={style.header__signIn} onClick={moveToSignInPage}>
                                로그인
                            </button>

                            {/* Combined button for mobile */}
                            <button className={style.header__authButton} onClick={moveToSignInPage}>
                                로그인
                            </button>
                            {/* 테스트 버튼 */}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${style.mobileMenu} ${mobileMenuOpen ? style.active : ''}`}>
                <div className={style.mobileMenu__header}>
                    <p className={style.mobileMenu__logo} onClick={moveToLandingPage}>
                        goodJob
                    </p>
                    <button
                        className={style.mobileMenu__close}
                        onClick={toggleMobileMenu}
                        aria-label="메뉴 닫기">
                        <X size={33} />
                    </button>
                </div>

                {/* 모바일 메뉴 네비게이션 */}
                <nav className={style.mobileMenu__menu}>
                    {userMenuItems.map((item) => (
                        <li
                            key={item.id}
                            className={style.mobileMenu__menuItem}
                            onClick={toggleMobileMenu}>
                            <Link to={`/main/${item.path}`} className={style.mobileMenu__menuLink}>
                                <item.icon
                                    className={style.mobileMenu__menuIcon}
                                    size={30}></item.icon>
                                <span className={style.mobileMenu__menuText}>{item.id}</span>
                            </Link>
                        </li>
                    ))}
                </nav>

                {!isLoggedIn && (
                    <div className={style.mobileMenu__buttons}>
                        <button
                            className={style.mobileMenu__buttonsSignUp}
                            onClick={moveToSignInPage}>
                            회원가입
                        </button>
                        <button
                            className={style.mobileMenu__buttonsSignIn}
                            onClick={moveToSignInPage}>
                            로그인
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
