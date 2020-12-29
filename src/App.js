import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
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
    'log': {}
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

getHistory(url) {
  let data = { 'history': '' };
  this.performPostRequest(url, data);
}

fillHistogram(history) {

}

performPostRequest(url, data){
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
    if (response.data === "MAX UPDATED") {
      alert('MAX successfully updated to ' + data.max);
    } else {
      this.setState({log: (response.data)});
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
  let url = 'http://3.138.173.166:8080';
  this.getHistory(url);
  this.setState({url: url}) 
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
      <Box display="flex" alignItems="center" flexDirection="column" style={{position: 'absolute', width:'100%', left:'50%', top:'50%', transform: 'translate(-50%,-50%)'}}>
        <img src={logo} style={{width: '50%' }} />
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
        <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '20%', width:'100%', overflowY: 'scroll', backgroundColor: 'white'}}>
          <b>ACCESS VIOLATION HISTORY</b> 
          &nbsp;
          <u style={{color: 'blue', cursor: 'pointer'}} onClick={() => window.location.reload(false)}>
            (refresh)
          </u>
        </Box>
        <Box style={{ height: '20%', width:'100%', overflowY: 'scroll', backgroundColor: 'white'}}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead >
              {Object.entries(this.state.log).map(entry => (
                  Object.keys(entry[1]).map((date) => (
                    <TableRow>
                      <TableCell>{date}</TableCell>
                      <TableCell>{entry[1][date]}</TableCell>
                    </TableRow>
                  ))
                ))}
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
    );
  }
}

export default App;

/*
        Object.keys(entry).map(date => (
                      
                    ))
        */