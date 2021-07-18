import styled from '@emotion/styled';
import React, { FunctionComponent, useState } from 'react';
import { ArrowLeft } from 'react-feather';

import { Button, ToolbarContainer, Input, ToolbarButton } from '../../components/styled';
import { colors } from '../../components/styled/colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addNewFeedCommand } from '../../store/slices/feeds';

const Container = styled.div``;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
`;

const Title = styled.h1`
    align-self: center;
    font-size: 1.1rem;
    font-weight: 600;
    margin: auto;
`;

const Label = styled.label`
    font-size: 1rem;
    line-height: 1.8rem;
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

interface Props {
    onCancel: () => void;
}

const isValidURL = (str: string) => {
    const res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    );
    return res !== null;
};

const NewFeedForm: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const newFeeds = useAppSelector((state) => state.session.newFeeds);

    const [newFeedUrl, setNewFeedUrl] = useState('https://uebermedien.de/author/samira-el-ouassil/feed/');

    const [newFeedUrlMessage, setNewFeedUrlMessage] = useState('');

    return (
        <Container>
            <ToolbarContainer>
                <ToolbarButton onClick={props.onCancel}>
                    <ArrowLeft />
                </ToolbarButton>
                <Title>Add New Feed</Title>
            </ToolbarContainer>
            <ContentContainer>
                <Label>Feed URL</Label>
                <Input
                    placeholder="https://blog.mozilla.org/en/feed/"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    onFocus={() => setNewFeedUrlMessage('')}></Input>
                <AddButton
                    onClick={() => {
                        if (!isValidURL(newFeedUrl)) {
                            setNewFeedUrlMessage('The ented URL is invalid.');
                            return;
                        }

                        const existingFeed = feeds.find((x) => x.url === newFeedUrl);

                        if (existingFeed === undefined) {
                            dispatch(addNewFeedCommand(newFeedUrl));
                        } else {
                            setNewFeedUrlMessage(`You are already subscribed to that feed (${existingFeed.title})`);
                        }
                    }}>
                    Add New Feed
                </AddButton>
                <MessageBox show={newFeedUrlMessage !== ''}>{newFeedUrlMessage}</MessageBox>

                <Label>Recently added Feeds:</Label>
                <ul>
                    {newFeeds.map((newFeed) => {
                        switch (newFeed.status) {
                            case 'loading':
                                return <li>loading...</li>;
                            case 'loaded': {
                                const loadedFeed = feeds.find((f) => f.url === newFeed.url);
                                if (loadedFeed !== undefined) {
                                    return <li>{loadedFeed.title}</li>;
                                } else {
                                    return <li>{newFeed.url}</li>;
                                }
                            }
                            case 'error':
                                return <li>error: {newFeed.url}</li>;
                        }
                    })}
                </ul>
            </ContentContainer>
        </Container>
    );
};

export default NewFeedForm;
