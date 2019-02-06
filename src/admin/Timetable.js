import React from 'react';
import {store} from './store.js';
import {agChange} from './store.js';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import {Spinner
    , Row
    , Container
    ,Button
    ,ListGroup
    ,ListGroupItem
    ,Col
    ,Table
    ,Input
    ,Label
    ,Alert
    } from 'reactstrap';
export class Timetable extends React.Component
{
   
    render()
    {
        return(<Container fluid>
               <Row>
                <Col md="3">
                  <Provider store={store}>
                     <GroupsR/>
                  </Provider>
                </Col>
                <Col md="9">
                 
               
               <Provider store={store}>
                  <TimetableListR/>
               </Provider>
               </Col>  
               </Row> 
            </Container>)
    }
}
class Groups extends React.Component {
    constructor(props) {
      super(props)
      this.fetchGroups = this.fetchGroups.bind(this);
      this.state = {
        loaded: false,
        groups: []
      }
      this.fetchGroups = this.fetchGroups.bind(this);
      this.addGroup = this.addGroup.bind(this);
      this.editGroup=this.editGroup.bind(this);
      this.agChange=this.agChange.bind(this);
    }
    fetchGroups() {
      
      const url = "https://eclass-tashkent.herokuapp.com/api/superuser/list/group/";
      const token = "Token "+this.props.token;
     
      if (token !== "" && token!==undefined) {
  
        
          fetch(url, {
            method: 'GET',
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          })
            .then(response => { return response.json() })
            .then((json) => {
              this.setState({
                loaded:true,
                groups:json
              });
            
              
            })
            .catch(err => console.log(err));
            
        
      }
    }
    componentDidMount() {
      this.fetchGroups();
    }
    addGroup()
    {
      const groupname=prompt("Write the group name","");
      var payload={
        group:groupname
      }
      payload=JSON.stringify(payload);
  
      const url="https://eclass-tashkent.herokuapp.com/api/superuser/create/group/";
      const token="Token "+this.props.token;
      fetch(url,{
        method:"POST",
        headers:{
          Authorization:token,
          "Content-Type": "application/json"
        },
        body:payload
      })
      .then(response=>response.json())
      .then((json)=>{
        console.log(json);
        this.fetchGroups();
      })
      .catch(err=>console.log(err));
    }
    editGroup(e)
    {
      const newName=prompt("Edit this group","");
      var payload={
        group:newName
      }
      payload=JSON.stringify(payload);
  
      const url="https://eclass-tashkent.herokuapp.com/api/superuser/update/group/"+e.target.name+"/";
      const token="Token "+this.props.token;
      fetch(url,{
        method:"PUT",
        headers:{
          Authorization:token,
          "Content-Type": "application/json"
        },
        body:payload
      })
      .then(response=>response.json())
      .then((json)=>{
        console.log(json);
        this.fetchGroups();
      })
      .catch(err=>console.log(err));
    }
   agChange(e)
   {
    this.props.agChange(e.target.name, e.target.value);
   }
    render() {
      const grouplist=this.state.groups.map((i,ind)=>{
        return (<ListGroupItem key={i.id}>
              <Button color="default" name={i.id} value={i.group} onClick={this.agChange}>
              {i.group}
              </Button>       
          </ListGroupItem>);
      })
  
      const groups=<Container className="paddingMax">
        <ListGroup>
        {grouplist}
        </ListGroup>   
      </Container>
      return (<section className="grouplist">
        <h3>Groups <Button color="primary" onClick={this.addGroup}>Add Group</Button></h3><hr />
        {!this.state.loaded && <div>
          <Spinner type="grow" color="primary" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="danger" />
        </div>}
        {groups};
  
  
  
      </section>);
    }
}
class TimetableList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.setTimeTable=this.setTimeTable.bind(this);
        this.fetchTimetable=this.fetchTimetable.bind(this);
        this.fetchTeachers=this.fetchTeachers.bind(this);
        this.fetchSubjects=this.fetchSubjects.bind(this);
        this.reset=this.reset.bind(this);
        this.toggle=this.toggle.bind(this);
        this.nextday=this.nextday.bind(this);
        this.previousday=this.previousday.bind(this);
        this.nextorder=this.nextorder.bind(this);
        this.previousorder=this.previousorder.bind(this);
        this.onChange=this.onChange.bind(this);
        this.delete=this.delete.bind(this);
        this.state={
          days:["Monday","Tuesday","Wednesday","Thirsday","Friday","Saturday"],
          order:1,
          allsubjects:[],
          allteachers:[],
          teacher:'',
          subject:'',
          ad:0,
          room:'',
          time:'',
          adding:true,
          timetable:[],
          loaded:false
        }
    }  
    fetchTeachers(){
      
      const url = "https://eclass-tashkent.herokuapp.com/api/superuser/list/teacher/";
      const token = "Token "+this.props.token;
     
      if (token !== "" && token!==undefined) {
  
        
          fetch(url, {
            method: 'GET',
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          })
            .then(response => { return response.json() })
            .then((json) => {
              console.log(json);
              this.setState({
                allteachers:json
              });
            })
            .catch(err => console.log(err));
      }
    }
    fetchSubjects()
    {
        const url='https://eclass-tashkent.herokuapp.com/api/superuser/list/subject/';
        const token="Token "+this.props.token;
        
        fetch(url,{
            method:'GET',
            headers:{
              Authorization:token,
              "Content-Type":"application/json"
            },
          })
          .then(res=>res.json())
          .then((json)=>{
           console.log(json);
            this.setState({
                allsubjects:json
            });
           
          })
          .catch(err=>console.log(err));
    }
    fetchTimetable(a)
    {
      var group=this.props.ag;
      if(a!==undefined)
      {
        group=a;
      }
      if(group!==-1)
      {

      console.log("triggered");
      const url='https://eclass-tashkent.herokuapp.com/api/superuser/list/timetable/?group='+group;
        const token="Token "+this.props.token;
        this.setState({
          loaded:false
        })
        fetch(url,{
            method:'GET',
            headers:{
              Authorization:token,
              "Content-Type":"application/json"
            },
          })
          .then(res=>res.json())
          .then((json)=>{
           console.log(json);
            this.setState({
                timetable:json,
                loaded:true
            });
           
          })
          .catch(err=>console.log(err));
        }   
    }
    componentDidMount() {
      this.fetchTeachers();
      this.fetchSubjects();
      this.fetchTimetable();
    }
    componentWillReceiveProps(nextProps)
    {
      if(this.props.ag!==nextProps.ag)
      {
        this.fetchTimetable(nextProps.ag)
      }
    }
    toggle()
    {
      
      var adding=this.state.adding;
      this.setState({
        adding:!adding
      });
     this.fetchTimetable();
    }
    setTimeTable()
    {
     
        var payload={
            subject:this.state.subject,
            group: [this.props.ag],
            day:this.state.days[this.state.ad],
            room:this.state.room,
            teacher:this.state.teacher,
            time:this.state.time,
            order:this.state.order+"-dars"
        }
        payload=JSON.stringify(payload);
        console.log(payload);
        const url='https://eclass-tashkent.herokuapp.com/api/superuser/create/timetable/';
        const token="Token "+this.props.token;
        fetch(url,{
            method:'POST',
            headers:{
              Authorization:token,
              "Content-Type":"application/json"
            },
            body:payload
          })
          .then(res=>res.json())
          .then((json)=>{
            console.log(json);
            this.reset();
          })
          .catch(err=>console.log(err));
    }
    onChange(e)
    {
      if(e.target.name==="room")
      {
        this.setState({
          room:e.target.value
        })
      }
      if(e.target.name==="time")
      {
        this.setState({
          time:e.target.value
        })
      }
      if(e.target.name==="teacher")
      {
        this.setState({
          teacher:e.target.value
        });
      }
      if(e.target.name==="subject")
      {
        this.setState({
          subject:e.target.value
        });
      }
    }
    reset()
    {
     
        this.setState({
          order:this.state.order+1
        })
        alert("Added");
        
    }
    nextday()
    {
      this.setState({
        order:1
      })
      if(this.state.ad<5)
      {
        this.setState({
          ad:this.state.ad+1
        })
      }else{
        this.setState({
          ad:0
        })
        this.toggle();
      }
    }
    previousday()
    {
      this.setState({
        order:1
      })
      if(this.state.ad>0)
      {
        this.setState({
          ad:this.state.ad-1
        })
      }else{
        this.setState({
          ad:0
        })
      }
    }
    nextorder()
    {
      
    
        this.setState({
          order:this.state.order+1
        })
      
    }
    previousorder()
    {
      
        console.log("pre");
        if(this.state.order>1)
        {

        
        this.setState({
          order:this.state.order-1
        })
      }
    }
    delete(e)
    {
    
      
      const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/delete/timetable/'+e.target.name+'/';
      const token = "Token " + this.props.token;
  
      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          this.fetchTimetable();
          alert("deleted");
        })
        .catch(err => console.log(err));
    
    }
    render()
    {
        const subjects=this.state.allsubjects.map((i)=>{
          return (<option  key={i.id} name="subject" value={i.id}>{i.subject}</option>)
        });
        
        const teachers=this.state.allteachers.map((i)=>{
          return (<option  key={i.pk} name="teacher" value={i.pk}>{i.first_name+" "+i.last_name}</option>)
        });

        const timetable=this.state.timetable.map((i)=>{
          return(<tr key={i.pk}>
            <td>
              {i.day}
            </td>
            <td>
              {i.order}
            </td>
            <td>
              {i.subject.subject}
            </td>
            <td>
              {i.room}
            </td>
            <td>
              {i.time}
            </td>
            <td>
              <Button name={i.pk} onClick={this.delete} color="danger">Delete</Button>
            </td>
          </tr>)
        })
       
        return(<div><br/>
            <Button color="secondary" onClick={this.toggle}>{this.state.adding&&<h3>List timetables</h3>}{!this.state.adding&&<h3>Add timetable</h3>}</Button>
           
            {this.state.adding&&<Container><br/>
                <br/>
                <h2>{this.state.days[this.state.ad]}</h2>
                <hr/>
                {this.props.ag===-1&&<Alert color="danger">
        Please choose group first
      </Alert>}
      <Alert color="primary">{this.props.agname}</Alert>
                <h4>Order {this.state.order}</h4>
                <Label>Subject:</Label> {this.state.subject}
                <Input type="select" onChange={this.onChange} name="subject">
                    <option/>
                    {subjects}
                </Input>
                <Label>Teachers:</Label>  {this.state.teacher}
                <Input type="select"  onChange={this.onChange} name="teacher"> 
                  <option/>
                    {teachers}
                </Input>  
                <Label>Room</Label>{this.state.room}<Input placeholder="room" name="room" onChange={this.onChange}/>
                <Label>Time</Label>{this.state.time}<Input type="time" name="time" onChange={this.onChange}/>
                <br/>
                <Button color="warning" onClick={this.setTimeTable}>Save</Button><span> </span> 
                <Button color="secondary" onClick={this.previousorder}>Previous order</Button><span> </span>
                <Button color="primary" onClick={this.nextorder}>Next order</Button><span> </span>
                <Button color="secondary" onClick={this.previousday}>Previous day</Button><span> </span>
                <Button color="success" onClick={this.nextday}>Next day</Button>
           </Container>}
           {!this.state.adding&&<Container><br/>
           <Alert color="primary">{this.props.agname}</Alert>
           {this.state.loaded&&
           <Table dark>
             <tbody>
               <tr>
                 <th>DAY</th>
                 <th>ORDER</th>
                 <th>SUBJECT</th>
                 <th>ROOM</th>
                 <th>TIME</th>
                 <th>EDIT</th>
               </tr>
               {timetable}
             </tbody>
           </Table>
           }  
           {!this.state.loaded&&<div>
          <Spinner type="grow" color="primary" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="danger" />
           </div>}   
           </Container>}
           </div>)
    }
}

//react redux

const mapStateToProps = (state) => {
    return {token: state.lr.token,
            ag:state.agr.ag,
            agname:state.agr.agname        
    }
  };
  const mapDispatchToProps = (dispatch) => {
    
    return {  
      agChange: (ag,agname) => {   
        dispatch(agChange(ag,agname))
      }
    }
  };
  
  
  const GroupsR = connect(mapStateToProps,mapDispatchToProps)(Groups);
  const TimetableListR = connect(mapStateToProps,null)(TimetableList);
  

