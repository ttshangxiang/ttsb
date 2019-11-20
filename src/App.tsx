import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Frame from './components/Frame';
import Home from './pages/Home';
import Life from './pages/Life'
import Resources from './pages/Resources'
import UploadRes from './pages/Resources/UploadRes'
import ResGroup from './pages/Resources/ResGroup'

class App extends Component {
  render() {
    return (
      <Router>
        <Frame>
          <Route path='/' exact component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/life' component={Life} />
          <Route path='/comments' component={Home} />
          <Route path='/resources' exact component={Resources} />
          <Route path='/resources/upload' component={UploadRes} />
          <Route path='/resources/group' component={ResGroup} />
        </Frame>
      </Router>
    );
  }
}

export default App;