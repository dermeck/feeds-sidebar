import { clsx } from 'clsx';
import React, { RefObject } from 'react';
import { NodeType } from '../../../../../model/feeds';
import { useDragDropNode } from '../useDragDropNode';
import { DragDropIndicator } from '../indicator/DragDropIndicator';
import { RelativeDragDropPosition } from '../../../../../utils/dragdrop';

type DragDropContainerProps = {
    nodeMeta: { nodeId: string; nodeType: NodeType };
    selected: boolean;
    className: string;
    refObj: RefObject<HTMLDivElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const DragDropContainer = ({ nodeMeta, children, className, refObj, ...rest }: DragDropContainerProps) => {
    const {
        isDropNotAllowed,
        relativeDropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
    } = useDragDropNode(nodeMeta);

    return (
        <div
            {...rest}
            ref={refObj}
            className={clsx(
                className,
                'drag-drop__container',
                isDropNotAllowed && 'drag-drop__container--disabled',
                relativeDropPosition === RelativeDragDropPosition.Top && 'drag-drop__container--drag-top-actice',
                relativeDropPosition === RelativeDragDropPosition.Middle && 'drag-drop__container--drag-middle-actice',
                relativeDropPosition === RelativeDragDropPosition.Bottom && 'drag-drop__container--drag-bottom-actice',
            )}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}>
            <DragDropIndicator type="top" active={relativeDropPosition === RelativeDragDropPosition.Top} />
            {children}
            <DragDropIndicator type="bottom" active={relativeDropPosition === RelativeDragDropPosition.Bottom} />
        </div>
    );
};
