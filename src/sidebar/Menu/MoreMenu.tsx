/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FunctionComponent } from 'react';

import { MenuContainer, MenuItem, MenuList } from '../../base-components';
import { useAppDispatch } from '../../store/hooks';
import { Point } from '../../store/slices/session';

interface Props {
    anchorPoint: Point;
}

const MoreMenu: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    // TODO implement menu items
    return (
        <MenuContainer anchorTop={props.anchorPoint.y} anchorLeft={props.anchorPoint.x}>
            <MenuList>
                <MenuItem onMouseDown={() => console.log('import..')}>Import</MenuItem>
                <MenuItem onMouseDown={() => console.log('export..')}>Export</MenuItem>
                <MenuItem onMouseDown={() => console.log('set view ..')}>Add New Feeds</MenuItem>
            </MenuList>
        </MenuContainer>
    );
};

export default MoreMenu;
