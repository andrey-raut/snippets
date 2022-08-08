import stylesheetCreator from '../stylesheetCreator';

type ParamsType = {
  isError: boolean;
};
export default stylesheetCreator(({ theme }, params: ParamsType) => ({
  root: {
    color: params.isError ? theme.colors.error : theme.colors.mainText,
  },
}));
