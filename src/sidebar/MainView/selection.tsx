import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { NodeMeta } from '../../model/feeds';

type NodeSelection = {
    selectedNode: NodeMeta | undefined;
    selectNode: (node: NodeMeta) => void;
    clearNodeSelection: () => void;
};

type ItemSelection = {
    selectedFeedItemId: string | undefined;
    selectFeedItem: (itemId: string) => void;
};

const NodeSelectionContext = createContext<NodeSelection | undefined>(undefined);
const ItemSelectionContext = createContext<ItemSelection | undefined>(undefined);

// The selection lives here and not in MainView because MainView is memoized: its children keep
// their identity across a selection change, so only the trees and lists that consume a context
// re-render instead of every view.
export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedNode, setSelectedNode] = useState<NodeMeta>();
    const [selectedFeedItemId, setSelectedFeedItemId] = useState<string>();

    const selectNode = useCallback((node: NodeMeta) => {
        setSelectedNode(node);
        setSelectedFeedItemId(undefined);
    }, []);

    const clearNodeSelection = useCallback(() => setSelectedNode(undefined), []);

    const selectFeedItem = useCallback((itemId: string) => setSelectedFeedItemId(itemId), []);

    const nodeSelection = useMemo(
        () => ({ selectedNode, selectNode, clearNodeSelection }),
        [selectedNode, selectNode, clearNodeSelection],
    );

    const itemSelection = useMemo(
        () => ({ selectedFeedItemId, selectFeedItem }),
        [selectedFeedItemId, selectFeedItem],
    );

    return (
        <NodeSelectionContext.Provider value={nodeSelection}>
            <ItemSelectionContext.Provider value={itemSelection}>{children}</ItemSelectionContext.Provider>
        </NodeSelectionContext.Provider>
    );
};

export const useNodeSelection = (): NodeSelection => {
    const context = useContext(NodeSelectionContext);

    if (context === undefined) {
        throw new Error('useNodeSelection must be used within a SelectionProvider');
    }

    return context;
};

export const useItemSelection = (): ItemSelection => {
    const context = useContext(ItemSelectionContext);

    if (context === undefined) {
        throw new Error('useItemSelection must be used within a SelectionProvider');
    }

    return context;
};
