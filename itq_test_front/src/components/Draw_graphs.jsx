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
      data1 : null,
      data2 : null,
      start_date1 : "2020-01-13",
      end_date1 : "2020-01-14",
      city_name1 : "Moscow",
      start_date2 : "2020-01-13",
      end_date2 : "2020-01-14",
      city_name2 : "Paris",
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
  //функция проверки на ошибки со стороны бэка
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
  //запрос в случае обращения к внешнему источнику
  PutState(event,type_data) {

    if (type_data === 'data1')
    {
      var my_city = this.state.city_name1;
      var my_start_date = this.state.start_date1;
      var my_end_date = this.state.end_date1;
    }
      else
    {
      var my_city = this.state.city_name2;
      var my_start_date = this.state.start_date2;
      var my_end_date = this.state.end_date2;
    }


    axios.get(base_url+'/data/upload',{
      params: {
        city : my_city,
        start_date : my_start_date,
        end_date : my_end_date
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
          [type_data]: response.data
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
//запрос в случае обращения в базу
UpdateState(event,type_data) {

  if (type_data === 'data1')
  {
    var my_city = this.state.city_name1;
    var my_start_date = this.state.start_date1;
    var my_end_date = this.state.end_date1;
  }
    else
  {
    var my_city = this.state.city_name2;
    var my_start_date = this.state.start_date2;
    var my_end_date = this.state.end_date2;
  }


  axios.get(base_url+'/data/get',{
    params: {
      city : my_city,
      start_date : my_start_date,
      end_date : my_end_date
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
        [type_data]: response.data
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
//callback при нажатии на кнопку
handleClick(event) {
  const name = event.target.name;


  event.preventDefault();

  if (name === "get")
  {
    this.UpdateState(event,'data1')
    this.UpdateState(event,'data2')
  }


  if (name === "upload")
  {
    this.PutState(event,'data1')
    this.PutState(event,'data2')
  }


}
//////////////////////////////////////
//callback при изменении поля
onChange(e) {
  const name = e.target.name;
  const value = e.target.value;

  this.setState({
    [name]: value
  })

}

//////////////////////
//метод жизненного цикла компонента
//вызывается сразу после монтирования компонента в DOM
componentDidMount(event) {

  this.UpdateState(event,'data1')
  this.UpdateState(event,'data2')

}

/////////////////////
//функция рисования графика
getOption(type_data) {

  var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  let title = "",type_unit = "";
  if (type_data === "temp")
  {
    title = "Температура"
    type_unit ="[°C]"
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
  if (this.state.data1 !== null && this.state.data2 !== null)
  {

    let option = {
      legend: {},
      elements: {
        point: {
          display: true
        }
      },
      title: {text:type_unit},
      tooltip: {
        trigger: 'axis'
        },
      xAxis: {
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false
        },
        axisLabel : {
          formatter: function (value, index) {
            // Formatted to be month/day; display year only in the first label
            let myDate = new Date(value);
            let fullDate = myDate.getDate() + " " + months[myDate.getMonth()] + " " + myDate.getFullYear() + " " + myDate.getHours() +":"+myDate.getMinutes()+":"+myDate.getSeconds() ;
            return fullDate;
          }
        },
        axisPointer: {
          label: {
            formatter: function (date) {
              let myDate = new Date(date.value);
              let fullDate = myDate.getDate() + " " + months[myDate.getMonth()] + " " + myDate.getFullYear() + " " + myDate.getHours() +":"+myDate.getMinutes()+":"+myDate.getSeconds() ;
              return fullDate;
            }
          }
        },
        data: this.state.data1['data'].map((item) => (item.dt))
      },
      yAxis: {},
      series: [
        {
          data: this.state.data1['data'].map(function (item) {
            return item[type_data];
          }),
          name: this.state.data1['data'][0]['city_name'] +" (1)",
          type: 'line',
          smooth: 0.5  //включаем сглаживание
        },
        {
          data: this.state.data2['data'].map(function (item) {
            return item[type_data];
          }),
          name: this.state.data2['data'][0]['city_name']+" (2)",
          type: 'line',
          smooth: 0.5  //включаем сглаживание
        }
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
//функция отрисовки титульной надписи
renderTitle(data) {
  if (this.state.data1 !== null && this.state.data2 !== null)
  {
    return( <p><b>Выбранные города - {this.state.data1['data'][0]['city_name']} ({this.state.data1['data'][0]['country_code']})
                       и {this.state.data2['data'][0]['city_name']} ({this.state.data2['data'][0]['country_code']})</b></p> );
  }
  else {
    return(<p></p>);
  }

}

/////////////////////

//функция рендера
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
          <hr></hr>
          <p className={cs.page__title_form_one_data_wrapper}><b>Первый набор данных:</b></p>
          <Form>
            <Form.Row>
              <Form.Group  as={Col} controlId="formHorizontal1">
                <div className={cs.row_three_item}>
                  <Form.Label bsPrefix={cs.title_field}><b>Начальная дата:</b></Form.Label>
                  <Form.Control name="start_date1" defaultValue="2020-01-13" type="date" required="required"  onChange={this.onChange} />
                </div>
              </Form.Group>

              <Form.Group as={Col} controlId="formHorizontal2">
                <div className={cs.row_three_item}>
                  <Form.Label bsPrefix={cs.title_field}><b>Конечная дата:</b></Form.Label>
                  <Form.Control name="end_date1" defaultValue="2020-01-14" type="date" required="required" onChange={this.onChange} />
                </div>
              </Form.Group>

              <Form.Group as={Col} controlId="formHorizontal2">
                <div className={cs.row_three_item}>
                  <Form.Label bsPrefix={cs.title_field}><b>Название города (на английском):</b></Form.Label>
                  <Form.Control name="city_name1" defaultValue="Moscow" type="text" required="required" onChange={this.onChange} />
                </div>
              </Form.Group>
            </Form.Row>
            <p className={cs.page__title_form_one_data_wrapper}><b>Второй набор данных:</b></p>
            <Form.Row>
              <Form.Group  as={Col} controlId="formHorizontal1">
                <div className={cs.row_three_item}>
                  <Form.Label bsPrefix={cs.title_field}><b>Начальная дата:</b></Form.Label>
                  <Form.Control name="start_date2" defaultValue="2020-01-13" type="date" required="required"  onChange={this.onChange} />
                </div>
              </Form.Group>

              <Form.Group as={Col} controlId="formHorizontal2">
                <div className={cs.row_three_item}>
                  <Form.Label bsPrefix={cs.title_field}><b>Конечная дата:</b></Form.Label>
                  <Form.Control name="end_date2" defaultValue="2020-01-14" type="date" required="required" onChange={this.onChange} />
                </div>
              </Form.Group>

              <Form.Group as={Col} controlId="formHorizontal2">
                <div className={cs.row_three_item}>
                  <Form.Label bsPrefix={cs.title_field}><b>Название города (на английском):</b></Form.Label>
                  <Form.Control name="city_name2" defaultValue="Paris" type="text" required="required" onChange={this.onChange} />
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
