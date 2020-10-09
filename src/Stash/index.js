import React from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const Container = styled(motion.div).attrs({
  cellSize: 64
})`
  width: ${props => `${props.cols * props.cellSize}px`};
  height: ${props => `${props.rows * props.cellSize}px`};
  position: relative;

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

const Item = styled(motion.div).attrs(props => ({
  width: props.data.size[0] * 64,
  height: props.data.size[1] * 64,
  image: `/images/${props.data.icon}.svg`
}))`
  position: absolute;
  z-index: 1;
  margin: 0;
  border: solid 1px rgba(255, 255, 255, .25);
  user-select: none;
  box-sizing: border-box;
  width: ${props => `${props.width}px;`};
  height: ${props => `${props.height}px;`};
  background-position: center;
  background-repeat: no-repeat, repeat;
  background-size: 90%, 11.31px 11.31px;
  background-image:
    ${props => `url("${props.image}")`},
    linear-gradient(135deg, #222 25%, #242424 25%, #242424 50%, #222 50%, #222 75%, #242424 75%, #242424 100%);

  &:hover {
    background-color: rgba(255, 255, 255, .1);
  }

  &:active {
    z-index: 1;
    cursor: grab;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: "";
      background-color: ${props => props.invalid && 'rgba(255, 0, 0, .25)'};
    }
  }

  .name {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    padding: 3px;
    color: rgba(255, 255, 255, .7);
    font-family: "Titillium Web", Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 1px;
    line-height: 12px;
    text-align: right;
    text-shadow: 0 1px 1px rgba(0, 0, 0, .5);
    text-overflow: ellipsis;
    white-space: pre;
    overflow: hidden;
  }
`;

export default ({ rows = 3, cols = 3, cellSize = 64, initialItems = [] }) => {
  const constraintsRef = React.useRef(null);
  const [items, setItems] = React.useState(initialItems);
  const [dragging, setDragging] = React.useState(false);

/*   React.useEffect(() => {
    console.log(items);
  }, [items]); */

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const onDragStart = (event, info, item) => {
    console.log('START', { x: event.layerX, y: event.layerY });
    setDragging(item);
  }

  const onDrag = (event, info) => {
    // console.log(info);
  }

  const onDragEnd = (event, info, value) => {
    console.log('END', { x: event.layerX, y: event.layerY });
    const snapped = {
      x: clamp(Math.floor(event.layerX / cellSize), 0, cols),
      y: clamp(Math.floor(event.layerY / cellSize), 0, rows)
    };
    setDragging(null);
    setItems(items.map(item => ({ ...item, pos: snapped })));
    value.x.set(snapped.x * cellSize);
    value.y.set(snapped.y * cellSize);
  }

  return (
      <Container rows={rows} cols={cols} ref={constraintsRef}>
        {items.map(item => {
          const x = useMotionValue(item.pos.x * cellSize);
          const y = useMotionValue(item.pos.y * cellSize);

          return (
            <Item
              drag
              dragConstraints={constraintsRef}
              dragElastic={1}
              dragMomentum={false}
              onDragStart={(event, info) => onDragStart(event, info, item)}
              onDrag={(event, info) => onDrag(event, info, item)}
              onDragEnd={(event, info) => onDragEnd(event, info, { x, y })}
              key={item.key}
              data={item}
              style={{ x, y }}
            >
              <label className="name">{item.name}</label>
            </Item>
          );
        })}
      </Container>
  );
}