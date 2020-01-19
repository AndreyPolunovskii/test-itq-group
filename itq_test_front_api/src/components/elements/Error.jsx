import React from 'react';
import cs from './Error.module.css';

class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: this.props.error
    };
  }

  render () {
    const { error } = this.state;
    if (error != null)
    {
      return (
        <div className={cs.error_wrapper}>
          <h3>
          Sorry.. <br></br>
          {error.message}
         </h3>
        </div>
      );
    }
    else {
      return (
        <div className={cs.error_wrapper}>
          <h3>
           Страница не найдена
         </h3>
        </div>
      );
    }

  }

}

export default Error;
