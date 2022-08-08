import { formatDistanceStrict, formatDuration, intervalToDuration, milliseconds } from 'date-fns';

export const stringifyLength = ({ start, end }: { start: number; end: number }) => {
  const durations = intervalToDuration({ start, end });

  return formatDuration(durations);
};

export const normalizeAgo = (date: Date) => {
  return formatDistanceStrict(new Date(date), new Date(), { addSuffix: true });
};

export const setTimeDuration = (milliseconds: number) => {
  const durations = intervalToDuration({ start: 0, end: milliseconds });

  return;
};
