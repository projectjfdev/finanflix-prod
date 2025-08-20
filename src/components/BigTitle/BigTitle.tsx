import React from "react";

type Props = {
  title?: string;
  className?: string;
};

const BigTitle = ({ title, className }: Props) => {
  return <h1 className={`font-grotesktwentyfive ${className}`}>{title}</h1>;
};

export default BigTitle;
