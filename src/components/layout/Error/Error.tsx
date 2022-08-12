import Link from 'next/link';
import { WarningCircle } from 'phosphor-react';
import { ErrorResponse } from '../../../../types/utils';

interface IError extends ErrorResponse {}

const Error = ({ code, message }: IError) => {
  return (
    <div className="flex flex-col gap-y-4 justify-center items-center h-[calc(100%-144px)]">
      <h1 className="text-8xl font-bold">{code}</h1>
      <h2 className="text-3xl font-semibold">{code === 404 ? `Page ${message}` : message}</h2>
      <span className="text-white/60 text-sm">It looks like there was an error!</span>

      <div className="flex items-center">
        <Link href="/">
          <a className="px-4 py-2 bg-blue-500 rounded-lg">Go back home</a>
        </Link>
      </div>
    </div>
  );
};

export default Error;
