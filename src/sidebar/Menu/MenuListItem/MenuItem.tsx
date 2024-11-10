import { DownloadSimple, UploadSimple, CheckSquare, Plus, FolderSimplePlus } from '@phosphor-icons/react';

import React, { MouseEventHandler } from 'react';

import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';
import { clsx } from 'clsx';

type IconKeys = 'plus' | 'import' | 'export' | 'check-square' | 'folder-plus';

interface Props {
    icon?: IconKeys;
    children: React.ReactNode;
    onMouseDown: MouseEventHandler<HTMLLIElement>;
}

const renderIcon = (key: IconKeys) => {
    const size = 18;

    switch (key) {
        case 'plus':
            return <Plus size={size} />;

        case 'import':
            return <DownloadSimple size={size} weight="bold" />;

        case 'export':
            return <UploadSimple size={size} weight="bold" />;

        case 'check-square':
            return <CheckSquare size={size} weight="bold" />;

        case 'folder-plus':
            return <FolderSimplePlus size={size} />;

        default:
            throw new UnreachableCaseError(key);
    }
};

export const MenuListItem = (props: Props) => {
    return (
        <li
            className={clsx('menu__list-item', props.icon && 'menu__list-item--with-icon')}
            onMouseDown={props.onMouseDown} /*hasIcon={props.icon !== undefined}*/
        >
            {props.icon && <span className="menu__list-item-icon">{renderIcon(props.icon)}</span>}
            <div>{props.children}</div>
        </li>
    );
};
