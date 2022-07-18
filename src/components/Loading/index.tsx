import React from 'react';
import {
  Center,
  Spinner,
} from 'native-base';

export default function Loading(){
  return (
    <Center>
      <Spinner color="secondary.700" />
    </Center>
  );
}