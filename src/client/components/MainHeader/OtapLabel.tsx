import classnames from 'classnames';
import { OTAP_ENV } from '../../../universal/config/env';
import styles from './OtapLabel.module.scss';

export function OtapLabel() {
  return ['test', 'development', 'acceptance'].includes(OTAP_ENV) ? (
    <small
      className={classnames(
        styles['otap-env'],
        styles[`otap-env--${OTAP_ENV}`]
      )}
    >
      {OTAP_ENV}
    </small>
  ) : null;
}
