import React from 'react';
import { Wrapper, Item } from './styled';

export default function Sidebar({ items }) {
  return (
    <Wrapper>
      {items.map((item, index) => (
        <Item key={index} to={item.path}>
          {item.icon}
        </Item>
      ))}
    </Wrapper>
  );
}
