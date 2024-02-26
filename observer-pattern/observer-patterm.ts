import React from "react";
import { Button, Switch, FormControlLabel } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";

class Observable {
  observers: ((data: string) => void)[];
  constructor() {
    this.observers = [];
  }

  subscribe(func: (data: string) => void) {
    this.observers.push(func);
  }

  unsubscribe(func: (data: string) => void) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: string) {
    this.observers.forEach((observer) => observer(data));
  }
}

const observable = new Observable();

function handleClick() {
  observable.notify("User clicked button!");
}

function handleToggle() {
  observable.notify("User toggled switch!");
}

function logger(data: string) {
  console.log(`${Date.now()} ${data}`);
}

function toastify(data:string) {
  toast(data, {
    position: toast.POSITION.BOTTOM_RIGHT,
    closeButton: false,
    autoClose: 2000
  });
}


observable.subscribe(logger);
observable.subscribe(toastify);


export default function App(): JSX.Element {

  return (
    <div>
      <Button onClick={handleClick}>Click</Button>
      <FormControlLabel control={<Switch onChange={handleToggle} />} label="Toggle me">
      <ToastContainer />
    </div>
  )
}