import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Frame from './components/Frame';
import Home from './pages/Home';
import Life from './pages/Life'

class App extends Component {
  render() {
    return (
      <Router>
        <Frame>
          <Route path='/' exact component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/life' component={Life} />
          <Route path='/artcles' component={Home} />
          <Route path='/comments' component={Home} />
          <Route path='/albums' component={Home} />
          <Route path='/resources' component={Home} />
        </Frame>
      </Router>
    );
  }
}

export default App;