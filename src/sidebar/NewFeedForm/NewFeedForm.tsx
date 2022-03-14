import styled from '@emotion/styled';

import React, { FunctionComponent, RefObject, useRef, useState } from 'react';
import { ArrowLeft } from 'react-feather';

import { Button, ToolbarContainer, Input, ToolbarButton, Label } from '../../base-components';
import { colors } from '../../base-components/styled/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFeedsCommand } from '../../store/slices/feeds';
import sessionSlice, { View } from '../../store/slices/session';
import NewFeedsList from './NewFeedsList';

const Container = styled.div`
    height: 100%;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.5rem;
`;

const Title = styled.h1`
    align-self: center;
    margin: auto;

    font-size: 1.1rem;
    font-weight: 600;
`;

const MessageBox = styled.div`
    min-height: 2.2rem;
    padding: 0.5rem 1rem;
    background-color: ${(props: { show: boolean }) =>
        props.show ? colors.highlightBackgroundColorNoFocus : 'inherit'};
    border-radius: 4px;
`;

const AddButton = styled(Button)({ alignSelf: 'flex-end' });

const isValidURL = (str: string) => {
    const res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
    );
    return res !== null;
};

interface NewFeedFormProps {
    urlInputRef: RefObject<HTMLInputElement>;
}

const NewFeedForm: FunctionComponent<NewFeedFormProps> = (props) => {
    const addButtonRef = useRef<HTMLButtonElement>(null);

    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);

    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [newFeedUrlMessage, setNewFeedUrlMessage] = useState('');
    const [addButtonActive, setAddButtonActive] = useState(false);
    const [addedFeedUrls, setAddedFeedUrls] = useState<string[]>([]);

    return (
        <Container>
            <ToolbarContainer>
                <ToolbarButton onClick={() => dispatch(sessionSlice.actions.changeView(View.feedList))}>
                    <ArrowLeft />
                </ToolbarButton>
                <Title>Add New Feed</Title>
            </ToolbarContainer>
            <ContentContainer>
                <Label>Feed URL</Label>
                <Input
                    ref={props.urlInputRef}
                    placeholder="https://blog.mozilla.org/en/feed/"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    onFocus={() => setNewFeedUrlMessage('')}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            setAddButtonActive(true);
                            addButtonRef.current?.click();
                        }
                    }}
                    onKeyUp={(e) => {
                        if (e.code === 'Enter') {
                            setAddButtonActive(false);
                        }
                    }}
                />

                <AddButton
                    ref={addButtonRef}
                    active={addButtonActive}
                    onClick={() => {
                        if (!isValidURL(newFeedUrl)) {
                            setNewFeedUrlMessage('The ented URL is invalid.');
                            return;
                        }

                        const existingFeed = feeds.find((x) => x.url === newFeedUrl);

                        if (existingFeed === undefined) {
                            setAddedFeedUrls((oldItems) => [...oldItems, newFeedUrl]);
                            dispatch(fetchFeedsCommand([newFeedUrl]));
                        } else {
                            setNewFeedUrlMessage(`You are already subscribed to that feed (${existingFeed.title})`);
                        }
                    }}>
                    Add New Feed
                </AddButton>
                <MessageBox show={newFeedUrlMessage !== ''}>{newFeedUrlMessage}</MessageBox>

                <NewFeedsList newFeedUrls={addedFeedUrls} />
            </ContentContainer>
        </Container>
    );
};

export default NewFeedForm;
