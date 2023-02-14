export type ActionReducer = {
  type: string,
  loading?: boolean,
  payload: { [x: string]: any; };
};
