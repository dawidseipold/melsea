// Functions
import { stringifyLength } from '../../../utils';

interface ILength {
  as: keyof JSX.IntrinsicElements;
  milliseconds: number;
  className?: string;
}

const Length = ({ as: Element, milliseconds, className }: ILength) => {
  return (
    <Element className={className}>{stringifyLength({ start: 0, end: milliseconds })}</Element>
  );
};

export default Length;
