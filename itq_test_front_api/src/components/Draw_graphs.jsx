import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import cs from './Draw_graphs.module.css';
import fconfig from "../fconfig.json";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactEcharts from 'echarts-for-react';

var base_url = JSON.stringify(fconfig["api"]["root"]).replace(/['"]+/g, '')


class DrawGraphs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      isFetching: true,
      error: null,
      data : null,
      start_date : "2020-01-10",
      end_date : "2020-01-14",
      city_name : "Moscow",
      style : {
        height_graph : "400px"
      }
    }

    this.onChange = this.onChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.UpdateState = this.UpdateState.bind(this);
    this.PutState = this.PutState.bind(this);
    this.getOption = this.getOption.bind(this);
  }

  ///////////////////////
  PutState(event) {

    axios.get(base_url+'/RR/api/v1.0/data/upload',{
      params: {
        city : this.state.city_name,
        start_date : this.state.start_date,
        end_date : this.state.end_date
      },
      headers: {
        // Перечисляем разрешённые методы
        "Access-Control-Allow-Methods": "GET"
      }
    })
    .then(
      (response) => {

        if ('error' in response.data)
        throw new Error(response.data['error']);

        console.log(response) // выводим в консоль получаемые обьекты
        this.setState({
          data: response.data
        });
      }
    )
    .catch(e => console.log(e));

  }

  ///////////////////////
  UpdateState(event) {

    axios.get(base_url+'/RR/api/v1.0/data/get',{
      params: {
        city : this.state.city_name,
        start_date : this.state.start_date,
        end_date : this.state.end_date
      },
      headers: {
        // Перечисляем разрешённые методы
        "Access-Control-Allow-Methods": "GET"
      }
    })
    .then(
      (response) => {

        if ('error' in response.data)
        throw new Error(response.data['error']);

        console.log(response) // выводим в консоль получаемые обьекты
        this.setState({
          data: response.data
        });
      }
    )
    .catch(e => console.log(e));

  }
  /////////////////////////////////////

  handleClick(event) {
    const name = event.target.name;

    if (name === "get")
    this.UpdateState(event)

    if (name === "upload")
    this.PutState(event)

  }
  //////////////////////////////////////
  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    })

  }

  //////////////////////
  componentDidMount(event) {

    this.UpdateState(event)

  }
  /////////////////////
  //функция рисования графика
  getOption(type_data) {

    let title = "";
    if (type_data === "temp")
          title = "Температура"

    if (type_data === "pres")
          title = "Давление"

    if (type_data === "rh")
          title = "влажность"

    //ждем пока данные полностью загрузятся и тогда отрисовываем график
    if (this.state.data !== null)
    {

      let option = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['date',type_data],
          source: this.state.data['data'].map(
            (item) => (
              {
                date: new Date(item.dt),
                [type_data]: item[type_data]
              }
            )
          )
        },
        xAxis: {type: 'time'},
        yAxis: {},
        series: [
          {
            name: title,
            type: 'line'
          },
        ]
      };
      return option;
    }
    else
    {
      let option = {};
      return option;
    }

  }
  ////////////////////
  renderTitle(data) {
    if (this.state.data !== null)
    {
      return( <p><b>Выбранный город - {this.state.data['data'][0]['city_name']} ({this.state.data['data'][0]['country_code']})</b></p> );
    }
    else {
        return(<p></p>);
    }

  }


  render() {
    let {style,data} = this.state
    return (
      <div>
        <div className={cs.page__wrapper}>
          <div className={cs.page__form_data_wrapper}>
            <Form>
              <Form.Row>
                <Form.Group  as={Col} controlId="formHorizontal1">
                  <div className={cs.row_three_item}>
                    <Form.Label bsPrefix={cs.title_field}><b>Начальная дата:</b></Form.Label>
                    <Form.Control name="start_date" type="date" required="required"  onChange={this.onChange} />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formHorizontal2">
                  <div className={cs.row_three_item}>
                    <Form.Label bsPrefix={cs.title_field}><b>Конечная дата:</b></Form.Label>
                    <Form.Control name="end_date" type="date" required="required" onChange={this.onChange} />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formHorizontal2">
                  <div className={cs.row_three_item}>
                    <Form.Label bsPrefix={cs.title_field}><b>Название города:</b></Form.Label>
                    <Form.Control name="city_name" type="text" required="required" onChange={this.onChange} />
                  </div>
                </Form.Group>
              </Form.Row>

              <Row>
                <Col>
                  <div className={cs.aligin_bottom} >
                    <Button type="submit" name="upload" className={cs.button_upload}  onClick={this.handleClick}>
                      Загрузить данные
                    </Button>
                  </div>
                </Col>
                <Col>
                  <div className={cs.aligin_bottom} >
                    <Button type="submit" name="get" className={cs.button_upload}  onClick={this.handleClick}>
                      Обновить данные
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          <hr></hr>
          <div className={cs.page__title_wrapper}>
                {this.renderTitle(data)}
          </div>
          <div className={cs.page__graph_data_wrapper}>
            <Row>
              <Col>
                <ReactEcharts ref='echartsInstance'
                  style={{ height: style.height_graph}}
                  option={this.getOption('temp')} />
              </Col>
              <Col>
                <ReactEcharts ref='echartsInstance'
                  style={{ height: style.height_graph}}
                  option={this.getOption('pres')} />
              </Col>
              <Col>
                <ReactEcharts ref='echartsInstance'
                  style={{ height: style.height_graph}}
                  option={this.getOption('rh')} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }

}


export default DrawGraphs;
