import React from 'react';

type Props = {
  title?: string;
  className?: string;
};

const MediumTitle = ({ title, className }: Props) => {
  return (
    <div>
      <h2 className={`md:text-[26px] font-groteskMedium20   ${className}`}>{title}</h2>
    </div>
  );
};

export default MediumTitle;
