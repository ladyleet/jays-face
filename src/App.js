import React, { Component } from 'react';
import logo from './logo.svg';
import jaysFace from './jay_the_froot_snack_eater.jpeg';
import frootSnack from './froot_snack.png';
import './App.css';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { mergeMap, tap, map, takeUntil, filter, scan } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {counter: 0}
  }

  mouseDown$ = fromEvent(document, 'mousedown');
  mouseMove$ = fromEvent(document, 'mousemove');
  mouseUp$ = fromEvent(document, 'mouseup');
  increment$ = new Subject();

  eaten$ = this.increment$.pipe(
    // filter(({ clientX, clientY }) => isInJaysMouth(clientX, clientY)),
    scan(count => count + 1, 0)
  );

  targetMouseDown$ = this.mouseDown$.pipe(
    filter((e) => e.target.matches('.froot-snack'))
  );
  
  mouseDrag$ = this.targetMouseDown$.pipe(
    mergeMap(({ target: draggable, offsetX: startX, offsetY: startY }) =>
      this.mouseMove$.pipe(
        tap((mouseMoveEvent) => {
          mouseMoveEvent.preventDefault()
        }),
        map(mouseMoveEvent => ({
          left: mouseMoveEvent.clientX - startX,
          top: mouseMoveEvent.clientY - startY,
          draggable
        })),
        takeUntil(this.mouseUp$.pipe(
          tap(this.increment$)
        ))
      )
    )
  );

  componentDidMount() {
    this.subscription = this.mouseDrag$.subscribe(({ left, top, draggable }) => { draggable.style.top = top + 'px', draggable.style.left = left + 'px' });

    this.eaten$.subscribe(counter => this.setState({counter}));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <img src={jaysFace}/>
        <img src={frootSnack} className="froot-snack" />
        <div>
          You fed Jay _ {this.state.counter} _ froot snacks!
        </div>
      </div>
    );
  }
}

export default App;
