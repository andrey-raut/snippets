import stylesheetCreator from '../stylesheetCreator';

export default stylesheetCreator(({ theme }) => ({
  root: {
    color: theme.colors.mainText,
  },
}));
