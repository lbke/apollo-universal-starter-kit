import React from 'react';
import PropTypes from 'prop-types';
import { pascalize } from 'humps';
import { FormFeedback } from 'reactstrap';
import { FormItem, Select, Spin } from './index';
import schemaQueries from '../../../../generatedContainers';

const LIMIT = 10;

export default class RenderSelectQuery extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
    label: PropTypes.string,
    formItemLayout: PropTypes.object,
    meta: PropTypes.object,
    schema: PropTypes.object,
    style: PropTypes.object,
    formType: PropTypes.string,
    value: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, edges) => {
    const {
      input: { name },
      setFieldValue
    } = this.props;
    setFieldValue(name, edges.find(item => item.id === parseInt(e.target.value)) || '');
  };

  handleBlur = () => {
    const {
      input: { name },
      setFieldTouched
    } = this.props;
    setFieldTouched(name, true);
  };

  render() {
    const {
      value,
      schema,
      style = { width: '100%' },
      meta: { touched, error },
      label
    } = this.props;
    const column = schema.keys().find(key => !!schema.values[key].sortBy) || 'name';
    const toString = schema.__.__toString ? schema.__.__toString : opt => opt[column];
    const orderBy = () => {
      const foundOrderBy = schema.keys().find(key => !!schema.values[key].orderBy);
      return foundOrderBy ? { column: foundOrderBy } : null;
    };
    const formattedValue = value ? value.id : '';
    const Query = schemaQueries[`${pascalize(schema.name)}Query`];

    return (
      <FormItem label={label}>
        <div>
          <Query limit={LIMIT} orderBy={orderBy()}>
            {({ loading, data }) => {
              if (loading || !data) {
                return <Spin size="small" />;
              }
              console.log('orderBy', orderBy);
              const { edges } = data;
              const renderOptions = () => {
                const defaultOption = formattedValue
                  ? []
                  : [
                      <option key="0" value="0">
                        Select {pascalize(schema.name)}
                      </option>
                    ];
                return edges
                  ? edges.reduce((acc, opt) => {
                      acc.push(
                        <option key={opt.id} value={`${opt.id}`}>
                          {toString(opt)}
                        </option>
                      );
                      return acc;
                    }, defaultOption)
                  : defaultOption;
              };
              const props = {
                style,
                value: formattedValue,
                onChange: e => this.handleChange(e, edges || null),
                onBlur: this.handleBlur,
                invalid: !!(touched && error)
              };
              return (
                <div>
                  <Select type="select" {...props}>
                    {renderOptions()}
                  </Select>
                  {error && <FormFeedback>{error}</FormFeedback>}
                </div>
              );
            }}
          </Query>
        </div>
      </FormItem>
    );
  }
}