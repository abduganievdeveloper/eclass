import React from 'react';
import './admin.css';
import {
  Spinner
  , Row
  , Container
  , Button
  , ListGroup
  , ListGroupItem
  , Col
  , Modal
  , ModalFooter
  , ModalHeader
  , ModalBody
  , Input
  , Label
  , Form
  , FormGroup
  , Table
} from 'reactstrap';
import { store } from './store.js';
import { agChange } from './store.js';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';

export class Student extends React.Component {


  render() {
    return (<Row>
      <Col md="4">
        <Provider store={store}>
          <GroupsR />
        </Provider>

      </Col>
      <Col md="8">
        <Provider store={store}>
          <StudentsR />
        </Provider>
      </Col>

    </Row>);
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
    this.editGroup = this.editGroup.bind(this);
    this.agChange = this.agChange.bind(this);
    this.delete=this.delete.bind(this);
  }
  fetchGroups() {

    const url = "https://eclass-tashkent.herokuapp.com/api/superuser/list/group/";
    const token = "Token " + this.props.token;

    if (token !== "" && token !== undefined) {


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
            loaded: true,
            groups: json
          });


        })
        .catch(err => console.log(err));


    }
  }
  componentDidMount() {
    this.fetchGroups();
  }
  addGroup() {
    const groupname = prompt("Write the group name", "");
    var payload = {
      group: groupname
    }
    payload = JSON.stringify(payload);

    const url = "https://eclass-tashkent.herokuapp.com/api/superuser/create/group/";
    const token = "Token " + this.props.token;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: payload
    })
      .then(response => response.json())
      .then((json) => {
        console.log(json);
        this.fetchGroups();
      })
      .catch(err => console.log(err));
  }
  editGroup(e) {
    const newName = prompt("Edit this group", "");
    var payload = {
      group: newName
    }
    payload = JSON.stringify(payload);
    var id=e.target.name;
    var group=e.target.value;
    const url = "https://eclass-tashkent.herokuapp.com/api/superuser/update/group/" + e.target.name + "/";
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
        this.fetchGroups();
        this.props.agChange(id, group);
    
        alert("edited");
      })
      .catch(err => console.log(err));
  }
  agChange(e) {
    this.props.agChange(e.target.name, e.target.value);

  }
  delete(e)
  {
    
      
      const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/delete/group/'+e.target.name+'/';
      const token = "Token " + this.props.token;
  
      fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          this.fetchGroups();
          alert("deleted");
          this.props.agChange(-1, '')
        })
        .catch(err => console.log(err));
    
  }
  render() {
    const grouplist = this.state.groups.map((i, ind) => {
      return (<ListGroupItem key={i.id}>
        <Button onClick={this.editGroup} name={i.id} value={i.group} color="warning">Edit</Button>
        <Button onClick={this.delete}  name={i.id} value={i.group} color="danger">Delete</Button>
      
        <Button color="default" name={i.id} value={i.group} onClick={this.agChange}>
          {i.group}
        
        </Button>
        </ListGroupItem>);
    })

    const groups = <Container className="paddingMax">
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

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.fetchStudents = this.fetchStudents.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
    this.editStudent = this.editStudent.bind(this);
    this.state = {
      loading: true,
      firstname: '',
      lastname: '',
      fathersname: '',
      email: '',
      address: '',
      phone: '',
      date: '',
      students: [],
      pk:'',
      editing:false,
      acStudent:''
    }
  }
  fetchStudents(e) {
    var ag;
    if (e !== undefined) {
      ag = e;
    }
    else {
      ag = this.props.ag;
    }
    if (ag !== undefined) {
      this.setState({
        loading: true
      })
      const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/filter/group/?id=' + ag;
      const token = "Token " + this.props.token;

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(js => {
          this.setState({
            loading: false,
            students: js
          });
        })
        .catch(err => console.log(err));
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((this.props.ag !== nextProps.ag &&nextProps.ag!==-1)||this.props.agname!==nextProps.agname) {
      this.fetchStudents(nextProps.ag);
    }
  }
  componentDidMount() {
    if (this.props.ag !== -1) {
      this.fetchStudents();
    }
  }

  submit() {
    this.toggle();
   

    
    var payload = {
      first_name: this.state.firstname,
      last_name: this.state.lastname,
      user_father_name: this.state.fathersname,
      user_birth_date: this.state.date,
      phone: this.state.phone,
      address: this.state.address,
      group: this.props.ag,
      email: this.state.email,
      password: this.state.date

    }

    payload = JSON.stringify(payload);

    const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/create/student/';
    const token = "Token " + this.props.token;

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: payload
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json);
        this.fetchStudents();
      })
      .catch(err => console.log(err));
     
  }
  toggle(e) {
    this.setState({
      modal: !this.state.modal
    });
   if(e!==undefined)
   {

    console.log(e.target.name);
    if(e.target.value==="editing")
    {
      console.log("editing");
      console.log(this.state.students);
      console.log(e.target.name);
      var st=this.state.students.filter(i=>i.pk==e.target.name);
      console.log(st);
      if(st[0]!==undefined)
      {

      
      console.log(st);
      st=st[0];
      this.setState({
        pk:e.target.name,
        editing:true,
        acStudent:e.target.value,
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
  }
  }
  onChange(e) {
    if (e.target.name === "firstname") {
      this.setState({ firstname: e.target.value })
    }
    if (e.target.name === "lastname") {
      this.setState({ lastname: e.target.value })
    }
    if (e.target.name === "fathersname") {
      this.setState({ fathersname: e.target.value })
    }
    if (e.target.name === "phone") {
      this.setState({ phone: e.target.value })
    }
    if (e.target.name === "email") {
      this.setState({ email: e.target.value })
    }
    if (e.target.name === "address") {
      this.setState({ address: e.target.value })
    }
    if (e.target.name === "birthday") {

      this.setState({ date: e.target.value })
    }
  }
  editStudent(e)
  {
    this.toggle();
    var payload = {
      first_name: this.state.firstname,
      last_name: this.state.lastname,
      user_father_name: this.state.fathersname,
      user_birth_date: this.state.date,
      phone: this.state.phone,
      address: this.state.address,
      group: this.props.ag,
      email: this.state.email,
      password: this.state.date
    }

    payload = JSON.stringify(payload);

    const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/update/student/'+this.state.pk+'/';
    const token = "Token " + this.props.token;

    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: payload
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json);
        this.setState({
          editing: false
        })
        this.fetchStudents();
      })
      .catch(err => console.log(err));
  }
  delete(e)
  {
    
    const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/delete/student/'+e.target.name+'/';
    const token = "Token " + this.props.token;

    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        this.fetchStudents();
      })
      .catch(err => console.log(err));
  }
  render() {
    const students = this.state.students.map((i, ind) => {
      return (<tr key={i.pk}>
        <th scope="row">{ind + 1}</th>
        <td>{i.first_name + " " + i.last_name}</td>
        <td>{i.phone}</td>
        <td>{i.user_id.username}</td>
        <td><Button onClick={this.toggle} value="editing" color="warning" name={i.pk}>EDIT</Button></td>
        <td><Button color="danger" onClick={this.delete} name={i.pk}>DELETE</Button></td>
      </tr>)
    })
   
    return (
      <div>
        <span>
        <h3>{this.props.agname}  {this.props.ag!==-1 && <Button color="success" onClick={this.toggle} name="adding">ADD STUDENT</Button>}</h3>
        </span><hr/>
        {this.props.ag===-1&&<span>
        <h3>Please choose group first</h3>
        </span>}
        
        <hr />
        {this.state.loading && <div>
          <Spinner type="grow" color="primary" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="danger" />
        </div>}
        {!this.state.loading && <Table dark>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Username</th>
              <th>EDIT</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {students}
          </tbody>
        </Table>
        }
        <div>

          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            {!this.state.editing&&<ModalHeader toggle={this.toggle}>{this.props.ag} ADD STUDENT to {this.props.agname}</ModalHeader>}
            {this.state.editing&&<ModalHeader toggle={this.toggle}>EDITING {this.state.acStudent} {this.props.agname}</ModalHeader>}
            
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label>firstname:</Label>{this.state.firstname}
                  <Input type="text" name="firstname" placeholder="firstname" value={this.state.firstname} onChange={this.onChange} />
                  <Label>lastname</Label>{this.state.lastname}
                  <Input type="text" name="lastname" placeholder="lastname" value={this.state.lastname} onChange={this.onChange} />
                  <Label>fathersname</Label>{this.state.fathersname}
                  <Input type="text" name="fathersname" placeholder="fathersname" value={this.state.fathersname} onChange={this.onChange} />
                  <Label>address</Label>{this.state.address}
                  <Input type="text" name="address" placeholder="address" value={this.state.address} onChange={this.onChange} />
                  <Label>email</Label>{this.state.email}
                  <Input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.onChange} />
                  <Label>phone</Label>{this.state.phone}
                  <Input type="text" name="phone" placeholder="phone" value={this.state.phone} onChange={this.onChange} />
                  <Label>birth day</Label>{this.state.date}
                  <Input type="date" name="birthday" placeholder="birthday" onChange={this.onChange} />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              {!this.state.editing&&<Button color="primary" onClick={this.submit}>SUBMIT</Button>}
              {this.state.editing&&<Button color="warning" onClick={this.editStudent}>EDIT</Button>}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

//react-redux
const mapStateToProps = (state) => {
  return {
    token: state.lr.token,
    ag: state.agr.ag,
    agname: state.agr.agname
  }
};
const mapDispatchToProps = (dispatch) => {

  return {
    agChange: (ag, agname) => {
      dispatch(agChange(ag, agname))
    }
  }
};


const GroupsR = connect(mapStateToProps, mapDispatchToProps)(Groups);
const StudentsR = connect(mapStateToProps, null)(StudentList);
