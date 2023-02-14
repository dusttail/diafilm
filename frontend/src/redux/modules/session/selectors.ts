import { RootState } from '@/redux/store';

export const getSessionAccessToken = (store: RootState) => ({ data: store.session.accessToken });
export const getSessionRefreshToken = (store: RootState) => ({ data: store.session.refreshToken });
