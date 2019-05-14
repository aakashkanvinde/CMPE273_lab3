import React, {Component} from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

// App Component
class App extends Component {
    render(){
        return(
            <Provider store = {store}>
             {/* Routing to different pages */}
                <BrowserRouter>
                    <div>
                        {/* Child Component of App Component */}
                        <Main />
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

// Exporting the App Component
export default App;