import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { emptyStash, smallStash } from '../data/stash';

import Stash from '../src/Stash';

class EmptyStash extends React.Component {
  state = {
    stash: emptyStash
  }

  onChange = (event, target) => {
    if (event.type === 'moved') {
      this.setState(state => ({
        stash: state.stash.map(item => item.key === target.key ? target : item)
      }));
    }
  }

  render() {
    return (
      <Stash
        items={this.state.stash}
        onChange={this.onChange}
      />
    );
  }
}

class SmallStash extends React.Component {
  state = {
    stash: smallStash
  }

  onChange = (event, target) => {
    if (event.type === 'moved') {
      this.setState(state => ({
        stash: state.stash.map(item => item.key === target.key ? target : item)
      }));
    }
  }

  render() {
    return (
      <Stash
        items={this.state.stash}
        onChange={this.onChange}
      />
    );
  }
}

storiesOf('Stash', module)
  .add('Single stash', () => (
    <SmallStash />
  ))
  .add('Double stash', () => (
    <div style={{ display: 'flex' }}>
      <SmallStash />
      <EmptyStash />
    </div>
  ));
