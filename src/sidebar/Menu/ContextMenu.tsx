/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FunctionComponent } from 'react';

import { MenuContainer, MenuList } from '../../base-components';
import { useAppDispatch } from '../../store/hooks';
import { deleteSelectedFeedCommand } from '../../store/slices/feeds';
import { Point } from '../../store/slices/session';
import MenuItem from './MenuItem';

interface Props {
    anchorPoint: Point;
}

const ContextMenu: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    // TODO open menu to the left if x coordinate is to far right
    return (
        <MenuContainer anchorTop={props.anchorPoint.y} anchorLeft={props.anchorPoint.x}>
            <MenuList>
                <MenuItem onMouseDown={() => dispatch(deleteSelectedFeedCommand())}>Delete Feed</MenuItem>
            </MenuList>
        </MenuContainer>
    );
};

export default ContextMenu;
