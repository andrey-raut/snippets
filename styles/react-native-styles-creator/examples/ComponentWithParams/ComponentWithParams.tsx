import React from 'react';

import { Text } from 'react-native';

import useStyles from './ComponentWithParams.styles';

const ComponentWithParams: React.FC<{
  isError: boolean;
}> = (props) => {
  const styles = useStyles({
    isError: props.isError,
  });

  return (
    <Text style={styles.root}>
      Some test text
    </Text>
  );
};

export default ComponentWithParams;
