import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import optionsSlice, {
    DIAGNOSIS_DAYS_MAX,
    DIAGNOSIS_DAYS_MIN,
    FETCH_THREADS_MAX,
    FETCH_THREADS_MIN,
    FEED_UPDATE_MINUTES_MAX,
    FEED_UPDATE_MINUTES_MIN,
    MAX_ITEMS_PER_FEED_DEFAULT,
    selectOptions,
} from '../store/slices/options';
import { Button } from '../base-components/Button/Button';
import { Select } from '../base-components/Select/Select';
import { Toggle } from '../base-components/Toggle/Toggle';
import { NumberField } from './fields/NumberField';
import { OptionField } from './fields/OptionField';

export const OptionsPage = () => {
    const dispatch = useAppDispatch();
    const options = useAppSelector(selectOptions);

    const setUpdateInterval = (value: number) => dispatch(optionsSlice.actions.changeFeedUpdatePeriodInMinutes(value));

    const setFetchThreads = (value: number) => dispatch(optionsSlice.actions.changeFetchThreadsCount(value));

    const setInactiveDays = (value: number) => dispatch(optionsSlice.actions.changeDiagnosisInactiveDays(value));

    const setMaxItemsPerFeed = (value: number) => dispatch(optionsSlice.actions.changeMaxItemsPerFeed(value));

    return (
        <div className="options-page">
            <header className="options-page__header">
                <h1 className="options-page__title">Feeds Settings</h1>
            </header>

            <main className="options-page__content">
                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Feeds &amp; Updating</h2>

                    <NumberField
                        label="Update interval"
                        description="How often the Feeds sidebar looks for new items. (minutes)"
                        value={options.feedUpdatePeriodInMinutes}
                        min={FEED_UPDATE_MINUTES_MIN}
                        max={FEED_UPDATE_MINUTES_MAX}
                        onCommit={setUpdateInterval}
                    />

                    <NumberField
                        label="Parallel fetches"
                        description="How many feeds are fetched at the same time. A higher number is faster but uses more resources."
                        value={options.fetchThreadsCount}
                        min={FETCH_THREADS_MIN}
                        max={FETCH_THREADS_MAX}
                        onCommit={setFetchThreads}
                    />
                </section>

                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Discovery</h2>

                    <OptionField
                        label="Detect feeds on web pages"
                        description="Automatically look for available feeds on the active tab and suggest them when adding a new feed."
                    >
                        <Toggle
                            checked={options.feedDetectionEnabled}
                            onChange={(checked) => dispatch(optionsSlice.actions.changeFeedDetectionEnabled(checked))}
                        />
                    </OptionField>
                </section>

                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Behavior</h2>

                    <OptionField
                        label="Show unread count on the toolbar icon"
                        description="Display the total number of unread items in a badge on the extension toolbar icon (top bar)."
                    >
                        <Toggle
                            checked={options.showUnreadBadge}
                            onChange={(checked) => dispatch(optionsSlice.actions.changeShowUnreadBadge(checked))}
                        />
                    </OptionField>

                    <NumberField
                        label="Max items per feed"
                        description={`Keep at most this many items per feed. Newer items are kept, older ones are removed. Defaults to ${MAX_ITEMS_PER_FEED_DEFAULT}. Set to 0 for unlimited.`}
                        value={options.maxItemsPerFeed}
                        min={0}
                        onCommit={setMaxItemsPerFeed}
                    />
                </section>

                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Appearance</h2>

                    <OptionField label="Sidebar background">
                        <Select
                            value={options.sidebarSurface}
                            options={[
                                { value: 'auto', label: 'Auto' },
                                { value: 'builtin-theme', label: 'Built-in theme' },
                                { value: 'system-theme', label: 'System theme' },
                            ]}
                            onChange={(value) => dispatch(optionsSlice.actions.sidebarSurfaceChanged(value))}
                        />
                    </OptionField>

                    <OptionField label="Date group cards">
                        <Select
                            value={options.dateGroupCardStyle}
                            options={[
                                { value: 'flat', label: 'Flat' },
                                { value: 'raised', label: 'Raised' },
                            ]}
                            onChange={(value) => dispatch(optionsSlice.actions.dateGroupCardStyleChanged(value))}
                        />
                    </OptionField>
                </section>

                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Diagnosis</h2>

                    <NumberField
                        label="Inactive threshold"
                        description="A feed is shown as inactive when it has no new item within this many days. (days)"
                        value={options.diagnosisInactiveDays}
                        min={DIAGNOSIS_DAYS_MIN}
                        max={DIAGNOSIS_DAYS_MAX}
                        onCommit={setInactiveDays}
                    />
                </section>

                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Data</h2>

                    <OptionField
                        label="Reset settings"
                        description="Restore all settings to their default values. Your subscribed feeds are not affected."
                    >
                        <Button
                            className="options-page__reset-button"
                            onClick={() => dispatch(optionsSlice.actions.resetOptions())}
                        >
                            Reset to defaults
                        </Button>
                    </OptionField>
                </section>
            </main>
        </div>
    );
};
