import getStylesheetCreator from './getStylesheetCreator';
import useTheme from './useTheme';
import staticStylesContext from './staticStylesContext';

const stylesheetCreator = getStylesheetCreator(useTheme, staticStylesContext);

export default stylesheetCreator;
