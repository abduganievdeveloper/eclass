import React from 'react';
import {
    Spinner,
    Container,
    Button,
    Table
    , Form
    , Label
    , Input
    ,Jumbotron

} from 'reactstrap';

export class Faculty extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            adding: true,
            faculties: [],
            name: '',
            description: '',
            allgroups: [],
            allsubjects: [],
            groups: [],
            subjects: [],
            course: 1,
            editing: false
        }
        this.fetchFaculties = this.fetchFaculties.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fetchGroups = this.fetchGroups.bind(this);
        this.fetchSubjects = this.fetchSubjects.bind(this);
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
        this.toggle = this.toggle.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }
    fetchFaculties() {
        const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/list/faculty/';
        const token = "Token " + this.props.token;
        this.setState({
            loaded: false
        })
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then((json) => {
                console.log(json);
                this.setState({
                    loaded: true,
                    faculties: json

                });

            })
            .catch(err => console.log(err));
    }
    onChange(e) {
        if (e.target.name === "name") {
            this.setState({
                name: e.target.value
            })
        }
        if (e.target.name === "description") {
            this.setState({
                description: e.target.value
            })
        }
        if (e.target.name === 'subject') {


            var index = this.state.subjects.indexOf(Number(e.target.value));
            var array = this.state.subjects;
            console.log(array);
            if (index === -1) {
                this.setState({
                    subjects: [...this.state.subjects, Number(e.target.value)]
                })
            } else {
                var length = array.length;
                array.splice(index, 1);
                if (array.length !== length) {
                    this.setState({
                        subjects: array
                    })
                }
            }

        }
        if (e.target.name === 'group') {


            index = this.state.groups.indexOf(Number(e.target.value));
            array = this.state.groups;
            console.log(array);
            if (index === -1) {
                this.setState({
                    groups: [...this.state.groups, Number(e.target.value)]
                })
            } else {
                length = array.length;
                array.splice(index, 1);
                if (array.length !== length) {
                    this.setState({
                        groups: array
                    })
                }
            }

        }
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

                        allgroups: json
                    });


                })
                .catch(err => console.log(err));


        }
    }
    edit(e) {
        console.log(e.target.name);
        e.preventDefault();
        var payload = {
            faculty: this.state.name,
            description: this.state.description,
            group: this.state.groups,
            subject: this.state.subjects,
            course: this.state.course
        }
        payload = JSON.stringify(payload);
        console.log(payload);
        const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/update/faculty/' + this.state.pk + '/';
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
               alert("faculty edited");
                this.reset();
                this.fetchFaculties();
                this.toggle();
            })
            .catch(err => console.log(err));
    }
    fetchSubjects() {
        const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/list/subject/';
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
                        allsubjects: json
                    });


                })
                .catch(err => console.log(err));


        }
    }
    componentDidMount() {
        this.fetchFaculties();
        this.fetchGroups();
        this.fetchSubjects();
    }
    submit(e) {
        e.preventDefault();
        var payload = {
            faculty: this.state.name,
            description: this.state.description,
            group: this.state.groups,
            subject: this.state.subjects,
            course: this.state.course
        }
        payload = JSON.stringify(payload);
        console.log(payload);
        const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/create/faculty/';
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
                this.fetchFaculties();
                this.reset();
                alert("faculty added");
            })
            .catch(err => console.log(err));
    }
    toggle(e) {
        this.setState({
            adding: !this.state.adding
        })
        if (e.target.name !== undefined) {

            console.log(e.target.name);
            if (e.target.name !== "top") {
                var st = this.state.faculties.filter(i => i.id == e.target.name);
                console.log(st);
                st = st[0];
                if(st!={})
                {

                
                this.setState({
                    pk: e.target.name,
                    editing: true,
                    name: st.faculty,
                    description: st.description,
                    course: st.course

                })
            }
            }
        }
    }
    reset() {
        var items = document.getElementsByName('subject');
        for (var i = 0; i < items.length; i++) {
            if (items[i].type === 'checkbox')
                items[i].checked = false;
        }
        var groups = document.getElementsByName('group');
        for (i = 0; i < groups.length; i++) {
            if (groups[i].type === 'checkbox')
                groups[i].checked = false;
        }
        if (this.state.course < 4) {
            this.setState({
                course: this.state.course + 1
            })
        }
        else {

            this.setState({
                course: 1
            })
            this.toggle();
        }

    }
    delete(e) {

        const url = 'https://eclass-tashkent.herokuapp.com/api/superuser/delete/faculty/' + e.target.name + '/';
        const token = "Token " + this.props.token;
        console.log("triggered");
        fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                alert("deleted");
                this.fetchFaculties();

            })
            .catch(err => console.log(err));
    }
    render() {
        const subjects = this.state.allsubjects.map((i) => {
            return (
                <div key={i.id}>
                    <Input key={i.id} type="checkbox" name="subject" value={i.id} onClick={this.onChange} /> {i.subject}
                </div>)
        })
        const groups = this.state.allgroups.map((i) => {
            return (
                <div key={i.id}>
                    <Input type="checkbox" name="group" value={i.id} onClick={this.onChange} /> {i.group}
                </div>)
        })


        const faculties =this.state.faculties.map((i) => {

            return (
                <tr key={i.id}>

                    <td>{i.faculty}</td>
                    <td>{i.course + " year of study"}</td>
                    <td>{i.description}</td>
                   
                    <td><Button color="warning" onClick={this.toggle} name={i.id}>EDIT</Button></td>
                    <td><Button color="danger" onClick={this.delete} name={i.id}>DELETE</Button></td>
                </tr>);
        })

        var spinner = !this.state.adding && this.state.loaded;
        return (<Container>
            <h1>Faculties <Button color="primary" name="top" onClick={this.toggle}>{!this.state.adding && <strong>ADD Faculty</strong>}{this.state.adding && <strong>List Faculties</strong>}</Button></h1><hr />
            {!this.state.loaded && <div>
                <Spinner type="grow" color="primary" />
                <Spinner type="grow" color="success" />
                <Spinner type="grow" color="danger" />
            </div>}
            {spinner && <Table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>year of study</th>
                        <th>description</th>
                        <th>edit</th>
                        <th>delete</th>
                    </tr>

                    {faculties}
                </tbody>
            </Table>}
            {this.state.adding &&<Jumbotron>
                <Form>
                    <h3>New Faculty</h3>
                    <Label>Name:</Label> {this.state.name}
                    <Input type="text" name="name" onChange={this.onChange} value={this.state.name}></Input>
                    <Label>Description: </Label>{this.state.description}
                    <Input type="text" name="description" onChange={this.onChange} value={this.state.description}></Input>
                    <h4>Year {this.state.course}</h4><hr />
                    <h5>Groups:</h5><hr/>
                    {groups}
                    <h5>Subjects</h5><hr/>
                    {subjects}
                    {!this.state.editing && <Button onClick={this.submit}>Submit</Button>}
                    {this.state.editing && <Button color="warning" onClick={this.edit}>EDIT</Button>}
                </Form></Jumbotron>
            }

        </Container>)
    }
}
export default Faculty;