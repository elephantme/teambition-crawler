import * as React from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import Layout from '../components/Layout';
import { Location } from 'history';
import NotFountPage from '../components/404';
import Workspace from '../pages/Workspace';

export const routes = () => {
  const RouteAdapter: React.FC = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const adaptedHistory = React.useMemo(
      () => ({
        replace(location: Location) {
          navigate(location, { replace: true, state: location.state });
        },
        push(location: Location) {
          navigate(location, { replace: false, state: location.state });
        },
      }),
      [navigate],
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return children({ history: adaptedHistory, location });
  };

  return (
    <QueryParamProvider ReactRouterRoute={RouteAdapter}>
      <Routes>
        <Route path={'/'} element={<Layout />}>
          <Route path={'/'} element={<Workspace />}></Route>
          <Route path="*" element={<NotFountPage />} />
        </Route>
      </Routes>
    </QueryParamProvider>
  );
};
