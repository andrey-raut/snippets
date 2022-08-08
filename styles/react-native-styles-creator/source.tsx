import React from 'react';
import { StyleSheet, Text } from 'react-native';
import _isEqual from 'lodash/isEqual';

// Gist START
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
// Gist END

// -- Usage example --

// useTheme.ts - Your hook to get the theme object
const useTheme = () => ({ textColor: 'black' });

// ------------------

// stylesheetCreator.ts - Instance of the getStylesheetCreator function's result.
const stylesStaticContext = { getScreenWidth: () => 340 }; // Object with all required static data or methods

const stylesheetCreator = getStylesheetCreator(useTheme, stylesStaticContext); // You can ignore stylesStaticContext if you don't need it

// ------------------

// TestComponent.styles.ts - Styles for our test component
type ParmasType = {
  isOpen: boolean;
};

// If you don't need any parameters - just don't define the second argument
const useStyles = stylesheetCreator(({ theme, ctx }, params: ParmasType) => ({
  root: {
    color: theme.textColor,
    width: ctx.getScreenWidth() - 40,
    height: params.isOpen ? 100 : 0,
  },
}));

// ------------------

// TestComponent.tsx - Our test component
const TestComponent: React.FC<{ isOpen: boolean }> = (props) => {
  const styles = useStyles({ isOpen: props.isOpen });

  return (
    <Text style={styles.root}>
      Some text
    </Text>
  );
};
