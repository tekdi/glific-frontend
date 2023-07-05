import { CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import productTips from './productTips';
import styles from './Loading.module.css';
import { useState } from 'react';

export interface LoadingProps {
  message?: string;
  showTip?: boolean;
}

export const Loading = ({ message, showTip = false }: LoadingProps) => {
  const { t } = useTranslation();
  const messageToDisplay = message || t('Loading...');
  const [selectedTip] = useState(() =>
    productTips ? productTips[Math.floor(Math.random() * productTips.length)] : t('Loading...')
  );

  return (
    <>
      {showTip ? (
        <div className={styles.LoadingWithTip} data-testid="loader">
          <div style={{ padding: '12px 0' }}>
            <CircularProgress />
          </div>
          <div className={styles.tipBackground}>
            <div className={styles.tipHeading}>PRO TIPS</div>
            <Typography className={styles.tipBody}>{selectedTip}</Typography>
          </div>
        </div>
      ) : (
        <div className={styles.CenterItems} data-testid="loader">
          <div className={styles.LoadingPadding}>
            <CircularProgress />
          </div>
          <Typography variant="h5">{messageToDisplay}</Typography>
        </div>
      )}
    </>
  );
};

export default Loading;
