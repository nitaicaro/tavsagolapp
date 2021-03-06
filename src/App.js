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
import Histogram from 'react-chart-histogram';
import './index.css';

/*
git commit -a -m "updated ip address" 
git push heroku master
*/

class App extends React.Component {

constructor(props){
  super(props);
  this.state = {
    'maxInputFieldText': -1,
    'peopleInside': -1,
    'maxPeople': -1,
    'url': '',
    'log': {},
    'times': {}
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
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
      this.setState({log: (response.data)});
  });
}

getTimes(url) {
  let data = { 'times': '' };
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
      var times = [];
      Object.keys(Object.keys(response.data[0])).forEach(time => {
        times.push(response.data[0][time]);
      })
      this.setState({times: times});
  });
}

resetHistory(url) {
  let data = { 'reset_history': '' };
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
    window.location.reload(false);
  });
}

resetCounter(url) {
  let data = { 'reset_counter': '' };
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
    window.location.reload(false);
  });
}


resetHistogram(url) {
  let data = { 'reset_histogram': '' };
  let config={
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
  }
  axios.post(url, data, config).then(response => {
    window.location.reload(false);
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
  let url = 'http://18.222.26.155:8080';
  this.getHistory(url);
  this.getTimes(url);
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
      <div display="flex" justifyContent="center" alignItems="center" style={{ backgroundColor: '#d3beed'}}>
      <Box display="flex" alignItems="center" flexDirection="column" >
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
        <Box>
        <br/>
        </Box>
        <Box display="flex" justifyContent="center" style={{ height: '20%', width:'100%'}}>
          <u style={{color: 'blue', cursor: 'pointer'}} onClick={() => {if(window.confirm('Reset all history?')){this.resetHistory(this.state.url)};}}>
              reset history
          </u>
          &nbsp; | &nbsp; 
          <u style={{color: 'blue', cursor: 'pointer'}} onClick={() => {if(window.confirm('Reset histogram?')){this.resetHistogram(this.state.url)};}}>
              reset histogram
          </u>
          &nbsp; | &nbsp; 
          <u style={{color: 'blue', cursor: 'pointer'}} onClick={() => window.location.reload(false)}>
              refresh all stats
          </u>
          &nbsp; | &nbsp; 
          <u style={{color: 'blue', cursor: 'pointer'}} onClick={() => {if(window.confirm('Reset counter?')){this.resetCounter(this.state.url)};}}>
              reset counter
          </u>
        </Box>
        <Box>
        <br/>
        <br/>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '20%', width:'100%'}}>
          <b>ACCESS VIOLATION HISTORY</b> 
          &nbsp;

        </Box>
        <Box>
        <br/>
        </Box>
        <Box style={{height: '300px', backgroundColor: 'white', overflowY: 'scroll'}}>
          <TableContainer>
            <Table>
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
        <Box>
        <br/>
        <br/>
        </Box>
        <Box display="flex" justifyContent="center" style={{ height: '20%', width:'100%'}}>
          <b>ENTRY HISTOGRAM</b> 
          &nbsp;
        </Box>
        <Box>
        <br/>
        </Box>
        <Box display="flex" justifyContent="start" style={{overflowX: 'scroll', width:'100%'}}>
          <Histogram
            xLabels={['00','01','02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12', '13','14','15','16','17','18','19','20','21','22','23']}
            yValues={this.state.times}
            height='200'
            width='1800'
            options={{fillColor: '#000000', strokeColor: '#000000' }}
          />
        </Box>
      </Box>
    </div>
    );
  }
}

export default App;