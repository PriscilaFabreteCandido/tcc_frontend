import React from 'react';

interface CardFooterProps {
  children?: React.ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return (
    <>
      <div
        style={{
          marginBottom: '1rem'
        }}
      >
        {children}
      </div>
    </>
  );
}
