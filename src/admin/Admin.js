import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import { NavLink as RRNavLink } from 'react-router-dom';
import {Student} from './Student';
import {Teacher} from './Teacher';
import {Faculty} from "./Faculty";
import {Timetable} from './Timetable';
import {Provider} from 'react-redux';
import {connect} from 'react-redux';
import {store} from './store.js';
import {login} from './store.js';
import {logout} from './store.js';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button ,
    Form,
    Input,
    Label,
    Row,
    Col,
    Container,
    Jumbotron,
    Container,
    Alert
} from 'reactstrap';
  
import 'bootstrap/dist/css/bootstrap.css';
import './admin.css';



export class Admin extends React.Component
{
      
    render()
    {
        
        if(this.props.login)
        {
            
            return(
                
                <BrowserRouter>
                <div>
                  <NavigationR />   
                  
                    <Route path="/admin/home" component={Index} exact/>
                    <Provider store={store}>
                        <Route path="/admin/faculty" component={FacultyR} exact/>
                    </Provider>
                    <Provider store={store}>
                        <Route path="/admin/student" component={StudentR} exact/>
                    </Provider>
                    <Provider store={store}>
                        <Route path="/admin/teacher" component={TeacherR} exact/>
                    </Provider>
                    <Provider store={store}>
                        <Route path="/admin/timetable" component={TimetableR} exact/>
                    </Provider>
                </div>
                </BrowserRouter>
                
        )     
        }else{
            return(
              <Provider store={store}>
                <LoginForm/>
              </Provider>
            );
        }
       
    }
}

class Login extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state={
            username:"",
            password:""
        }
        this.handleChange=this.handleChange.bind(this);
        this.submit=this.submit.bind(this);

    }
    submit()
    {
        const url="https://eclass-tashkent.herokuapp.com/api/login/";
        var json={
            username:this.state.username,
            password:this.state.password
        }   
        json=JSON.stringify(json);
        
        fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:json
        })
        .then(response=>response.json())
        .then((json)=>{
            
            if(json.superuser)
            {
              this.props.login(json.token);  
            }
        })
        .catch(err=>console.log(err));
        
    }
    handleChange(event)
    {
        if(event.target.placeholder==="username")
        {
            this.setState({username:event.target.value});
        }
        if(event.target.placeholder==="password")
        {
            this.setState({password:event.target.value});
        }
      
    }
    render()
    {
        return(
            <Container>
            <br/>
            <br/>
            <br/>
                <Jumbotron>
                    <h2 className="display-3">Please log in to continue</h2><hr>
                    <Row>
                        <Col>
                            <Form>
                                <Label>Username</Label>
                                <Input onChange={this.handleChange} placeholder="username" type="text"></Input>
                                <Label>Password</Label>
                                <Input onChange={this.handleChange} placeholder="password" type="password"></Input>
                                <br />
                                <Button color="info" onClick={this.submit}>Submit</Button>
                            </Form>
                        </Col>
                        <Col/>
                        <Col/>
                    </Row>
                </Jumbotron>
            </Container>    
        )
    }
}
class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand to="/admin/home" tag={RRNavLink}>eclass</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink to="/admin/student" tag={RRNavLink}>Students</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/admin/teacher" tag={RRNavLink}>Teachers</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/admin/faculty" tag={RRNavLink}>Faculties</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/admin/timetable" tag={RRNavLink}>Timetable</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink color="danger" onClick={this.props.logout}>Logout</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

class Index extends React.Component
{
    render()
    {
        return(<Container>
                <Row>
                <br/>
                <br/>
                <Alert color="light">Control the system</Alert>
                </Row>
            </Container>)
    }
}


//react redux

const mapStateToProps = (state) => {
    return {token: state.lr.token}
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      login: (token) => {
         
        dispatch(login(token))
      },
      logout: () => {
         
        dispatch(logout())
      }
    }
  };
  
const LoginForm = connect(mapStateToProps, mapDispatchToProps)(Login);
const StudentR = connect(mapStateToProps, null)(Student);
const TeacherR = connect(mapStateToProps, null)(Teacher);
const FacultyR = connect(mapStateToProps, null)(Faculty);
const TimetableR = connect(mapStateToProps, null)(Timetable);
const NavigationR = connect(mapStateToProps, mapDispatchToProps)(Navigation);
  
  
        
 