import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import logo from './logo.png'
import './index.css';

/*
git commit -a -m "history log"
git push heroku master
heroku open
*/

/*
 * over max 
 * invalid temp
 * didnt measure temp
 */

class App extends React.Component {

constructor(props){
  super(props);
  this.state = {
    'maxInputFieldText': -1,
    'peopleInside': -1,
    'maxPeople': -1,
    'url': '',
    'log': ''
  };
}

performGetRequest(url){
  axios.get(url).then(response => {
    let peopleInside = response.data.split(",")[0];
    let maxPeople = response.data.split(",")[1];
    this.setState({
      peopleInside: parseInt(peopleInside, 10),
      maxPeople: parseInt(maxPeople, 10)
    });
  });
}

performPostRequest(url, data){
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
    if (response.data === "MAX UPDATED") {
      alert('MAX successfully updated to ' + data.max);
    }
  });
}

onClick() {
  const maxInputFieldText = this.state.maxInputFieldText;
  if (maxInputFieldText < 0) {
    return;
  }
  let data = { 'max': maxInputFieldText };
  this.performPostRequest(this.state.url, data);
}

onTextChange(maxInputFieldText) {
  this.setState({"maxInputFieldText": maxInputFieldText.target.value});
}

componentDidMount() {
  this.setState({url: 'http://3.129.64.0:8080'}) 
  this.interval = setInterval(() => this.updateData(), 1000);
}

componentWillUnmount() {
  clearInterval(this.interval);
}

updateData() {
  this.performGetRequest(this.state.url);
}

getCounterStyle() {
  if (this.state.peopleInside <= this.state.maxPeople) {
    return {};
  } 
  return {fontWeight: 'bold', color: 'red'}
}

  render() {
    if (window.location.protocol.indexOf('https') === 0){
      var el = document.createElement('meta')
      el.setAttribute('http-equiv', 'Content-Security-Policy')
      el.setAttribute('content', 'upgrade-insecure-requests')
      document.head.append(el)
    }
    return (
      <div display="flex" justifyContent="center" alignItems="center" style={{height: '100vh', backgroundColor: '#d3beed'}}>
      <Box display="flex" alignItems="center" flexDirection="column" style={{position: 'absolute', left:'50%', top:'50%', transform: 'translate(-50%,-50%)'}}>
        <img src={logo} style={{width: '100%' }} />
        <Box display="flex" alignItems="center" flexDirection="column">
          <TextField id="standard-basic" label="Set Max" onChange={this.onTextChange.bind(this)} style={{width: '200px', textAlign: 'center'}}> </TextField>
          <br/>
          <Button variant="contained" color="primary" onClick={this.onClick.bind(this)} style={{width: '200px'}}>
            Submit
          </Button>
        </Box>
        <br />
        <Box display="flex" style={{fontFamily: 'stateFont'}}>
        CURRENT STATE: &nbsp;
          <div style={this.getCounterStyle()}>
            {this.state.peopleInside}/{this.state.maxPeople}
          </div>
        </Box>
        <br/>
        <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '20%', width:'70%', overflowY: 'scroll', backgroundColor: 'white'}}>
          <b>ACCESS VIOLATION HISTORY</b>
        </Box>
        <Box style={{ height: '20%', width:'70%', overflowY: 'scroll', backgroundColor: 'white'}}>
          1. mook
          <br/>
          2. pook
          <br/>
          3. dook
          <br/>
          4. jook
        </Box>
      </Box>
    </div>
    );
  }
}

export default App;
