import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import { DeleteRounded, EditRounded, AddRounded } from '@material-ui/icons';
import { Modal, Form } from 'components';
import { headerShape, queriesShape } from 'props';
import { StyledTable } from './styled';
import Cell from './Cell';
import useSubscriptions from './useSubscriptions';

const useStyles = makeStyles(() => ({
  fab: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem'
  },
  chip: {
    margin: '2px'
  }
}));

function Table({ headers, entityName, queries, enums }) {
  const classes = useStyles();
  const query = useQuery(queries.GET_ALL_QUERY);

  const [deleteItem] = useMutation(queries.DELETE_MUTATION);

  useSubscriptions({
    queries,
    query,
    entityName
  });

  const renderAddEditForm = useCallback(
    data => ({ onClose }) => {
      return (
        <Form
          data={data}
          queries={queries}
          headers={headers}
          onReady={onClose}
          enums={enums}
        />
      );
    },
    [entityName, headers, queries]
  );

  const [updateItem] = useMutation(queries.UPDATE_MUTATION);

  const handleCellChange = useCallback(
    ({ key, type }, item) => e => {
      updateItem({
        variables: {
          id: item.id,
          input: {
            [key]: type === 'boolean' ? e.target.checked : e.target.value
          }
        }
      });
    },
    [updateItem]
  );

  if (query.loading) {
    return null;
  }

  if (query.error) {
    return (
      <pre>
        Bad:{' '}
        {query.error.graphQLErrors.map(({ message }, i) => (
          <span key={i}>{message}</span>
        ))}
      </pre>
    );
  }

  return (
    <Fragment>
      <StyledTable>
        <thead>
          <tr>
            {headers.map(item => (
              <th key={item.name}>{item.name}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {query.data[entityName].map((item, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={`${header.name}-${item.id}`}>
                  <Cell
                    item={item}
                    props={header}
                    onChange={handleCellChange(header, item)}
                    classes={classes}
                  />
                </td>
              ))}
              <td>
                <Modal
                  renderContent={renderAddEditForm(item)}
                  title="Редактирование"
                >
                  {({ handleOpen }) => <EditRounded onClick={handleOpen} />}
                </Modal>
                <DeleteRounded
                  onClick={() => deleteItem({ variables: { id: item.id } })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <Modal renderContent={renderAddEditForm()} title="Создание">
        {({ handleOpen }) => (
          <Fab
            aria-label="Добавить новый"
            color="primary"
            className={classes.fab}
            onClick={handleOpen}
          >
            <AddRounded />
          </Fab>
        )}
      </Modal>
    </Fragment>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(headerShape).isRequired,
  entityName: PropTypes.string,
  queries: queriesShape.isRequired,
  enums: PropTypes.object
};

Table.defaultProps = {};

export default Table;
