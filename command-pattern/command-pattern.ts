{
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
}
