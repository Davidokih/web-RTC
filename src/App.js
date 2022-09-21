import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LocalDisplay from './components/LocalDisplay';
import RemoteDisplay from './components/RemoteDisplay';
import ShareScreen from './components/ShareScreen';

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <LocalDisplay /> } />
          <Route path="/display/:roomID" element={ <RemoteDisplay /> } />
          <Route path="/share" element={ <ShareScreen /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;