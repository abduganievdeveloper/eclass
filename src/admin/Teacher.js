import React from 'react';
import './admin.css';
import {
  Spinner
  , Row
  , Container
  ,Button
  ,ListGroup
  ,ListGroupItem
  ,Col
  ,Input
  ,Label
  ,Form
  ,Table
} from 'reactstrap';
import {store} from './store.js';
import {setSubject} from './store.js';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';

export class Teacher extends React.Component
{
    render()
    {
        return(<Row>
            <Col md="3">
            <Provider store={store}>
                <SubjectListR/>
            </Provider>
            
            </Col>
            <Col md="9">
            <Provider store={store}>
                <TeacherListR/>
            </Provider>
            </Col>
        </Row>)
    }
}
export class SubjectList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            subjects:[],
            loaded:false
        }
        this.fetchSubjects=this.fetchSubjects.bind(this);
        this.addSubject=this.addSubject.bind(this);
        this.delete=this.delete.bind(this);
        this.editSubject=this.editSubject.bind(this);
    }
    editSubject(e) {
        const newName = prompt("Edit this subject", "");
        var payload = {
          subject: newName
        }
        payload = JSON.stringify(payload);
        

        const url = "https://eclass-tashkent.herokuapp.com/api/superuser/update/subject/" + e.target.name + "/";
        const token = "Token " + this.props.token;
        fetch(url, {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          },
          body: payload
        })
          .then(response => response.json())
          .then((json) => {
            this.fetchSubjects();
        
            alert("edited");
          })
          .catch(err => console.log(err));
    }
    fetchSubjects()
    {
        const url='https://eclass-tashkent.herokuapp.com/api/superuser/list/subject/';
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
           
            this.setState({
                loaded:true,
                subjects:json
            });
            this.props.setSubject(json);
          })
          .catch(err=>console.log(err));
    }
    addSubject()
    {
        const url='https://eclass-tashkent.herokuapp.com/api/superuser/create/subject/';
        const token="Token "+this.props.token;
        const s=prompt("Write subject","");
        var payload={
            subject:s
        }
        payload=JSON.stringify(payload);
        if(s!==undefined&&s!=="")
        {
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
            
            this.fetchSubjects();
          })
          .catch(err=>console.log(err));
        }  
    }
    delete(e)
  {
    
      
      const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/delete/subject/'+e.target.name+'/';
      const token = "Token " + this.props.token;
  
      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          this.fetchSubjects();
          alert("deleted");
        })
        .catch(err => console.log(err));
    
  }
    componentDidMount()
    {
        this.fetchSubjects();
        
    }
    render()
    {
        const subjects=this.state.subjects.map((i)=>{
            return(<ListGroupItem key={i.id}>
                <Button color="danger" onClick={this.delete} name={i.id}>D</Button>
                <Button color="warning" onClick={this.editSubject} name={i.id}>E</Button>
                {i.subject}
            </ListGroupItem>)
        })
        return(<div >
            <h3>Subjects <Button color="success" onClick={this.addSubject}>Add subject</Button></h3>
            {!this.state.loaded && <div>
        <Spinner type="grow" color="primary" />
        <Spinner type="grow" color="success" />
        <Spinner type="grow" color="danger" />
      </div>}
      <ListGroup>
          {subjects}
      </ListGroup>
        </div>)
    }
}
export class TeacherList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            loaded:false,
            firstname:'',
            lastname:'',
            phone:'',
            email:'',
            address:'',
            date:'',
            password:'',
            subjects:[],
            teachers:[],
            adding:false,
            editing:false
        }
        this.fetchTeachers=this.fetchTeachers.bind(this);
        this.onChange=this.onChange.bind(this);
        this.addTeacher=this.addTeacher.bind(this);
        this.toggle=this.toggle.bind(this);
        this.editTeacher=this.editTeacher.bind(this);
        this.delete=this.delete.bind(this);
    }
    fetchTeachers()
    {
        
        const url="https://eclass-tashkent.herokuapp.com/api/superuser/list/teacher/";
        const token="Token "+this.props.token;
        
        this.setState({
            loaded:false,
           
        })
        
        fetch(url,{
            method:'GET',
            headers:{
              Authorization:token,
              "Content-Type":"application/json"
            }
          })
          .then(res=>res.json())
          .then((json)=>{
             
              this.setState({
                  loaded:true,
                  teachers:json
              })
           
          })
          .catch(err=>console.log(err));
          
    }
    componentDidMount()
    {
        this.fetchTeachers();
    }
  
    onChange(e)
    {
        if(e.target.name==='firstname')
        {
            this.setState({
                firstname:e.target.value
            })
        }
        if(e.target.name==='lastname')
        {
            this.setState({
                lastname:e.target.value
            })
        }
        if(e.target.name==='phone')
        {
            this.setState({
                phone:e.target.value
            })
        }
        if(e.target.name==='address')
        {
            this.setState({
                address:e.target.value
            })
        }
        if(e.target.name==='email')
        {
            this.setState({
                email:e.target.value
            })
        }
        if(e.target.name==='date')
        {
            this.setState({
                date:e.target.value
            })
        }
        if(e.target.name==='password')
        {
            this.setState({
                password:e.target.value
            })
        }
        if(e.target.name==='subject')
        {   
           
           
            var index=this.state.subjects.indexOf(e.target.value);
            var array=this.state.subjects;
            if(index===-1)
            {
            this.setState({
                subjects:[...this.state.subjects,Number(e.target.value)]
            })
            }else{
               var length=array.length; 
               array.splice(index,1);
               if(array.length!==length)
               {
                   this.setState({
                       subjects:array
                   })
               } 
            }
               
        }
    }
    
    addTeacher(e)
    {
        e.preventDefault();
        var payload={
            first_name:this.state.firstname,
            last_name: this.state.lastname,
            phone: this.state.phone,
            email: this.state.email,
            address: this.state.address,
            subject:this.state.subjects,
            user_birth_date: this.state.date,
            password: this.state.password
        }
        payload=JSON.stringify(payload);
        console.log(payload);
        const url='https://eclass-tashkent.herokuapp.com/api/superuser/create/teacher/';
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
            this.fetchTeachers();
            this.toggle();
          })
          .catch(err=>console.log(err));
        
    }
    editTeacher(e)
    {
        e.preventDefault();
        var payload={
            first_name:this.state.firstname,
            last_name: this.state.lastname,
            phone: this.state.phone,
            email: this.state.email,
            address: this.state.address,
            subject:this.state.subjects,
            user_birth_date: this.state.date,
            password: this.state.password
        }
        payload=JSON.stringify(payload);
        console.log(payload);
        const url='https://eclass-tashkent.herokuapp.com/api/superuser/update/teacher/'+this.state.pk+'/';
        const token="Token "+this.props.token;
        fetch(url,{
            method:'PUT',
            headers:{
              Authorization:token,
              "Content-Type":"application/json"
            },
            body:payload
          })
          .then(res=>res.json())
          .then((json)=>{
            console.log(json);
            this.fetchTeachers();
            this.toggle();
          })
          .catch(err=>console.log(err));
        
    }
    toggle(e)
    {
        const add=this.state.adding;
        this.setState({
            adding:!add
        });
        if(e!==undefined)
   {
    
    
    if(e.target.name!=="" && e.target.name!==undefined)
    {console.log(e.target.name);
      var st=this.state.teachers.filter(i=>i.pk==e.target.name);
      console.log(st);
      if(st!==[])
      {

      
      st=st[0];
      this.setState({
        pk:e.target.name,
        editing:true,
        acTeacher:e.target.value,
        firstname: st.first_name,
        lastname: st.last_name,
        fathersname: st.user_father_name,
        email: st.email,
        address: st.address,
        phone: st.phone,
        date: st.user_birth_date
    
      })
    }
    }
    }}
    delete(e)
    {
      
      const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/delete/teacher/'+e.target.name+'/';
      const token = "Token " + this.props.token;
  
      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          this.fetchTeachers();
        })
        .catch(err => console.log(err));
    }
    render() {
        
        var subjects;    
        if(this.props.subjects[0]!==undefined)
        {
            subjects=this.props.subjects[0].map((i)=>{
                return(<div key={i.id}><Input type="checkbox"  onClick={this.onChange} name="subject" value={i.id}/>  
              <Label>{i.subject}</Label></div>);
            });        
        }
        const teachers=this.state.teachers.map((i,ind)=>{
         return(<tr key={i.pk}> 
               <td>{ind+1}</td>
            <td>{i.first_name+" "+i.last_name}</td>
            <td>{i.subject}</td>
            <td>{i.user.username}</td>
            <td>{i.password}</td>
            <td><Button name={i.pk} onClick={this.toggle} color="warning">EDIT</Button></td>
            <td><Button name={i.pk} onClick={this.delete} color="danger">DELETE</Button></td>
            </tr>)
        });
           
        return (<div >
            <h3>Teachers <Button color="info" onClick={this.toggle}>{!this.state.adding&&<strong>ADD TEACHER</strong>}{this.state.adding&&<strong>List of TEACHER</strong>}</Button></h3><hr />
            {!this.state.loaded && <div>
                <Spinner type="grow" color="primary" />
                <Spinner type="grow" color="success" />
                <Spinner type="grow" color="danger" />
            </div>}
            <hr/>
          {!this.state.adding&&  
            <Container>
            <Table>
                <tbody>
                <tr>
                    <td>#</td>
                    <td>Name</td>
                    <td>subject</td>
                    <td>username</td>
                    <td>password</td>
                    <td>EDIT</td>
                    <td>Delete</td>
                </tr>    
                {teachers}
                </tbody>

            </Table>    
            </Container> 
            }

           
        {this.state.adding&&<Container>    
              
               <Form onSubmit={this.state.editing?this.editTeacher:this.addTeacher}>
                   <Label>First name : {this.state.firstname}</Label>
                   <Input type='text' name="firstname" onChange={this.onChange} value={this.state.firstname}></Input>
                   <Label>Last name : {this.state.lastname}</Label>
                   <Input type='text' name="lastname" onChange={this.onChange} value={this.state.lastname}></Input>
                   <Label>Phone : {this.state.phone}</Label>
                   <Input type='text' name="phone" onChange={this.onChange} value={this.state.phone}></Input>
                   <Label>Email : {this.state.email}</Label>
                   <Input type='text' name="email" onChange={this.onChange} value={this.state.email}></Input>
                   <Label>Address : {this.state.address}</Label>
                   <Input type='text' name="address" onChange={this.onChange} value={this.state.address}></Input>
                   <Label>Birth day : {this.state.date}</Label>
                   <Input type='date' name="date" onChange={this.onChange} value={this.state.date}></Input>
                   <Label>Password : {this.state.password}</Label>
                   <Input type='password' name="password" onChange={this.onChange} value={this.state.password}></Input>
                   <Label>Choose subjects </Label><br/>
                   <br/>
                   {subjects}
                   
                   
                   {!this.state.editing&&<Button type='submit' color="secondary">SUBMIT</Button>}
                   {this.state.editing&&<Button type='submit' color="warning">EDIT</Button>}
                   
               </Form>
              
            </Container>}        
        </div>)
    }
}




//react-redux
const mapStateToProps = (state) => {
    return {token: state.lr.token ,
        subjects:state.sr.subjects       
    }
  };
  const mapDispatchToProps = (dispatch) => {
    return {  
      setSubject: (subjects) => {   
        dispatch(setSubject(subjects))
      }
    }
  };
  
  
  const TeacherListR = connect(mapStateToProps,null)(TeacherList);
  const SubjectListR = connect(mapStateToProps,mapDispatchToProps)(SubjectList);
  
