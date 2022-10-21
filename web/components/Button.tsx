import React from "react";
import { Icon } from "react-feather";

const Button = ({
  onClick,
  Icon,
  children,
}: {
  onClick: () => void;
  Icon: Icon;
  children: React.ReactNode;
}) => {
  return (
    <button
      className="px-2 py-1 transition-colors border-2 hover:border-purple rounded-md font-bold flex items-center"
      onClick={onClick}
    >
      <Icon className="mr-1" />
      {children}
    </button>
  );
};

export default Button;
