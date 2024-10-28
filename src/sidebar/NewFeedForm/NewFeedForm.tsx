import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ArrowLeft } from 'phosphor-react';

import React, { FunctionComponent, RefObject, useRef, useState } from 'react';

import { Button, ToolbarContainer, Input, ToolbarButton, Label, toolbarContainerheight } from '../../base-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { fetchFeedsCommand } from '../../store/slices/feeds';
import NewFeedsList from './NewFeedsList';
import DetectedFeeds from './DetectedFeeds/DetectedFeeds';

const Container = styled.div`
    height: 100%;
`;

const ContentContainer = styled.div`
    display: flex;
    height: calc(100vh - ${toolbarContainerheight});

    flex-direction: column;
    padding: 0.5rem;
`;

const Title = styled.h1`
    align-self: center;
    margin: auto;

    font-size: 1.1rem;
    font-weight: 600;
`;

const MessageBox = styled.div<{ show: boolean }>`
    min-height: 2.2rem;
    padding: 0.5rem 1rem;

    border-radius: 4px;
    background-color: ${(props) => (props.show ? props.theme.colors.messageBackgroundColor : 'inherit')};
    color: ${(props) => props.theme.colors.messageTextColor};
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
    onClose: () => void;
}

const NewFeedForm: FunctionComponent<NewFeedFormProps> = (props) => {
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const theme = useTheme();

    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const feedDetectionEnabled = useAppSelector((state) => state.options.feedDetectionEnabled);

    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [newFeedUrlMessage, setNewFeedUrlMessage] = useState('');
    const [addButtonActive, setAddButtonActive] = useState(false);
    const [addedFeedUrls, setAddedFeedUrls] = useState<string[]>([]);

    const addNewFeed = (url: string) => {
        setAddedFeedUrls((oldItems) => (oldItems.includes(url) ? oldItems : [...oldItems, url]));
        dispatch(fetchFeedsCommand([url]));
    };

    const removeFeed = (feedUrl: string) => {
        setAddedFeedUrls((oldItems) => oldItems.filter((x) => x !== feedUrl));
        dispatch(feedsSlice.actions.deleteFeed({ url: feedUrl }));
    };

    return (
        <Container>
            <ToolbarContainer>
                <ToolbarButton title="Back to Feed List" onClick={props.onClose}>
                    <ArrowLeft size={22} />
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

                        const existingFeed = feeds.find((x) => x.id === newFeedUrl);

                        if (existingFeed === undefined) {
                            addNewFeed(newFeedUrl);
                        } else {
                            setNewFeedUrlMessage(`You are already subscribed to that feed (${existingFeed.title})`);
                        }
                    }}>
                    Add New Feed
                </AddButton>
                <MessageBox theme={theme} show={newFeedUrlMessage !== ''}>
                    {newFeedUrlMessage}
                </MessageBox>

                {feedDetectionEnabled && <DetectedFeeds addNewFeed={addNewFeed} removeFeed={removeFeed} />}
                <NewFeedsList newFeedUrls={addedFeedUrls} />
            </ContentContainer>
        </Container>
    );
};

export default NewFeedForm;
