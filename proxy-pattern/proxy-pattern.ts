type Person = {
  name: string;
  age: number;
  nationality: string;
};

const person: Person = {
  name: "John Doe",
  age: 42,
  nationality: "American",
};

const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    console.log(`the value of ${String(prop)} is ${obj[prop]}`);
  },
  set: (obj, prop, value) => {
    console.log(`Changed ${String(prop)} from ${obj[prop]} to ${value}`);
    obj[prop] = value;
    return true;
  },
});

//////

const personProxy2 = new Proxy(person, {
  get: (obj, prop) => {
    if (!obj[prop]) {
      console.log(`Hmm.. this property doesn't seem to exist`);
    } else {
      console.log(`The value of ${String(prop)} is ${obj[prop]}`);
    }
  },
  set: (obj, prop, value) => {
    if (prop === "age" && typeof value !== "number") {
      console.log(`Sorry, you can only pass numeric values for age.`);
    } else if (prop === "name" && value.length < 2) {
      console.log(`You need to provide a valid name.`);
    } else {
      console.log(`Changed ${String(prop)} from ${obj[prop]} to ${value}.`);
      obj[prop] = value;
    }
    return true;
  },
});

personProxy2.age = 44;
personProxy2.name = "";

//////

const personProxy3 = new Proxy(person, {
  get: (obj, prop) => {
    console.log(`The value of ${String(prop)} is ${Reflect.get(obj, prop)}`);
  },
  set: (obj, prop, value) => {
    console.log(`Changed ${String(prop)} from ${obj[prop]} to ${value}`);
    return Reflect.set(obj, prop, value);
  },
});

personProxy3.name;
personProxy3.age = 43;
personProxy3.name = "Jane Doe";
