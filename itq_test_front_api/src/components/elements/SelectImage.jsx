import React from 'react';
import fconfig from "../../fconfig.json";

class SelectImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        style: props.className,
        imgpath : props.imgpath,
        alt : props.alt,
        test : JSON.stringify(fconfig["test"])
    };
  }

  render() {
    const { style, imgpath, alt, test } = this.state;

    if (imgpath !== null && String(imgpath) !== String("null") && String(imgpath) !== String(""))
    {
      //какой то баг с этими partners
      if (imgpath.split("images/")[1].split("/")[0] !== String("partners"))
      {
      return (
        <div >
          <img className={style} src={(test==='true') ? require("../../images/"+imgpath.split("images/")[1]) : imgpath.replace('http','https') } alt={alt} />
        </div>
      );
    }
    else {
      return (
        <div >
          <img className={style} src={(test==='true') ? require('../../images/'+imgpath.split("images/")[1]) : `/media/${imgpath}` } alt={alt} />
        </div>
      )
    }
  }
    else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default SelectImage;
