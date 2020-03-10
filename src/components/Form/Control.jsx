import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  InputAdornment
} from '@material-ui/core';
import { headerShape } from '../../props';

const TYPES_MAPPING = {
  number: 'number'
};

const adormentsMapping = {
  money: <InputAdornment position="start">₽</InputAdornment>
}

export default function Control({
  props: { key, name, type, editable, required, format },
  value,
  onChange,
  enums,
  dictionaries = {},
  classes
}) {
  if (editable === false) {
    return null;
  }
  switch (type) {
    case 'boolean':
      return (
        <FormControlLabel
          control={<Switch checked={value} onChange={onChange} value={key} />}
          label={name}
          margin="normal"
        />
      );
    case 'enum':
      return (
        <FormControl fullWidth>
          <InputLabel id={`${key}-label`}>{name}</InputLabel>
          <Select
            labelId={`${key}-label`}
            id={key}
            value={value}
            onChange={onChange}
            renderValue={value => value.name}
          >
            {enums[key].map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case 'multiRelation':
      return (
        <FormControl fullWidth>
          <InputLabel id={`${key}-label`}>{name}</InputLabel>
          <Select
            multiple
            labelId={`${key}-label`}
            id={key}
            value={value || []}
            onChange={onChange}
            renderValue={selected => (
              <Grid container>
                {selected.map(value => (
                  <Chip
                    key={value.id}
                    label={value.name}
                    className={classes.chip}
                  />
                ))}
              </Grid>
            )}
          >
            {(dictionaries[key] || []).map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case 'singleRelation':
      return (
        <FormControl fullWidth>
          <InputLabel id={`${key}-label`}>{name}</InputLabel>
          <Select
            labelId={`${key}-label`}
            id={key}
            value={value}
            onChange={onChange}
          >
            {(dictionaries[key] || []).map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    default:
      return (
        <TextField
          fullWidth
          id={key}
          label={name}
          type={TYPES_MAPPING[type] || 'text'}
          multiline={type === 'text'}
          required={required}
          onChange={onChange}
          value={value}
          margin="normal"
          startAdornment={adormentsMapping[format]}
        />
      );
  }
}

Control.propTypes = {
  props: headerShape.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  enums: PropTypes.array.isRequired,
  dictionaries: PropTypes.object,
  classes: PropTypes.object.isRequired
};
