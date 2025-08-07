import React from "react";

type Props = {
  title?: string;
};

const SmallTitle = ({ title }: Props) => {
  return (
    <h6 className="font-poppins text-sm text-gray-900 uppercase dark:text-white whitespace-nowrap">
      {title}
    </h6>
  );
};

export default SmallTitle;
