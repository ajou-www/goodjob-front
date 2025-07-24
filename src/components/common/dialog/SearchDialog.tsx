import { X } from 'lucide-react';
import style from './styles/SearchDialog.module.scss';
import SearchBar from '../search/SearchBar';

interface SearchDialogProps {
    onClose: () => void;
}
function SearchDialog({ onClose }: SearchDialogProps) {
    return (
        <div className={style.container}>
            <div className={style.header}>
                <h1 className={style.title}>검색</h1>
                <button className={style.closeButton} onClick={onClose}>
                    <X className={style.closeButton} size={24} />
                </button>
            </div>
            <div className={style.searchBarWrapper}>
                <SearchBar onClose={() => onClose()} />
            </div>
        </div>
    );
}

export default SearchDialog;
