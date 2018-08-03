import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Icon } from 'semantic-ui-react'
import jsyaml from 'js-yaml'
import axios from 'axios'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

export default class TableView extends Component {
  static propTypes = {
    top_column_list: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string,
    source: PropTypes.string
  }

  static defaultProps = {
    top_column_list: ["company"],
    language: "en",
    source: "work_exp.yml"
  }

  state = {
    column: null,
    data: [],
    strings: {},
    direction: null,
    expandedRow: null,
    fileContents: {}
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

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

  handleExpand = clickedRow => () => {
    if (this.state.expandedRow === clickedRow.h[this.props.top_column_list[0]])
    {
      this.setState({
        expandedRow: null
      });
    }
    else
    {
      this.setState({
        expandedRow: clickedRow.h[this.props.top_column_list[0]]
      }); 
    }
  }

  getDisplayInfo = (h) => {
    if (h[this.props.top_column_list[0]] == this.state.expandedRow)
    {
      return {
        display: 'table-row',
        icon: 'chevron down',
        bg: '#f8f8f8'
      };
    }
    return {
      display: 'none',
      icon: 'chevron right',
      bg: '#fdfdfd'
    };
  }

  formatCellOutput = (data) => {
    if (data.toString().indexOf("http") === 0)
    {
      return (<a href={data} target='_blank'>{data}</a>);
    }
    return data;
  }

  async requestFileContents(filename) {
    var response = await axios.get('data/'+this.props.language+"/"+filename);
    var fc = this.state.fileContents;
    fc[filename] = response.data;
    this.setState({
      fileContents: fc
    });
  }

  formatDescriptionOutput(h) {
    var outputs = []
    var list_outputs = []
    for (var key in h)
    {
      if (this.props.top_column_list.indexOf(key) == -1)
      {
        if (h[key] instanceof Array && h[key].length != 0)
        {
          list_outputs.push(<h3 key={key}>{this.state.strings[key]}</h3>)

          list_outputs.push(<ul key={key+"ul"}>
            {
              h[key].map((x)=>{
                return (<li key={x}>{x}</li>);
              })
            }
          </ul>)
        }
        else if(h[key] instanceof Object)
        {
          list_outputs.push(<h3 key={key}>{this.state.strings[key]}</h3>);

          for(var inner_key in h[key])
          {
            if (inner_key === ":file")
            {
              var input = this.state.fileContents[ h[key][inner_key] ];
              if (input)
              {
                var toks = input.split('---', 2);
                list_outputs.push(<blockquote key={inner_key}>
                    <ReactMarkdown source={toks[1]} />
                  </blockquote>);
              }
              else
              {
                this.requestFileContents(h[key][inner_key]); 
              }
            }
          }
        }
        else
        {
          outputs.push(<div key={key}><span style={{
            fontWeight: 'bold'
          }}>{this.state.strings[key]}:</span> {h[key]}</div>) 
        }
      }
    }
    return outputs.concat(list_outputs);
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
    var work_exp_data = await this.load_yml_into_array(path+'/'+this.props.source);
    var string_data = await this.load_yml_into_object(path+'/strings.yml')

    this.setState({
      strings: string_data,
      data: work_exp_data
    })

  }

  componentDidMount() {
    this.load_data('data/'+this.props.language);
  }

  render() {
    const { column, data, direction } = this.state

    return (
      <Table sortable celled>
        <Table.Header>
          <Table.Row>
            {
              _.map(this.props.top_column_list, (x)=>(
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
            _.map(this.state.data, (h) => [
              (
                <
                  Table.Row key={h[this.props.top_column_list[0]]}
                  style={{
                    background: this.getDisplayInfo(h).bg
                  }}
                >

                  { _.map(this.props.top_column_list, (itm)=>(

                    <Table.Cell 
                      key={h[itm]}
                      style={{
                        cursor: (itm == this.props.top_column_list[0] ? 'pointer' : 'auto')
                      }}
                      onClick={itm == this.props.top_column_list[0] ? this.handleExpand({h}) : ()=>{}}
                    >
                      {
                         (itm == this.props.top_column_list[0]) ? (
                          <Icon name={this.getDisplayInfo(h).icon} />
                         ) : ""
                      }
                      { this.formatCellOutput(h[itm]) }
                    </Table.Cell>)) 
                  }

                </Table.Row>
                )
                ,
                (
                <Table.Row 
                  key={h[this.props.top_column_list[0]]+"description"}
                  style={{ 
                    display: this.getDisplayInfo(h).display
                  }}
                >

                  <Table.Cell
                    colSpan={this.props.top_column_list.length}
                    style={{
                      borderTop: '1px solid rgba(34, 36, 38, 0.1)',
                      borderBottom: '1px solid rgba(18, 18, 18, 0.1)'
                    }}
                  >
                    { this.formatDescriptionOutput(h) }
                  </Table.Cell>


                </Table.Row>
              )
            ])
          }
        </Table.Body>
      </Table>
    )
  }
}
