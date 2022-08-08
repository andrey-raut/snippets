import React from 'react';

import { Text } from 'react-native';

import useStyles from './ComponentWithoutParams.styles';

const ComponentWithoutParams: React.FC = () => {
  const styles = useStyles();

  return (
    <Text style={styles.root}>
      Some test text
    </Text>
  );
};

export default ComponentWithoutParams;
