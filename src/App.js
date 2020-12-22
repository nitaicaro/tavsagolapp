import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import axios from 'axios';


class App extends React.Component {

constructor(props){
  super(props);
  this.state = {
    'maxInputFieldText': -1,
    'peopleInside': -1,
    'maxPeople': -1,
    'url': '',
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
  this.setState({url: 'http://3.23.88.38:8080'}) 
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
    if (window.location.protocol.indexOf('https') == 0){
      var el = document.createElement('meta')
      el.setAttribute('http-equiv', 'Content-Security-Policy')
      el.setAttribute('content', 'upgrade-insecure-requests')
      document.head.append(el)
    }
    return (
      <div>
      <Box display="flex" alignItems="center" flexDirection="column" bgcolor="background.paper">
        <Box bgcolor="grey.300" display="flex" alignItems="center" >
          Set max: &nbsp; 
          <TextField id="standard-basic" label="Standard" onChange={this.onTextChange.bind(this)}>
            Amount
          </TextField>
          <Button variant="contained" color="primary" onClick={this.onClick.bind(this)}>
            Submit
          </Button>
        </Box>
        <br />
        <Box bgcolor="grey.300">
        Current business state:
          <div style={this.getCounterStyle()}>
            {this.state.peopleInside}/{this.state.maxPeople}
          </div>
        </Box>
      </Box>
    </div>
    );
  }
}

export default App;
