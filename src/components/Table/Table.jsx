import React, {Fragment, useCallback, useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { DeleteRounded, EditRounded, AddRounded, SortRounded } from '@material-ui/icons';
import { Modal, Form } from '../../';
import { headerShape, queriesShape } from '../../props';
import { StyledTable, PaginationWrapper } from './styled';
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

const PAGE_SIZE = 10;

const buildPagination = (page, order) => ({
  skip: PAGE_SIZE * (page - 1),
  take: PAGE_SIZE,
  order: {
    [order.column]: order.type
  }
});

function Table({ headers, entityName, queries, enums }) {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({
    type: 'ASC',
    column: 'id'
  });

  const query = useQuery(queries.GET_ALL_QUERY, {
    variables: {
      pagination: buildPagination(page, order)
    }
  });

  const countQuery = useQuery(queries.GET_COUNT_QUERY);
  const pagesCount = useMemo(() => countQuery.loading ? 1 : Math.ceil(countQuery.data[`${entityName}Count`] / PAGE_SIZE), [countQuery.data])


  const [deleteItem] = useMutation(queries.DELETE_MUTATION);

  useSubscriptions({
    queries,
    query,
    entityName
  });

  const handleChangePage = useCallback((e, newPage) => {
    setPage(newPage);
    query.refetch(buildPagination(newPage, order))
  }, [query.refetch, order]);

  const handleChangeOrder = useCallback((column) => () => {
    const newOrder = {
      type: column === order.column ? (order.type === 'ASC' ? 'DESC' : 'ASC') : 'ASC',
      column,
    }
    setOrder(newOrder);
    query.refetch(buildPagination(page, newOrder))
  }, [query.refetch, page, order]);

  const renderAddEditForm = useCallback(
    data => ({ onClose }) => {
      return (
        <Form
          data={data}
          queries={queries}
          config={headers}
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
              <th key={item.name}>
                 <span>
                    {item.name}
                    {item.sortable && <SortRounded  onClick={handleChangeOrder(item.key)}/>}
                  </span>
              </th>
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
      {pagesCount > 1 && <PaginationWrapper>
        <Pagination count={pagesCount} page={page} onChange={handleChangePage} />
      </PaginationWrapper>}
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
