import _ from 'lodash';
import pluralize from 'pluralize';

export const getValue = {
  number: e => parseFloat(e.target.value),
  boolean: e => e.target.checked,
  multiRelation: (e, key, dictionariesMap) =>
    e.target.value.map(id => dictionariesMap[key][id] || id),
  singeRelation: ({ target: { value } }, key, dictionariesMap) =>
    dictionariesMap[key][value] || value,
  default: e => e.target.value
};

export const mapFields = (fields, props) => {
  const propsByKey = _.keyBy(props, 'key');
  return _.entries(fields).reduce((result, [key, value]) => {
    if (_.has(propsByKey, key)) {
      switch (propsByKey[key].type) {
        case 'multiRelation':
          result[`${pluralize(key, 1)}Ids`] = _.map(value, 'id');
          break;
        case 'singleRelation':
          if (value) {
            result[`${pluralize(key, 1)}Id`] = value.id;
          }
          break;
        case 'number':
          result[key] = parseFloat(value) || 0;
          break;
        default:
          result[key] = value;
      }
    }
    return result;
  }, {});
};

export const getDefaultValue = type => {
  switch (type) {
    case 'multiRelation':
      return [];
    case 'singleRelation':
      return null;
    case 'boolean':
      return false;
    default:
      return '';
  }
};
