/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FunctionComponent } from 'react';

import { MenuContainer, MenuItem, MenuList } from '../../base-components';
import { useAppDispatch } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import { Point } from '../../store/slices/session';

interface Props {
    anchorPoint: Point;
}

const ContextMenu: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    const deleteSelectedFeed = () => {
        dispatch(feedsSlice.actions.deleteSelectedFeed());
    };

    // TODO open menu to the left if x coordinate is to far right
    return (
        <MenuContainer anchorTop={props.anchorPoint.y} anchorLeft={props.anchorPoint.x}>
            <MenuList>
                <MenuItem onMouseDown={deleteSelectedFeed}>Delete Feed</MenuItem>
            </MenuList>
        </MenuContainer>
    );
};

export default ContextMenu;
