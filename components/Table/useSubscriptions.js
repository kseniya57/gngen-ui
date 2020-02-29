import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import pluralize from 'pluralize';

export default ({
  queries,
  query: { loading, error, subscribeToMore },
  entityName
}) => {
  const singularName = useMemo(() => pluralize(entityName, 1), [entityName]);

  useEffect(() => {
    if (!loading && !error && subscribeToMore) {
      subscribeToMore({
        document: queries.ADDED_EVENT,
        updateQuery: (
          previousResult,
          {
            subscriptionData: {
              data: { [`${singularName}Added`]: added }
            }
          }
        ) => {
          if (_.find(previousResult[entityName], ['id', added.id])) {
            return previousResult;
          }
          return {
            [entityName]: [...previousResult[entityName], added]
          };
        }
      });

      subscribeToMore({
        document: queries.UPDATED_EVENT,
        updateQuery: (
          previousResult,
          {
            subscriptionData: {
              data: { [`${singularName}Updated`]: updated }
            }
          }
        ) => {
          const old = _.find(previousResult[entityName], ['id', updated.id]);
          if (old) {
            _.assign(old, updated);
          }
          return {
            [entityName]: previousResult[entityName]
          };
        }
      });

      subscribeToMore({
        document: queries.DELETED_EVENT,
        updateQuery: (
          previousResult,
          {
            subscriptionData: {
              data: { [`${singularName}Deleted`]: deletedId }
            }
          }
        ) => {
          return {
            [entityName]: _.reject(previousResult[entityName], [
              'id',
              deletedId
            ])
          };
        }
      });
    }
  }, [
    loading,
    error,
    subscribeToMore,
    queries.ADDED_EVENT,
    queries.UPDATED_EVENT,
    queries.DELETED_EVENT,
    singularName,
    entityName
  ]);
};
