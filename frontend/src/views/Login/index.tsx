import { GoogleSignIn } from '../../containers/GoogleSignIn';
import { Title } from '../../components/Title';
import styles from './styles.module.scss';

export function Login() {
  return (
    <>
      <div className={styles.top} />
      <div className={styles.right} />
      <div className={styles.bot} />
      <Title />
      <GoogleSignIn />
    </>
  );
}
