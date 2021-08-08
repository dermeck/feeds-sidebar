/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FunctionComponent } from 'react';
import { Plus } from 'react-feather';

import { MenuContainer, MenuList } from '../../base-components';
import { Divider } from '../../base-components/styled/Divider';
import { useAppDispatch } from '../../store/hooks';
import { Point } from '../../store/slices/session';
import MenuItem from './MenuItem';

interface Props {
    anchorPoint: Point;
}

const MoreMenu: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    // TODO implement menu items
    return (
        <MenuContainer anchorTop={props.anchorPoint.y} anchorLeft={props.anchorPoint.x}>
            <MenuList>
                <MenuItem icon="plus" onMouseDown={() => console.log('set view ..')}>
                    Add New Feeds
                </MenuItem>

                <Divider />

                <MenuItem icon="arrowUp-circle" onMouseDown={() => console.log('export..')}>
                    Export
                </MenuItem>
                <MenuItem icon="arrowDown-circle" onMouseDown={() => console.log('import..')}>
                    Import
                </MenuItem>
            </MenuList>
        </MenuContainer>
    );
};

export default MoreMenu;
