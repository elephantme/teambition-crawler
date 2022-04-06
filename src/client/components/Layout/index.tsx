import * as React from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <Page>
      <LeftWrapper>
        <div className={'title'}>Teambition Crawler</div>
        <Nav />
      </LeftWrapper>
      <RightWrapper>
        <Content>
          <Outlet />
        </Content>
      </RightWrapper>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  height: 100%;
`;

const menuWidth = 230;

const LeftWrapper = styled.div`
  background-color: #304156;
  width: ${menuWidth}px;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  //z-index: 1001;

  .title {
    text-align: center;
    color: #fff;
    padding: 20px;
    font-size: 20px;
    font-weight: bold;
  }

  .ant-menu {
    > li {
      //padding-left: 26px;
    }

    .ant-menu-sub {
      background-color: transparent;
    }

    background-color: #304156;
  }

  .ant-menu-item-icon {
    position: relative;
    font-size: 16px;
    color: #dee4eb;
    top: -1px;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin-left: ${menuWidth}px;
`;

const bannerHeight = 50;

const TopBanner = styled.div`
  width: 100%;
  height: ${bannerHeight}px;
  box-shadow: 1px 2px 6px #ddd;
  background: #fff;
  z-index: 1;
  flex-shrink: 0;

  .user-icon {
    line-height: 50px;
    float: right;
    margin-right: 20px;

    span {
      font-size: 14px;
    }

    .anticon {
      vertical-align: middle;
    }
  }
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  padding: 10px 10px 0px 10px;
  overflow: hidden;
`;
