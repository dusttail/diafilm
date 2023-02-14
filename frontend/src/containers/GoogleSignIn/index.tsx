import { loginViaGoogleIntoTheServer } from '@/redux/modules/session/reducers';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';

type Props = typeof mapDispatchToProps;

export function GoogleSignIn(props: Props) {
  useEffect(() => {
    const loadingScript = document.createElement('script');
    loadingScript.src = 'https://accounts.google.com/gsi/client';
    loadingScript.async = true;
    loadingScript.defer = true;

    const googleAuthFunc = document.createElement('script');
    googleAuthFunc.innerText =
      "function googleAuth(data) {sessionStorage.setItem('google_auth', data.credential)}";

    document.body.appendChild(loadingScript);
    document.body.appendChild(googleAuthFunc);

    return () => {
      document.body.removeChild(loadingScript);
      document.body.removeChild(googleAuthFunc);
    };
  }, []);

  const [credentials, setCredentials] = useState<string>();

  const interval = setInterval(() => {
    const token = sessionStorage.getItem('google_auth');
    if (token) {
      console.log('INTERVAL');
      setCredentials(token);
      clearInterval(interval);
      console.log('CLEARED INTERVAL');
    }
  }, 500);

  useEffect(() => {
    if (credentials) {
      console.log('useEffect ', credentials);
      //  loginViaGoogleIntoTheServer(credentials);
    }
  }, [credentials]);

  return (
    <div className={styles.wrapper}>
      <div
        id='g_id_onload'
        data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        data-context='use'
        data-ux_mode='popup'
        data-callback='googleAuth'
        data-itp_support='true'
      ></div>
      <div
        className='g_id_signin'
        data-type='standard'
        data-shape='rectangular'
        data-theme='outline'
        data-text='signin_with'
        data-size='large'
        data-logo_alignment='left'
      ></div>
    </div>
  );
}

const mapDispatchToProps = {
  loginViaGoogleIntoTheServer,
};

export default connect(null, mapDispatchToProps)(GoogleSignIn);
