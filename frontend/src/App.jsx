import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import AppRoutes from './routes/AppRoutes';
import { fetchMeThunk } from './store/auth/authThunk';
import { getToken } from './utils/token';

const AppContent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
