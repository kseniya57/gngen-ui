import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Grid, Chip } from '@material-ui/core';
import truncate from 'truncate-html';
import moment from 'moment';
import { headerShape } from '../../props';

export default function Cell({ item, props, onChange, classes }) {
  const { key } = props;
  switch (props.type) {
    case 'boolean':
      return (
        <Checkbox
          checked={item[key]}
          onChange={onChange}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      );
    case 'multiRelation':
      return (
        <Grid container spacing={2}>
          {(item[key] || []).slice(0, 2).map(relatedEntity => (
            <Chip
              key={relatedEntity.id}
              variant="outlined"
              size="small"
              label={relatedEntity.name}
              className={classes.chip}
            />
          ))}
          {(item[key] || []).length > 2 && '...'}
        </Grid>
      );
    case 'singleRelation':
      return item[key].name;
    case 'date':
      return moment(item[key]).format('DD.MM.YYYY');
    case 'text':
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: truncate(props.render ? props.render(item) : item[key], 15)
          }}
        />
      );
    default:
      switch (props.format) {
        case 'image':
          return <img src={item[key]} alt={key} />;
        case 'money':
          return item[key].toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
        default:
          return props.render ? props.render(item) : (item[key] || null);
      }
  }
}

Cell.propTypes = {
  item: PropTypes.object.isRequired,
  props: headerShape.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};
