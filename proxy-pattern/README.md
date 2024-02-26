# Proxy Pattern

프록시 객체를 사용하면 특정 객체와의 상호 작용을 더 잘 제어할 수 있습니다.
프록시 객체는 우리가 객체와 상호 작용할 때, 예를 들어 값을 가져오거나 설정할 때의 동작을 결정할 수 있습니다.

일반적으로, 프록시는 다른 사람을 대신하는 것을 의미합니다. 직접 그 사람과 대화하는 대신, 대리인인 프록시와 대화하게 됩니다.
자바스크립트에서도 마찬가지입니다. 대상 객체와 직접 상호 작용하는 대신, 프록시 객체와 상호 작용 합니다.

---

```tsx
const person = {
  name: "John Doe",
  age: 42,
  nationality: "American",
};

const personProxy = new Proxy(person, {});
```

객체와 직접 상호 작용하는 대신, 프록시 객체와 상호 작용하고 싶습니다.
이렇게 자바스크립트에서는 Proxy의 새 인스턴스를 생성함으로써 쉽게 새 프록시를 만들 수 있습니다.

Proxy의 두 번째 인자는 핸들러 객체를 나타냅니다.
핸들러 객체에서는 상호 작용 유형에 따라 특정 동작을 정의할 수 있습니다. get과 set이 프록시 핸들러에서 추가할 수 있는 가장 일반적인 두 메서드 입니다.

- get: 속성에 접근할 때 호출됩니다.
- set: 속성을 수정할 때 호출됩니다.

이제 다음과 같은 일이 발생합니다:
대상 객체와 직접 상호 작용하는 대신, personProxy 와 상호작용 합니다.

personProxy 프록시에 핸들러를 추가합니다. 프록시의 set 메서드를 호출하여 속성을 수정하려고 할 때 프록시는 속성의 이전 값과 새 값 모두를 로그해야 합니다.
get 메서드를 호출하여 속성에 접근하려고 할 때 프록시는 속성의 키와 값을 포함하는 더 읽기 쉬운 문장을 로그해야 합니다.

```tsx
type Person = {
  name: string;
  age: number;
  nationality: string;
};

const person: Person = {
  name: "John Doe",
  age: 42,
  nationality: "American",****
};

const personProxy = new Proxy(person, {
  get: (obj, prop: keyof Person) => {
    console.log(`the value of ${prop} is ${obj[prop]}`);
  },
  set: (obj, prop: keyof Person, value) => {
    console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
    obj[prop] = value;

    return true;
  },
});
```

속성에 접근할 때, 프록시는 더 좋게 들리는 문장을 반환했습니다: The value of name is John Doe.

속성을 수정할 때, 프록시는 이 속성의 이전 값과 새 값 모두를 반환했습니다: Changed age from 42 to 43.

프록시는 유효성 검사에 유용하게 사용될 수 있습니다. 사용자가 사람의 나이를 문자열 값으로 변경하거나, 빈 이름을 주거나, 객체에 존재하지 않는 속성에 접근하려고 할 때, 사용자에게 알려야 합니다.

```tsx
const personProxy = new Proxy(person, {
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
```

프록시는 우리가 잘못된 값으로 사람 객체를 수정하지 못하게 함으로써, 데이터를 순수하게 유지하는 데 도움을 줍니다!

## Reflect

자바스크립트는 프록시를 사용할 때 대상 객체를 조작하기 쉽게 해주는 내장 객체인 Reflect 를 제공합니다.

이전에는 프록시 내에서 대상 객체의 속성을 직접 get하거나 set하는 방식으로 속성을 접근했습니다.
이제 우리는 Reflect 객체를 사용할 수 있습니다. Reflect 객체의 메서드는 핸들러 객체의 메서드와 같은 이름을 가지고 있습니다.

obj[prop]를 통해 속성에 접근하거나 obj[prop] = value를 통해 속성을 설정하는 대신, Reflect.get()과 Reflect.set()을 사용하여 타겟 객체의 속성에 접근하거나 수정할 수 있습니다.

```tsx
const personProxy = new Proxy(person, {
  get: (obj, prop) => {
    console.log(`The value of ${String(prop)} is ${Reflect.get(obj, prop)}`);
  },
  set: (obj, prop, value) => {
    console.log(`Changed ${String(prop)} from ${obj[prop]} to ${value}`);
    return Reflect.set(obj, prop, value);
  },
});
```

완벽합니다! 우리는 Reflect 객체를 이용하여 대상 객체의 속성에 쉽게 접근하고 수정할 수 있습니다.

## Tradeoffs

프록시는 객체의 동작을 제어하는 데 사용될 수 있는 강력한 방법입니다.
프록시는 다음과 같은 다양한 용도로 사용될 수 있습니다.

- 유효성 검사
- 형식 지정
- 알림
- 디버깅

하지만, 프록시 객체를 과도하게 사용하거나 각 핸들러 메서드 호출에 무거운 연산을 수행하면 애플리케이션의 성능에 부정적인 영향을 미칠 수 있습니다.
성능에 민감한 코드에는 프록시를 사용하지 않는 것이 좋습니다.
