# Observer Pattern

옵저버 패턴을 사용하면, 관찰 가능한 특정 객체(옵저버블)를 구독할 수 있습니다.

옵저버블 객체에는 일반적으로 세 가지 중요한 부분이 포함됩니다.

- observers: 특정 이벤트가 발생할 때마다 알림을 받을 옵저버들의 배열
- subscribe(): 옵저버를 옵저버 목록에 추가하기 위한 메소드
- unsubscribe(): 옵저버 목록에서 옵저버를 제거하기 위한 메소드
- notify(): 특정 이벤트가 발생할 때 모든 옵저버들에게 알리기 위한 메소드

옵저버를 만들어 봅니다.

```tsx
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
```

이제 subscribe 메소드로 옵저버 목록에 옵저버를 추가하고, unsubscribe 메소드로 옵저버를 제거하여, notify 메소드로 모든 구독자에게 알릴 수 있습니다.

이 옵저버들로 무언가를 만들어 봅시다. 우리는 버튼과 스위치로 이루어진 기본적인 앱을 가지고 있습니다.

```tsx
export default function App() {
  return (
    <div className="App">
      <Button>Click Me</Button>
      <FormControlLabel control={<Switch/>}>
    </div>
  );
}
```

우리는 사용자가 애플리케이션과 상호 작용하는 것을 추적하고 싶습니다.
사용자가 버튼을 클릭하거나 스위치를 토글할 때마다, 우리는 이 이벤트를 타임스탬프와 함께 로그하고 싶습니다. 로깅하는 것 외에도, 이벤트가 발생할 때마다 나타나는 토스트 알림을 생성하고 싶습니다.

사용자가 handleClick또는 handleToggle 함수를 호출할 때마다, 이 함수들은 옵저버의 notify 메소드를 호출합니다.
notify 메소드는 handleClick 또는 handleToggle 함수에 의해 전달된 데이터로 모든 구독자에게 알립니다!

먼저, logger와 toastify 함수를 만듭니다. 이 함수들은 결국 notify 메소드로부터 데이터를 받게 됩니다.

```tsx
{
  import { ToastContainer, toast } from "react-toastify";

  function logger(data: string) {
    console.log(`${Date.now()} ${data}`);
  }

  function toastify(data: string) {
    toast(data);
  }

  export default function App(): JSX.Element {
    return (
      <div className="App">
        <Button>Click me!</Button>
        <FormControlLabel control={<Switch />} />
        <ToastContainer />
      </div>
    );
  }
}
```

현재, logger와 toastify 함수는 옵저버블을 알지 못합니다. 옵저버블은 아직 알릴 수 없습니다! 이 함수들을 옵저버로 만들기 위해서는 옵저버블에 subscribe 메소드를 사용하여 구독해야 합니다.

```tsx
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import observable from "./Observable";

function handleClick() {
  observable.notify("User clicked button!");
}

function handleToggle() {
  observable.notify("User toggled switch!");
}

function logger(data: string) {
  console.log(`${Date.now()} ${data}`);
}

function toastify(data: string) {
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
```

방금 전체 흐름을 완성했습니다.
handleClick과 handleToggle은 데이터를 가지고 옵저버의 notify 메소드를 호출하고, 그 후에 옵저버는 구독자들에게 알립니다.

이 경우에는 logger와 toastify 함수가 해당됩니다.

사용자가 컴포넌트 중 하나와 상호작용 할 때마다, logger와 toastify 함수는 우리가 notify 메서드에 전달한 데이터로 알림을 받게 됩니다!

```tsx
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
```

옵저버 패턴은 비동기적이고 이벤트 기반의 데이터를 다룰 때 매우 유용할 수 있습니다.
특정 데이터가 다운로드 완료되었을 때, 또는 사용자가 메시지 보드에 새 메시지를 보냈을 때 모든 다른 멤버들이 알림을 받아야 할 때 특정 컴포넌트들이 알림을 받게 할 수 있습니다

---

### 장점

옵저버 패턴을 사용하는 것은
