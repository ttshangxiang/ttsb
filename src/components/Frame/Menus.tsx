import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';

const { SubMenu } = Menu;

const menus = [
  {
    name: '生涯',
    sub: [
      {
        name: '生活',
        path: '/life/live'
      },
      {
        name: '游戏',
        path: '/life/game'
      },
      {
        name: '影视',
        path: '/life/media'
      },
      {
        name: '阅读',
        path: '/life/read'
      }
    ]
  },
  {
    name: '评论',
    path: '/comments'
  },
  {
    name: '资源',
    sub: [
      {
        name: '内容',
        path: '/resources'
      },
      {
        name: '上传',
        path: '/resources/upload'
      },
      {
        name: '分组',
        path: '/resources/group'
      }
    ]
  }
]

interface props {
  location: any;
}

interface state {
  selectedKeys: string[]
  openKeys: string[]
}

class Menus extends Component<props, state> {

  state: state = {
    selectedKeys: [],
    openKeys: []
  }

  componentDidUpdate(prevProps: any) {
    const locationChanged =
      this.props.location !== prevProps.location;
    
    if (locationChanged) {
      this.setSelectedClass()
    }
  }

  setSelectedClass () {
    document.querySelectorAll('#jhq-menu a.aaa').forEach(item => {
      const key = item.getAttribute('data-key');
      const open = item.getAttribute('data-open');
      const obj: any = {}
      key && (obj.selectedKeys = [key]);
      open && !this.state.openKeys.includes(open)
        && (obj.openKeys = [open].concat(this.state.openKeys));
      this.setState(obj);
    })
  }

  componentDidMount () {
    this.setSelectedClass()
  }

  render() {
    const activeClassName = 'aaa';
    return (
      <Menu
        id="jhq-menu"
        mode="inline"
        selectedKeys={this.state.selectedKeys}
        onSelect={({key}) => this.setState({selectedKeys: [key]})}
        openKeys={this.state.openKeys}
        onOpenChange={keys => this.setState({openKeys: keys})}
        style={{ height: '100%' }}
        forceSubMenuRender={true}
      >
        {menus.map((item, index) => {
          if (item.sub) {
            return (
              <SubMenu key={index} title={<span><Icon type="user" />{item.name}</span>}>
                {item.sub.map((ii, iindex) => (
                  <Menu.Item key={index + '-' + iindex}>
                    <NavLink to={ii.path} activeClassName={activeClassName} data-key={index + '-' + iindex} data-open={index}>{ii.name}</NavLink>
                  </Menu.Item>
                ))}
              </SubMenu>
            )
          } else {
            return (<Menu.Item key={index}>{
              <NavLink to={item.path} activeClassName={activeClassName} data-key={index}><span><Icon type="user" />{item.name}</span></NavLink>
            }</Menu.Item>)
          }
        })}
      </Menu>
    )
  }
}

export default withRouter(Menus as any)
