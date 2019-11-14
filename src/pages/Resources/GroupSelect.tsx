import React, { Component } from "react";
import { Select } from "antd";
import { getGroups, group } from './ResGroup'

const { Option } = Select;

interface props {
  className?: string;
  style?: object;
  placeholder?: string;
  hideAll?: boolean;
  change?: Function;
}

interface state {
  groupList: group[]
}

class GroupSelect extends Component<props, state> {

  state: state = {
    groupList: []
  }

  async componentDidMount () {
    const data = await getGroups();
    this.setState({
      groupList: data
    })
  }

  onChange (value: any) {
    if (this.props.change) {
      this.props.change(value)
    }
  }

  render () {
    return (
      <Select
        showSearch
        className={this.props.className}
        style={Object.assign({ width: 150 }, this.props.style)}
        placeholder={this.props.placeholder ? this.props.placeholder : "分组"}
        optionFilterProp="children"
        onChange={value => this.onChange(value)}
        filterOption={(input, option: any) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {!this.props.hideAll ? <Option key='all' value="" title="全部">全部</Option> : ''}
        {this.state.groupList.map(item => (
          <Option key={item._id} value={item._id} title={item.name}>{item.name}</Option>
        ))}
      </Select>
    )
  }
}

export default GroupSelect