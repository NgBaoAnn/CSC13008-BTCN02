import React from 'react';
import BackButton from '@/components/common/BackButton';

const NotFound = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 w-full">
      <div className="w-full max-w-[1200px] mx-auto">
        <BackButton />
      </div>
      <h1 className="text-2xl font-semibold">404 • Page Not Found</h1>
    </div>
  );
};

export default NotFound;
