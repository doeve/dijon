import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

const App = function() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [time, setTime] = useState(null);
  const [names, setNames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNames()
  }, []);

  const changeHeight = (event) => {
    setHeight(event.target.value);
  }
  
  const changeWidth = (event) => {
    setWidth(event.target.value);
  }
  
  const changeName = (event) => {
    setName(event.target.value);
  }

  const getNames = async () => {
    const url = 'http://localhost:8000/image-names';
    try {
      const response = await fetch(url);
      const data = await response.json();
      setNames(data.names);
    } catch (error) {
      console.error(error.message);
    }
  }

  const getImage = async () => {
    if (!name || !width || !height) {
      setError('Please fill in all fields');
      return;
    }
    const url = `http://localhost:8000/images/${name}?size=${width}x${height}`;
    try {
      const start = Date.now();
      const response = await fetch(url);
      setTime(Date.now() - start);
      if (!response.ok) {
        setError(await response.text());
        setImage(null);
      } else {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setError(null);
        setImage(imageUrl);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className='container'>
      <header className='header'>
        <div>
          <h1>Dijon</h1>
          <small>because mustard</small>  
        </div>
        <div className='files'>
          <h4>Files</h4>
          <div className='fileNames'>{names.join(', ')}</div>
        </div>
      </header>
      <hr/>
      <div className='interface'>
        <div className='gridButtonContainer'>
          <button className='showGrid'>grid</button>
          <div className='gridContainer'>
            <div className='grid'>
              <img className='img1' src='images/1.jpg'></img>
              <img className='img2' src='images/2.jpg'></img>
              <img className='img3' src='images/3.jpg'></img>
              <img className='img4' src='images/4.jpg'></img>
              <img className='img5' src='images/5.jpg'></img>
              <img className='img6' src='images/6.jpg'></img>
            </div>
          </div>
        </div>
        <div className='form'>
          <div className='inputFields'>
            <input type="text" id="name" placeholder="Name" onChange={changeName}></input>
            <input type="number" id="width" placeholder="Width" onChange={changeWidth}></input>
            <input type="number" id="height" placeholder="Height" onChange={changeHeight}></input>
          </div>
          <button className='getImage' onClick={getImage}>get image</button>
        </div>
        <button className='showGrid' disabled>time: {!!time? time : 'N/A'}</button>
      </div>
      {!!error &&
      <div className='errorContainer'>
        <p>{error}</p>
      </div>}
      {image && <div className='imgContainer'>
        <img src={image} alt="image"></img>
      </div>}
    </div>
  );
}

export default App;


