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
      className="px-2 py-1 border-2 transition-colors hover:border-purple rounded-md flex items-center font-bold"
      onClick={onClick}
    >
      <Icon className="mr-1" />
      {children}
    </button>
  );
};

export default Button;
