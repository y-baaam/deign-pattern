# Command Pattern

커맨드 패턴을 사용하면, 특정 작업을 실행하는 객체와 메소드를 호출하는 객체를 분리(decouple)할 수 있습니다.

예를 들어, 온라인 음식 배달 플랫폼이 있다고 가정해봅니다.
사용자는 주문하고, 주문을 추적하고, 주문을 취소할 수 있습니다.

```tsx
interface Order {
  id: string;
  orderDetails: string;
}

class OrderManager {
  // Order 타입의 객체를 저장하는 배열
  orders: Order[];

  constructor() {
    this.orders = [];
  }

  // 새 주문을 배열에 추가
  placeOrder(orderDetails: string, id: string): string {
    const newOrder: Order = { id, orderDetails };
    this.orders.push(newOrder);
    return `You have successfully ordered ${orderDetails} (${id})`;
  }

  // 주문 추적
  trackOrder(id: string): string {
    return `Your order ${id} will arrive in 20 minutes.`;
  }

  // 주문 취소
  cancelOrder(id: string): string {
    this.orders = this.orders.filter((order) => order.id !== id);
    return `You have canceled your order ${id}`;
  }
}
```

**OrderManager** 클래스에는 **placeOrder**, **trackOrder**, **cancelOrder** 메소드에 접근할 수 있습니다.

```tsx
const manager = new OrderManager();

manager.placeOrder("Pad Thai", "1234");
manager.trackOrder("1234");
manager.cancelOrder("1234");
```

그러나 인스턴스에서 직접 **manager** 메소드를 호출하는 데는 단점이 있습니다.
나중에 특정 메소드의 이름을 변경하기로 결정하거나 메소드의 기능이 변경될 수 있습니다.

placeOrder라고 부르는 대신 addOrder로 이름을 바꾼다면, 이는 코드베이스 어디에서도 placeOrder 메소드를 호출하지 않도록 해야 한다는 것을 의미하며, 이는 큰 애플리케이션에서 매우 까다로울 수 있습니다. 대신 메소드를 관리자 객체로부터 분리하고 각 명령에 대해 별도의 커맨드 함수를 생성하고 싶습니다.

각 명령은 관리자의 주문에 접근할 수 있어야 합니다. 이것은 첫 번째 인수로 전달됩니다.

```tsx
type Order = {
  id: string;
  orderDetail: string;
};

class OrderManager {
  orders: Order[];

  constructor() {
    this.orders = [];
  }

  execute(command, ...args) {
    return command.execute(this.orders, ...args);
  }
}
```

주문자 관리를 위해 세 가지 커맨드를 생성해야 합니다.

- PlaceOrderCommand
- CancelOrderCommand
- TrackOrderCommand

```tsx
type Order = {
  id: string;
  orderDetail: string;
};

type CommandFunction = (orders: Order[], ...args: any[]) => string;

class Command {
  orders: Order[];
  execute: CommandFunction;

  constructor(execute: CommandFunction) {
    this.execute = execute;
  }
}

function PlaceOrderCommand1(orderDetail: string, id: string) {
  return new Command((orders) => {
    const newOrder: Order = { id, orderDetail };
    orders.push(newOrder);
    return `You have successfully ordered ${orderDetail} (${id})`;
  });
}

function CancelOrderCommand1(id: string) {
  return new Command((orders) => {
    orders = orders.filter((order) => order.id !== id);
    return `You have canceled your order ${id}`;
  });
}

function TrackOrderCommand1(id: string) {
  return new Command(() => `Your order ${id} will arrive in 20 minutes.`);
}
```

완벽합니다. 메소드들이 OrderManager 인스턴스에 직접 결합되어 있는 대신에, 이제 별도의 분리된 execute 메소드를 통해 호출할 수 있는 decoupled 함수들이 되었습니다.

```tsx
type Order = {
  id: string;
  orderDetails: string;
};

class OrderManager {
  orders: Order[];

  constructor() {
    this.orders = [];
  }

  execute(command: Command) {
    return command.execute(this.orders);
  }
}

type CommandFunction = (orders: Order[], ...args: any[]) => string;

class Command {
  execute: CommandFunction;
  constructor(execute: CommandFunction) {
    this.execute = execute;
  }
}

function PlaceOrderCommand(orderDetails: string, id: string): Command {
  return new Command((orders) => {
    const newOrder: Order = { id, orderDetails };
    orders.push(newOrder);
    return `You have successfully ordered ${orderDetails} (${id})`;
  });
}

function CancelOrderCommand(id: string): Command {
  return new Command((orders) => {
    orders = orders.filter((order) => order.id !== id);
    return `You have canceled your order ${id}`;
  });
}

function TrackOrderCommand(id: string): Command {
  return new Command(() => `Your order ${id} will arrive in 20 min`);
}

const manager = new OrderManager();

manager.execute(PlaceOrderCommand("Pad Thai", "1234"));
manager.execute(TrackOrderCommand("1234"));
manager.execute(CancelOrderCommand("1234"));
```

### 장점

커맨드 패턴을 사용하면, 연산을 실행하는 객체로부터 메소드를 분리할 수 있습니다. 특정 수명을 가지고 있거나 특정 시간에 큐에 넣어 실행되어야 하는 커맨드를 다룰 때 더 많은 제어를 할 수 있습니다.

### 단점

커맨드 패턴의 사용 사례는 꽤 제한적입니다.
