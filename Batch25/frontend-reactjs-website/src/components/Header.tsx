import React from 'react';

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return <div>{title}</div>;
}
