import React from 'react';
import clsx from 'clsx';
import './Button.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'bet-higher' | 'bet-lower';
}

export const Button: React.FC<Props> = ({ variant = 'primary', className, children, ...props }) => {
  return (
    <button className={clsx('game-btn', variant, className)} {...props}>
      <span className="btn-inner">{children}</span>
    </button>
  );
};
