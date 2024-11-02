import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ArrowLeft } from 'phosphor-react';

import React, { RefObject, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { fetchFeedsCommand } from '../../store/slices/feeds';
import NewFeedsList from './NewFeedsList';
import DetectedFeeds from './DetectedFeeds/DetectedFeeds';
import { Button } from '../../base-components/Button/Button';
import { Header } from '../../base-components/Header/Header';

const Container = styled.div`
    height: 100%;
`;

const toolbarContainerheight = '48px'; // TODO mr use var or FullHeightScrollCOntainer / main content container

const ContentContainer = styled.div`
    display: flex;
    height: calc(100vh - ${toolbarContainerheight});
    gap: 4px;

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

// TODO mr SubScribeView
const NewFeedForm = (props: NewFeedFormProps) => {
    const theme = useTheme();

    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const feedDetectionEnabled = useAppSelector((state) => state.options.feedDetectionEnabled);

    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [newFeedUrlMessage, setNewFeedUrlMessage] = useState('');
    const [addedFeedUrls, setAddedFeedUrls] = useState<string[]>([]);

    const addNewFeed = (url: string) => {
        setAddedFeedUrls((oldItems) => (oldItems.includes(url) ? oldItems : [...oldItems, url]));
        dispatch(fetchFeedsCommand([url]));
    };

    const removeFeed = (feedUrl: string) => {
        setAddedFeedUrls((oldItems) => oldItems.filter((x) => x !== feedUrl));
        dispatch(feedsSlice.actions.deleteFeed({ url: feedUrl }));
    };

    const addFeed = () => {
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
    };

    return (
        <Container>
            <Header>
                <Button variant="toolbar" title="Back to Feed List" onClick={props.onClose}>
                    <ArrowLeft size={22} />
                </Button>
                <Title>Add New Feed</Title>
            </Header>
            <ContentContainer>
                <form
                    className="subscribe-view__add-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addFeed();
                    }}>
                    <label className="subscribe-view__section-heading">Feed URL</label>
                    <input
                        className="text-input"
                        ref={props.urlInputRef}
                        placeholder="https://blog.mozilla.org/en/feed/"
                        value={newFeedUrl}
                        onChange={(e) => setNewFeedUrl(e.target.value)}
                        onFocus={() => setNewFeedUrlMessage('')}
                    />
                    <Button type="submit" className="subscribe-view__add-button">
                        Add New Feed
                    </Button>
                </form>
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
