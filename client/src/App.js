import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import { setTimeout } from 'timers';
class App extends Component {
  constructor(props){
    super(props)
    this.state={
      messages:[],
      message:'',
      username:'',
      status:''
    }
    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.clearChat=this.clearChat.bind(this)
    this.socket = openSocket('localhost:4000');
    this.socket.on('output',(data)=>{
      if(data.length>0 && this.state.messages.length===0){
        this.setState({
          messages:data
        })
      }
    })
    this.socket.on('newMessage',data=>{
      console.log('newMessage...')
      this.setState({messages: [...this.state.messages, data]});
    })
    this.socket.on('status',data=>{
      this.setState({status:data.message,message:''})
      setTimeout(()=>this.setState({status:''}),1000)
    })
  }
  handleChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  handleSubmit(e){
    e.preventDefault()
    if(this.state.username!=='' && this.state.message!==''){
      this.socket.emit('input', {
        name:this.state.username,
        message:this.state.message
    });
    }
  }
  clearChat(){
    this.socket.emit('clear');
    this.socket.on('cleared',()=>{
      this.setState({
        messages:[],
        message:'',
        username:''
      })
    })
  }
  render() {

    return (
      <div className="App">
        <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3 col-sm-12">
                <h1 className="text-center">
                    MongoChat 
                    <button id="clear" className="btn btn-danger" onClick={this.clearChat}>Clear</button>
                </h1>
                {this.state.status!==''&&<div id="status">{this.state.status}</div>}
                <div id="chat">
                    <input type="text" autoComplete='off' name='username' onChange={this.handleChange} value={this.state.username} autoFocus={true} id="username" className="form-control" placeholder="Enter name..."/>
                    <br/>
                    {this.state.messages.length>0&& <div className="card">
                        <div id="messages" className="card-block">
                        {this.state.messages.length>0&&this.state.messages.map((msg)=>{
                        return <div key={msg._id} style={{overflowY:'scroll',maxHeight:300}} className='chat-message'>
                            <strong>{msg.name}</strong>: {msg.message}
                        </div>
                        })}
                        </div>
                    </div>}
                    <br/>
                    <textarea name='message' onKeyDown={(e)=>{
                      if(e.which===13 && e.shiftKey===false){
                        this.handleSubmit(e)
                      }
                    }} onSubmit={this.handleSubmit} value={this.state.message} onChange={this.handleChange} id="textarea" className="form-control" placeholder="Enter message..."></textarea>
                </div>
            </div>
        </div>
    </div>
      </div>
    );
  }
}

export default App;
