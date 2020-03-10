import React from 'react';
import { Tooltip } from '@material-ui/core';
import { Wrapper, Item } from './styled';

export default function Sidebar({ items }) {
  return (
    <Wrapper>
      {items.map((item, index) => (
        <Tooltip title={item.title} placement="right">
          <Item key={index} onClick={item.action}>
            {item.icon}
          </Item>
        </Tooltip>
      ))}
    </Wrapper>
  );
}
