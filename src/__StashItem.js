import React from 'react';
import { DraggableCore } from 'react-draggable';
import styled from 'styled-components';

const StyledStashItem = styled.div.attrs(props => ({
  x: (props.target ? props.target.pos.x : props.data.pos.x) * 64,
  y: (props.target ? props.target.pos.y : props.data.pos.y) * 64,
  width: props.data.size[0] * 64,
  height: props.data.size[1] * 64,
  image: `/images/${props.data.icon}.svg`
}))`
  position: absolute;
  border: solid 1px rgba(255, 255, 255, .25);
  user-select: none;
  box-sizing: border-box;
  will-change: transform;
  transform: ${props => `translate(${props.x}px, ${props.y}px)`};
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

const StashItem = ({
  data,
  id,
  target,
  invalid,
  onStart,
  onDrag,
  onStop
}) => (
  <DraggableCore
    bounds="parent"
    onStart={onStart}
    onDrag={onDrag}
    onStop={onStop}
    grid={(target && target.key === data.key) ? [64, 64]: null}
  >
    <StyledStashItem
      target={target}
      data={data}
      invalid={invalid}
      data-key={id}
    >
      <label className="name">{data.name}</label>
    </StyledStashItem>
  </DraggableCore>
);

export default StashItem;