import {
  format,
  formatDistanceStrict,
  formatDuration,
  intervalToDuration,
  lightFormat,
  milliseconds,
} from 'date-fns';

export const stringifyLength = ({ start, end }: { start: number; end: number }) => {
  const durations = intervalToDuration({ start, end });

  return formatDuration(durations);
};

export const normalizeAgo = (date: Date) => {
  return formatDistanceStrict(new Date(date), new Date(), { addSuffix: true });
};

export const setTimeDuration = (milliseconds: number) => {
  return format(new Date(milliseconds), 'mm:ss');
};
