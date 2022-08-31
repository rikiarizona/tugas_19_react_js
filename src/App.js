import React, { Component } from 'react';
import { Navbar, Container, Form, Row, Col, Button, Card } from 'react-bootstrap';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: '',
        jabatan: '',
        jenis_kelamin: '',
        tanggal_lahir: ''
      }
    }
  }

  inputChange = (e) => {
    let newdataPost = { ...this.state.dataPost };
    if (this.state.edit === false) {
      newdataPost['id'] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;
    this.setState({
      dataPost: newdataPost
    }, () => console.log(this.state.dataPost))
  }

  onSubmitForm = () => {
    if (this.state.edit === false) {
      axios.post(`http://localhost:3004/data-karyawan`, this.state.dataPost).then(() => {
        this.reloadData();
        this.clearData();
      });
    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`,
        this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        })
    }
  }

  getDataId = (e) => {
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`)
      .then(res => {
        this.setState({
          dataPost: res.data,
          edit: true
        })
      })
  }

  reloadData = () => {
    axios.get('http://localhost:3004/data-karyawan').then(
      res => {
        this.setState({
          dataApi: res.data,
          edit: false
        });
      });
  }

  clearData = () => {
    let newdataPost = { ...this.state.dataPost }
    newdataPost['id'] = '';
    newdataPost['nama_karyawan'] = '';
    newdataPost['jabatan'] = '';
    newdataPost['jenis_kelamin'] = '';
    newdataPost['tanggal_lahir'] = '';
    this.setState({
      dataPost: newdataPost
    })
  }

  handleRemove = (e) => {
    console.log(e.target.value)
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, {
      method: 'DELETE'
    }).then(res => this.reloadData());
  }

  componentDidMount() {
    this.reloadData();
  };

  render() {
    return (
      <div>
        <Navbar bg='primary' variant='dark' sticky='top'>
          <Container>
            <Navbar.Brand href='#home'>
              <h1>
                Data Karyawan
              </h1>
            </Navbar.Brand>
            <Form className='d-flex'>
              <Form.Control
                type='search'
                placeholder='Cari Data...'
                className='me-2'
                aria-label='Search'
              />
              <Button variant='outline-dark'>Cari</Button>
            </Form>
          </Container>
        </Navbar>
        <br />
        <Container>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} className='mb-3'>
                <Form.Label>Nama Karyawan</Form.Label>
                <Form.Control
                  type="text"
                  name='nama_karyawan'
                  placeholder="Masukkan Nama Karyawan"
                  value={this.state.dataPost.nama_karyawan}
                  onChange={this.inputChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>Jabatan</Form.Label>
                <Form.Control
                  type="text"
                  name='jabatan'
                  placeholder="Masukkan Jabatan"
                  value={this.state.dataPost.jabatan}
                  onChange={this.inputChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>Jenis Kelamin</Form.Label>
                <Form.Control
                  type="text"
                  name='jenis_kelamin'
                  placeholder="Masukkan Jenis Kelamin"
                  value={this.state.dataPost.jenis_kelamin}
                  onChange={this.inputChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="2">
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control
                  type="date"
                  name='tanggal_lahir'
                  value={this.state.dataPost.tanggal_lahir}
                  onChange={this.inputChange}
                />
              </Form.Group>
            </Row>
            <Button type="submit" onClick={this.onSubmitForm}>Simpan Data</Button>
          </Form>
        </Container>
        <br />

        {this.state.dataApi.map((dat, index) => {
          return (
            <div key={index}>
              <Container>
                <Card
                  bg='info'
                  text='light'
                  style={{ width: '20rem' }}
                  className='mb-3'>
                  <Card.Header className="text-center">{dat.id}</Card.Header>
                  <Card.Body>
                    <Card.Title>Nama : {dat.nama_karyawan}</Card.Title>
                    <Card.Text>
                      <p>Jabatan : {dat.jabatan}</p>
                      <p>Jenis Kelamin : {dat.jenis_kelamin}</p>
                      <p>Tanggal Lahir: {dat.tanggal_lahir}</p>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button variant='outline-danger' value={dat.id} onClick={this.handleRemove}>Hapus</Button>{' '}
                    <Button variant='outline-dark' value={dat.id} onClick={this.getDataId}>Rubah Data</Button>
                  </Card.Footer>
                </Card>
              </Container>
            </div>
          )
        })
        }
      </div >
    )
  }
}

export default App;