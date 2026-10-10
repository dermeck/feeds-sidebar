export const formatDuration = (seconds: number): string => {
    const totalSeconds = Math.floor(seconds);

    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
        return '';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = String(totalSeconds % 60).padStart(2, '0');

    if (hours === 0) {
        return `${minutes}:${remainingSeconds}`;
    }

    return `${hours}:${String(minutes).padStart(2, '0')}:${remainingSeconds}`;
};
