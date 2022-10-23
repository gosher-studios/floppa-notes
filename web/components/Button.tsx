import React from "react";
import { Icon } from "react-feather";

const Button = ({
  onClick,
  Icon,
  children,
  className,
}: {
  onClick: () => void;
  Icon: Icon;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={
        "px-2 py-1 transition-colors border-2 hover:border-purple hover:bg-grey rounded-md font-bold flex items-center  select-none" +
        className
      }
      onClick={onClick}
    >
      <Icon className="mr-1" />
      {children}
    </button>
  );
};

export default Button;
