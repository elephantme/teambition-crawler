import * as React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { FileDoneOutlined, UnorderedListOutlined } from '@ant-design/icons';

interface MenuItem {
  title: string;
  key: string;
  icon: JSX.Element;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: '空间列表',
    key: '/',
    icon: <UnorderedListOutlined />,
  },
];

export default function Nav() {
  const location = useLocation();
  const key =
    '/' +
    location.pathname
      .split('/')
      .filter((s) => s !== '')
      .join('/');
  /**
   * 递归渲染
   */
  const renderMenu = (items: MenuItem[]) => {
    return items.map((item) => {
      if (item.children && item.children.length) {
        return (
          <Menu.SubMenu key={item.key} title={item.title} icon={item.icon}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        );
      }
    });
  };
  return (
    <Menu theme={'dark'} mode={'inline'} selectedKeys={[key]}>
      {renderMenu(menuItems)}
    </Menu>
  );
}
