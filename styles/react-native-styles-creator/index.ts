import React from 'react';
import { StyleSheet } from 'react-native';
import _isEqual from 'lodash/isEqual';

/**
 * @param useTheme - Your hook that will return the theme object and will trigger rerender on required state changes.
 * @param staticContext - Your object with static variables/methods/etc that you will need in your app's stypes.
 */
const getStylesheetCreator = <T extends object, C extends object = Record<string, never>>(useTheme: () => T, staticContext: C = {} as C) => {
  /**
   * @param generateStyles - Callback that will return object for the StyleSheet.create.
   */
  const stylesheetCreator = <S, P = undefined>(generateStyles: (data: { theme: T, ctx: C }, params: P,) => StyleSheet.NamedStyles<S> | S) => {
    /**
     * Hook that will receive defined parameters
     * (or no arguments if you won't define the params object),
     * and return result of the StyleSheet.create call
     */
    const useStyles = ((params: P) => {
      const theme = useTheme();

      const prevParamsRef = React.useRef(params);
      const memoizedParams = React.useMemo<P>(() => {
        const isNotChanged = _isEqual(params, prevParamsRef.current);
        if (isNotChanged) {
          return prevParamsRef.current as P;
        }
        prevParamsRef.current = params;
        return params;
      }, [params]);

      const styles = React.useMemo(() => {
        return StyleSheet.create(generateStyles({ theme, ctx: staticContext }, memoizedParams));
      }, [theme, memoizedParams]);

      return styles;
    }) as P extends undefined ? () => S : (params: P) => S;

    return useStyles;
  };

  return stylesheetCreator;
};

export default getStylesheetCreator;
