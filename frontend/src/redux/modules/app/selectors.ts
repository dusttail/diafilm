import { RootState } from '@/redux/store';

export const getAppState = (store: RootState) => ({ state: store.app.state });
