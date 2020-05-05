import React from 'react';
import styled from 'styled-components';

import StashItem from './StashItem';

const StyledStash = styled.div`
  width: ${props => `${props.cols * props.cellSize}px`};
  height: ${props => `${props.rows * props.cellSize}px`};
  position: relative;
  margin: 32px;

  &::before,
  &::after {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
  }

  &::before {
    z-index: -1;
    background-color: #222222;
    background-position: ${props => `${props.cellSize / 2}px ${props.cellSize / 2}px`};
    background-size: ${props => `${props.cellSize}px ${props.cellSize}px`};
    background-image: 
      linear-gradient(0deg, transparent 48%, #333 49%, #333 51%, transparent 52%),
      linear-gradient(90deg, transparent 48%, #333 49%, #333 51%, transparent 52%);
  }

  &::after {
    outline: solid 2px #222222;
  }
`;

class Stash extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState;
  }

  initialState = {
    dragging: false,
    target: null,
    invalid: false
  }

  onStart = (event) => {
    const itemKey = parseInt(event.currentTarget.dataset.key);
    const target = this.props.items.find(item => item.key === itemKey);

    if (target) {
      this.setState({
        dragging: true,
        target
      });
    }
  }

  onDrag = async (event, pos) => {
    const { cellSize } = this.props;
    const { target } = this.state;

    const shadowItem = Object.assign({}, target, {
      pos: {
        x: target.pos.x + (pos.deltaX / cellSize),
        y: target.pos.y + (pos.deltaY / cellSize),
      }
    });

    await this.setState({
      target: shadowItem,
      invalid: !this.validPosition(shadowItem)
    });
  }

  onStop = (event) => {
    const { target } = this.state;
    if (this.validPosition(target)) {
      this.props.onChange({ type: 'moved' }, target);
    }
    this.setState({ ...this.initialState });
  }

  validPosition = target => !this.itemIsOutOfBounds(target) && !this.itemIsColliding(target)

  itemIsOutOfBounds = target => {
    const { cols, rows } = this.props;
    console.log(target.pos);
    // TA AL REVES ESTO PIBE
    return (
      target.pos.x < 0 || target.pos.y < 0 ||
      target.pos.x + target.size[0] + 1 >= cols || target.pos.y + target.size[1] + 1 >= rows
    );
  }

  itemIsColliding = target => (
    this.props.items.some(item => {
      if (target.key === item.key) {
        return false;
      }

      const { x: targetX, y: targetY } = target.pos;
      const [targetWidth, targetHeight] = target.size;
      const { x: itemX, y: itemY } = item.pos;
      const [itemWidth, itemHeight] = item.size;

      const collisionX = targetX + targetWidth - 1 >= itemX && targetX <= itemX + itemWidth - 1;
      const collisionY = targetY + targetHeight - 1 >= itemY && targetY <= itemY + itemHeight - 1;

      if (collisionX && collisionY) {
        return true;
      }

      return false;
    })
  )

  render() {
    const { items, cols, rows, cellSize } = this.props;
    const { dragging, target, invalid } = this.state;

    return (
      <StyledStash
        cols={cols}
        rows={rows}
        cellSize={cellSize}
      >
        {items.map(item => (
          <StashItem
            key={item.key}
            id={item.key}
            data={item}
            onStart={this.onStart}
            onDrag={this.onDrag}
            onStop={this.onStop}
            invalid={invalid}
            target={dragging && item.key === target.key ? target : null}
          />
        ))}
      </StyledStash>
    );
  }
};

Stash.defaultProps = {
  items: [],
  cols: 5,
  rows: 5,
  cellSize: 64,
  onChange: () => {}
};

export default Stash;