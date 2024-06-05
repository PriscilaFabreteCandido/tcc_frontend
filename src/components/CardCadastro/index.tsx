import React from 'react';
import { Card, Space } from 'antd';
import { ReactNode } from 'react';
import { CardProps } from 'antd/lib/card';
import './styles.css';

interface CardCadastroProps extends CardProps {
  titulo: string;
  icone?: ReactNode;
  width?: string | '100%';
}

export function CardCadastro({ titulo, icone, children, width, ...rest }: CardCadastroProps) {
  const headerStyle = {
    background: '#141F66',
    color: 'white',
    padding: '0.5rem 0.5rem',
    fontWeight: 500,
    minHeight: 0,
  };

  const iconStyle = {
    fontSize: '14px',
  };

  return (
    <Card
      style={{ marginBottom: '1rem', width: '100%' }}
      title={<Space>{React.cloneElement(icone as React.ReactElement, { style: iconStyle })} {titulo}</Space>}
      headStyle={headerStyle}
      {...rest}
    >
      {children}
    </Card>
  );
}
