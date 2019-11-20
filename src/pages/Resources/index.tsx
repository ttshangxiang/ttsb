import React, { Component, Fragment } from 'react';
import { Table, Divider, Tag, Button, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import GroupSelect from './GroupSelect';
import axios from 'axios';
import { getGroups, group } from './ResGroup';
import EditResModal from './EditResModal';

const { Search } = Input;

export interface res {
  _id: string;
  utime: string;
  ctime: string;
  filename: string;
  path: string;
  type: string;
  size: string;
  groups: string[];
  status: 0;

  description: string;
  width?: number;
  height?: number;
  normal?: string;
  thumb?: string;
}

interface props {

}

interface state {
  inChangeGroup: boolean;
  resList: res[];
  selectedRowKeys: string[];
  loading: boolean;
  groupMap: {[index: string]: group};
  page: number;
}

class Resources extends Component<props, state> {

  pageSize: number = 10;
  total: number = 0;
  filterGroup: string = '';
  newGroup: string = '';
  keyWords: string = '';
  inChangeGroupId: string = '';
  editResModal: (EditResModal|null) = null;

  columns = [
    {
      title: 'Thumb',
      dataIndex: 'thumb',
      key: 'thumb',
      render: (src: string, record: res, index: number) => {
        if (src) {
          return <img src={src} width={120} style={{cursor: 'pointer'}} onClick={() => this.openEdit(record, index)}/>
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
      render: (text: string, record: res, index: number) => <a onClick={() => this.openEdit(record, index)}>{text}</a>,
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (text: string) => (
        <span style={{display: 'inline-block', width: 160}}>{text}</span>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: 'Ctime',
      dataIndex: 'ctime',
      key: 'ctime'
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
      key: 'groups',
      render: (tags: string[]) => {
        return (
          <span>
            {(tags || []).map(tag => {
              return (
                <Tag key={tag}>
                  {this.state.groupMap[tag] && this.state.groupMap[tag].name}
                </Tag>
              );
            })}
          </span>
        ) 
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <span style={{display: 'inline-block', width: 160}}>{text}</span>
      )
    }
  ];

  state: state = {
    inChangeGroup: false,
    resList: [],
    selectedRowKeys: [],
    loading: false,
    groupMap: {},
    page: 1
  };

  async loadRes (page = 1) {
    this.setState({page});
    this.setState({loading: true});
    const params: any = {
      offset: (page - 1) * this.pageSize,
      count: this.pageSize
    };
    if (this.keyWords !== '') {
      params.type = 'like.' + this.keyWords;
      params.filename = 'like.' + this.keyWords;
      params.description = 'like.' + this.keyWords;
    }
    if (this.filterGroup !== '') {
      params.groups = 'includes.' + this.filterGroup;
    }
    return axios({
      url: '/res',
      params: params
    }).then(res => {
      this.setState({loading: false});
      const { data = {} } = res;
      if (data.code === 0) {
        return data.data;
      } else {
        message.error(data.msg);
      }
    }).catch(err => {
      this.setState({loading: false});
      message.error(err.message)
    })
  }

  async reloadRes (page = 1) {
    const data = await this.loadRes(page);
    const list = data.data;
    this.total = data.total;
    this.setState({
      resList: list
    });
    
    // 分组时，设置选中状态
    this.state.inChangeGroup && this.resetSelectd(list);
  }

  onFilterSelectChange (value: string) {
    this.filterGroup = value;
    this.setState({selectedRowKeys: []});
    this.reloadRes();
  }

  startChangeGroup() {
    this.setState({ 
      selectedRowKeys: [],
      inChangeGroup: !this.state.inChangeGroup
     });
  }

  async doChangeGroup() {
    this.setState({ 
      inChangeGroup: false,
      selectedRowKeys: []
    });
    const id = this.inChangeGroupId
    if (!id) {
      message.error('请选分组');
      return;
    }
    // 没在组里面，添加的
    const adds: string[] = [];
    // 在组里面，被取消的
    const subs: string[] = [];

    this.state.resList.forEach(o => {
      const isSelectd = this.state.selectedRowKeys.includes(o._id)

      if (isSelectd && (!o.groups || !o.groups.includes(id))) {
        adds.push(o._id);
      }
      if (!isSelectd && o.groups && o.groups.includes(id)) {
        subs.push(o._id);
      }
    })

    if (adds.length + subs.length == 0) {
      message.info('未作改变')
      return;
    }

    await axios({
      method: 'put',
      url: '/res/group/' + id,
      data: {adds, subs}
    });
    await this.reloadRes(this.state.page);
  }

  onRowSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  }

  resetSelectd(list: res[]) {
    if (this.inChangeGroupId) {
      const keys: string[] = []
      list.forEach((item: any) => {
        item.groups && item.groups.includes(this.inChangeGroupId) && keys.push(item._id);
      })
      this.setState({selectedRowKeys: keys});
    }
  }

  onNewSelectChange (value: string) {
    this.inChangeGroupId = value;
    this.resetSelectd(this.state.resList)
  }

  editIndex: number = 0;
  async changCurrent (num: number) {
    const index = this.editIndex + num;
    const page = this.state.page;
    const total = this.total;
    const pageSize = this.pageSize;
    const windex = (page - 1) * pageSize + index;
    // 临界
    if (windex < 0) {
      message.info('翻到顶了')
    } else if (windex > total - 1) {
      message.info('翻到底了')      
    } else if (index < 0 || index > pageSize - 1) {
      // 翻页
      await this.reloadRes(this.state.page + num);
      setTimeout(() => {
        const new_index = (index + pageSize) % pageSize;
        this.editResModal && this.editResModal.showEdit(this.state.resList[new_index])
        this.editIndex = new_index;
      }, 10);
    } else {
      this.editResModal && this.editResModal.showEdit(this.state.resList[index])
      this.editIndex = index;
    }
  }

  openEdit (record: res, index: number) {
    this.editIndex = index;
    this.editResModal && this.editResModal.showEdit(record)
  }

  async componentDidMount () {
    this.reloadRes();
    const list: group[] = await getGroups()
    const groupMap: {[index: string]: group} = {}
    list.forEach(item => {
      groupMap[item._id] = item
    })
    this.setState({ groupMap })
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onRowSelectChange,
    };
    return (
      <div>
        <Button style={{ marginRight: 8 }}><Link to="/resources/upload">上传</Link></Button>
        <GroupSelect change={(value: string) => this.onFilterSelectChange(value)}></GroupSelect>
        <Search
          placeholder="关键字"
          onSearch={value => { this.keyWords = value; this.reloadRes(); }}
          style={{ marginLeft: 8, width: 200 }}></Search>
        <Button style={{ marginLeft: 8, marginRight: 8 }} onClick={() => this.startChangeGroup()}>
          { this.state.inChangeGroup ? '放弃修改' : '修改分组' }
        </Button>
        { this.state.inChangeGroup ? 
        <Fragment>
          <GroupSelect placeholder="目标分组" hideAll change={(value: string) => this.onNewSelectChange(value)}></GroupSelect>
          <Button style={{marginLeft: 8}} onClick={() => this.doChangeGroup()}>确定分组</Button>
        </Fragment>
        : '' }
        <div style={{ paddingTop: 12 }}></div>
        <div style={{ overflow: 'auto'}}>
          <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.resList} rowKey="_id"
            loading={loading}
            pagination={{
              current: this.state.page,
              hideOnSinglePage: true,
              showSizeChanger: true,
              defaultPageSize: this.pageSize,
              pageSizeOptions: ['10', '20', '30', '40'],
              total: this.total,
              showQuickJumper: true,
              onChange: (page, pageSize) => {
                pageSize && (this.pageSize = pageSize) 
                this.reloadRes(page)
              },
              onShowSizeChange: (current, size) => {
                size && (this.pageSize = size) 
                this.reloadRes(current)
              }
            }} />
          </div>
          <EditResModal ref={ins => this.editResModal = ins}
            reloadList={() => this.reloadRes()}
            changeCurrent={(num: number) => this.changCurrent(num)}
            ></EditResModal>
      </div>
    );
  }
}

export default Resources;