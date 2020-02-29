import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Grid, Button } from '@material-ui/core';
import Control from './Control';
import { headerShape, queriesShape } from 'props';
import { getValue, getDefaultValue, mapFields } from './helpers';

const Container = styled.form`
  max-width: 90vw;
  width: 600px;
`;

const useStyles = makeStyles(() => ({
  actions: {
    marginTop: '20px'
  },
  chip: {
    margin: '2px'
  }
}));

function Form({ queries, data, headers, onReady, enums }) {
  const classes = useStyles();
  const [formData, setFormData] = useState(
    data ||
      _.fromPairs(
        _.reject(headers, ['editable', false]).map(item => [
          item.key,
          item.default || getDefaultValue(item.type)
        ])
      )
  );

  const { enqueueSnackbar } = useSnackbar();

  const dictionaries = useQuery(queries.GET_DICTIONARIES_QUERY);

  const dictionariesMap = useMemo(
    () =>
      dictionaries.data
        ? _.mapValues(dictionaries.data, value => _.keyBy(value, 'id'))
        : {},
    [dictionaries.data]
  );

  const [addItem] = useMutation(queries.ADD_MUTATION);

  const [updateItem] = useMutation(queries.UPDATE_MUTATION);

  const handleSubmit = useCallback(() => {
    let promise;
    const input = _.omit(formData, ['__typename', 'id']);
    if (formData.id) {
      promise = updateItem({
        variables: {
          id: formData.id,
          input: mapFields(input, headers)
        }
      });
    } else {
      promise = addItem({
        variables: {
          input: mapFields(input, headers)
        }
      });
    }
    promise
      .then(data => {
        if (_.first(_.values(data)) === 1) {
          enqueueSnackbar('Готово!', {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'right' }
          });
          onReady();
        } else {
          enqueueSnackbar(
            'Что-то пошло не так',
            {
              variant: 'error',
              anchorOrigin: { vertical: 'top', horizontal: 'right' }
            }
          );
        }
      })
      .catch(() => {
        enqueueSnackbar('Что-то пошло не так', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      });
  }, [formData]);

  const handleChange = useCallback(
    ({ key, type }) => e => {
      setFormData({
        ...formData,
        [key]: (getValue[type] || getValue.default)(e, key, dictionariesMap)
      });
    },
    [formData, dictionariesMap]
  );

  return (
    <Container>
      {headers.map(header => (
        <Control
          key={header.key}
          props={header}
          value={formData[header.key]}
          onChange={handleChange(header)}
          enums={enums}
          dictionaries={dictionaries.data}
          classes={classes}
        />
      ))}
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.actions}
      >
        <Button variant="contained" onClick={onReady}>
          Отмена
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Grid>
    </Container>
  );
}

Form.propTypes = {
  queries: queriesShape,
  data: PropTypes.object,
  headers: PropTypes.arrayOf(headerShape).isRequired,
  onReady: PropTypes.func,
  enums: PropTypes.object
};

Form.defaultProps = {
  onReady: _.noop,
  enums: {}
};

export default Form;
