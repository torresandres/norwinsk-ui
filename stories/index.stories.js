import React from 'react';
import { storiesOf } from '@storybook/react';

import { emptyStash, smallStash } from '../data/stash';

import Stash from '../src/Stash';

storiesOf('Stash', module)
  .add('Single stash', () => (
    <Stash size={[3, 3]} initialItems={smallStash} />
  ));
