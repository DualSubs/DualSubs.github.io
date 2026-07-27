import { NavIcon } from '@nsnanocat/doc-ui';
import { Layout as RspressLayout } from '@rspress/core/theme-original';
import { useEffect } from 'react';

import { useTopArrived } from './hooks/use-top-arrived';
import styles from './layout.module.scss';
import './layout.css';

export const Layout = () => {
  const { topArrived } = useTopArrived();

  useEffect(() => {
    if (topArrived) {
      document.body.classList.add(styles.topArrived);
    } else {
      document.body.classList.remove(styles.topArrived);
    }
    return () => {
      document.body.classList.remove(styles.topArrived);
    };
  }, [topArrived]);

  return <RspressLayout beforeNavTitle={<NavIcon />} />;
};
