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
      isFetching: true,
      error: null,
      data : null,
      start_date : "2020-01-13",
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
  checkData(response) {

    //если какие то ошибки (надо их выводить на экран)
    if ('error' in response.data)
    {
      let Err = new Error(response.data['error']);
      this.setState({
        error : Err
      })
      throw Err;
    }

    //если пустой датасет
    if (response.data != null)
    if (response.data['data'].length === 0)
    {
      let Err = new Error("нет данных");
      this.setState({
        error: Err
      })
      throw Err;
    }
  }
  ///////////////////////
  PutState(event) {

    axios.get(base_url+'/api/v1.0/data/upload',{
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
        this.checkData(response);
        console.log(response) // выводим в консоль получаемые обьекты
        this.setState({
          data: response.data
        });
      }
    )
    .catch(e => {
      console.log(e)
      this.setState({
        error: e
      });
      alert(this.state.error.message)
    }
  )

}

///////////////////////
UpdateState(event) {

  axios.get(base_url+'/api/v1.0/data/get',{
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
      this.checkData(response);
      console.log(response) // выводим в консоль получаемые обьекты
      this.setState({
        data: response.data
      });
    }
  )
  .catch(e => {
    console.log(e)
    this.setState({
      error: e
    });
    alert(this.state.error.message)
  }
)

}
/////////////////////////////////////

handleClick(event) {
  const name = event.target.name;


  event.preventDefault();

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

  let title = "",type_unit = "";
  if (type_data === "temp")
  {
    title = "Температура"
    type_unit ="[C]"
  }


  if (type_data === "pres")
  {
    title = "Давление"
    type_unit ="[mb]"
  }



  if (type_data === "rh")
  {
    title = "влажность"
    type_unit ="[%]"
  }


  //ждем пока данные полностью загрузятся и тогда отрисовываем график
  if (this.state.data !== null)
  {

    let option = {
      legend: {},
      title: {text:type_unit},
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
          type: 'line',
          smooth: 0.5  //включаем сглаживание
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
  let {style,data} = this.state;
    return (
      <div>
        <div className={cs.page__wrapper}>
          <div className={`${cs.page__title_wrapper} ${cs.page__main_title_wrapper}`}>
            <b>Погодные данные</b>
            <hr></hr>
          </div>
          <div className={cs.page__form_data_wrapper}>
            <p className={cs.page__title_form_data_wrapper}><b>Введите основные параметры:</b></p>
            <Form>
              <Form.Row>
                <Form.Group  as={Col} controlId="formHorizontal1">
                  <div className={cs.row_three_item}>
                    <Form.Label bsPrefix={cs.title_field}><b>Начальная дата:</b></Form.Label>
                    <Form.Control name="start_date" defaultValue="2020-01-13" type="date" required="required"  onChange={this.onChange} />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formHorizontal2">
                  <div className={cs.row_three_item}>
                    <Form.Label bsPrefix={cs.title_field}><b>Конечная дата:</b></Form.Label>
                    <Form.Control name="end_date" defaultValue="2020-01-14" type="date" required="required" onChange={this.onChange} />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formHorizontal2">
                  <div className={cs.row_three_item}>
                    <Form.Label bsPrefix={cs.title_field}><b>Название города (на английском):</b></Form.Label>
                    <Form.Control name="city_name" defaultValue="Moscow" type="text" required="required" onChange={this.onChange} />
                  </div>
                </Form.Group>
              </Form.Row>
              <p><i>Внешний ресурс https://www.weatherbit.io/ ограничивает количество запрашивемых данных с разным интервалом времени до одного раза в сутки.</i>
              <br></br><i>Соотвественно в сутки можно загрузить с внешнего ресурса только один интервал времени для любого города.</i>
              <br></br><i>Максимальное количество запросов к внешнему ресурсу ограничивается до 500 в сутки.</i></p>
              <Row>
                <Col xs={4}>
                    <Button type="submit" variant="warning" name="upload" className={cs.button_upload}  onClick={this.handleClick}>
                      Загрузить данные с внешнего ресурса
                    </Button>
                </Col>
                <Col xs={4}>
                    <Button type="submit" variant="danger" name="get" className={cs.button_upload}  onClick={this.handleClick}>
                      Загрузить данные из локальной базы
                    </Button>
                </Col>
              </Row>
            </Form>
            <hr></hr>
          </div>

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
