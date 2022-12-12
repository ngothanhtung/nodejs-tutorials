import React from 'react';
import styles from './Button.module.css';

type Props = {
  title: string;
};

export default function Button({ title }: Props) {
  return (
    <React.Fragment>
      <button className={styles.button}>{title}</button>
    </React.Fragment>
  );
}
