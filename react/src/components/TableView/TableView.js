import _ from 'lodash'
import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import jsyaml from 'js-yaml'
import axios from 'axios'

export default class TableView extends Component {
  state = {
    top_column_list: ["company", "position", "start_date"],
    column: null,
    data: [],
    strings: {},
    direction: null,
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    console.log(clickedColumn)
    if (column !== clickedColumn.x) {
      this.setState({
        column: clickedColumn.x,
        data: _.sortBy(data, [clickedColumn.x]),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  fix_keys(obj) {
    var result = {}

    for (var key in obj)
    {
      result[key.replace(/^\:/, "")] = obj[key]
    }

    return result;
  }

  fix_array_of_keys(arr) {
    var result = []
    for (var idx in arr)
    {
      result.push(this.fix_keys(arr[idx]));
    }
    return result;
  }

  async load_yml_into_array(yml)
  {
    var response = await axios.get(yml);
    return this.fix_array_of_keys( jsyaml.load(response.data) );
  }

  async load_yml_into_object(yml)
  {
    var response = await axios.get(yml);
    return this.fix_keys( jsyaml.load(response.data) );
  }

  async load_data(path) {
    var work_exp_data = await this.load_yml_into_array(path+'/work_exp.yml');
    var string_data = await this.load_yml_into_object(path+'/strings.yml')

    this.setState({
      strings: string_data,
      data: work_exp_data
    })

  }

  componentDidMount() {
    this.load_data('data/en');
  }

  render() {
    const { column, data, direction } = this.state

    return (
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            {
              _.map(this.state.top_column_list, (x)=>(
                <Table.HeaderCell
                  key={x}
                  sorted={column === {x} ? direction : null}
                  onClick={this.handleSort({x})}
                >
                  {this.state.strings[x]}
                </Table.HeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            _.map(this.state.data, (h) => [(
                <Table.Row key={h["company"]}>

                  { _.map(this.state.top_column_list, (itm)=>(<Table.Cell key={h[itm]}>{h[itm]}</Table.Cell>)) }

                </Table.Row>  
            )])
          }
        </Table.Body>
      </Table>
    )
  }
}
