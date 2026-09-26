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
import { TextInput } from '../base-components/TextInput/TextInput';
import { Toggle } from '../base-components/Toggle/Toggle';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Number() would accept strings like '0x10' and coerce a blank value to 0
const parseNumber = (value: string): number | undefined => {
    const parsed = Number(value);

    return value.trim() === '' || !Number.isFinite(parsed) ? undefined : parsed;
};

type NumberFieldProps = {
    label: string;
    description: string;
    value: number;
    min: number;
    max?: number;
    disabled?: boolean;
    onCommit: (value: number) => void;
};

const NumberField = ({ label, description, value, min, max, disabled, onCommit }: NumberFieldProps) => {
    const inputId = React.useId();
    const descriptionId = `${inputId}-description`;
    const [localValue, setLocalValue] = React.useState<string>(value.toString());
    const [previousValue, setPreviousValue] = React.useState(value);

    if (value !== previousValue) {
        setPreviousValue(value);
        setLocalValue(value.toString());
    }

    const commit = () => {
        const parsed = parseNumber(localValue);

        if (parsed === undefined) {
            // nothing usable was entered, so keep showing what is stored
            setLocalValue(value.toString());
            return;
        }

        const next = max === undefined ? parsed : clamp(parsed, min, max);
        setLocalValue(next.toString());
        onCommit(next);
    };

    return (
        <div className="options__field">
            <div className="options__field-text">
                <label className="options__field-label" htmlFor={inputId}>
                    {label}
                </label>
                <p className="options__field-description" id={descriptionId}>
                    {description}
                </p>
            </div>
            <TextInput
                id={inputId}
                aria-describedby={descriptionId}
                className="options__number-input"
                type="number"
                min={min}
                max={max}
                disabled={disabled}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.currentTarget.blur();
                    }
                }}
            />
        </div>
    );
};

type ToggleFieldProps = {
    label: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

const ToggleField = ({ label, description, checked, disabled, onChange }: ToggleFieldProps) => (
    <div className="options__field">
        <div className="options__field-text">
            <span className="options__field-label">{label}</span>
            <p className="options__field-description">{description}</p>
        </div>
        <Toggle label={label} checked={checked} disabled={disabled} onChange={onChange} hideLabel />
    </div>
);

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

                    <ToggleField
                        label="Detect feeds on web pages"
                        description="Automatically look for available feeds on the active tab and suggest them when adding a new feed."
                        checked={options.feedDetectionEnabled}
                        onChange={(checked) => dispatch(optionsSlice.actions.changeFeedDetectionEnabled(checked))}
                    />
                </section>

                <section className="options-page__section">
                    <h2 className="options-page__section-heading">Behavior</h2>

                    <ToggleField
                        label="Show unread count on the toolbar icon"
                        description="Display the total number of unread items in a badge on the extension toolbar icon (top bar)."
                        checked={options.showUnreadBadge}
                        onChange={(checked) => dispatch(optionsSlice.actions.changeShowUnreadBadge(checked))}
                    />

                    <NumberField
                        label="Max items per feed"
                        description={`Keep at most this many items per feed. Newer items are kept, older ones are removed. Defaults to ${MAX_ITEMS_PER_FEED_DEFAULT}. Set to 0 for unlimited.`}
                        value={options.maxItemsPerFeed}
                        min={0}
                        onCommit={setMaxItemsPerFeed}
                    />
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

                    <div className="options__field">
                        <div className="options__field-text">
                            <span className="options__field-label">Reset settings</span>
                            <p className="options__field-description">
                                Restore all settings to their default values. Your subscribed feeds are not affected.
                            </p>
                        </div>
                        <Button
                            className="options-page__reset-button"
                            onClick={() => dispatch(optionsSlice.actions.resetOptions())}
                        >
                            Reset to defaults
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
};
