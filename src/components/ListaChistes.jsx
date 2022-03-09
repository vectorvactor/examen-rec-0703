import React from 'react';
import { Accordion, Form, Container, Row, Col, Button } from 'react-bootstrap';
import uuid from 'react-uuid';

class ListaChistes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jokes: [], languages: [] };
    this.selectedLang = React.createRef();
  }

  async componentDidMount() {
    const response = await fetch(
      'https://v2.jokeapi.dev/joke/Any?lang=es&type=twopart&amount=3'
    );
    const data = await response.json();
    this.setState({ jokes: data.jokes });

    const responseLang = await fetch('https://v2.jokeapi.dev/languages');
    const dataLang = await responseLang.json();
    const langCodeList = [];

    for (let item in dataLang.jokeLanguages) {
      for (let item2 in dataLang.possibleLanguages) {
        if (
          dataLang.possibleLanguages[item2].code ===
          dataLang.jokeLanguages[item]
        ) {
          langCodeList.push(dataLang.possibleLanguages[item2]);
          console.log('Elemento metido:' + dataLang.possibleLanguages[item2]);
          break;
        }
      }
    }

    this.setState({ languages: langCodeList });
  }

  async cambiarIdioma() {
    const response = await fetch(
      'https://v2.jokeapi.dev/joke/Any?lang=' +
        this.selectedLang.current.value +
        '&type=twopart&amount=3'
    );
    const data = await response.json();
    this.setState({ jokes: data.jokes });
  }

  render() {
    return (
      <>
        <h3>Lista de chistes</h3>
        <ul>
          {this.state.jokes.map((item) => {
            return (
              <li>
                {item.setup} - {item.delivery}
              </li>
            );
          })}
        </ul>
        <Container>
          <Row>
            <Col>
              <Accordion>
                {this.state.jokes.map((item) => {
                  return (
                    <Accordion.Item eventKey={uuid()}>
                      <Accordion.Header>{item.setup}</Accordion.Header>
                      <Accordion.Body>{item.delivery}</Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </Col>
            <Col>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Selecciona el idioma</Form.Label>
                  <Form.Select ref={this.selectedLang}>
                    {this.state.languages.map((item) => {
                      return <option value={item.code}>{item.name}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="primary"
                  type="button"
                  onClick={this.cambiarIdioma.bind(this)}
                >
                  Cambiar idioma
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ListaChistes;
