# Redux-practice

redux는 크로스 컴포넌트 또는 앱 와이드 상태를 위한 상태 관리 시스템입니다. 

redux는 데이터를 다수의 컴포넌트나 심지어는 앱 전체에서 관리하도록 도와줍니다. 

우리는 상태를 3가지로 구분할 수 있다. 

1. Local State ⇒ 데이터가 변경되어서 하나의 컴포넌트에 속하는 UI에 영향을 미치는 상태
ex) 사용자가 입력을 청취하고 useState를 사용해서 그 입력을 모든 키 입력과 함께  state변수에 저장합니다. 

1. Cross-Component State ⇒ 다수의 컴포넌트에 영향을 미치는 상태
ex) 모달 오버레이를 열거나 닫는 버튼이 있다면, 그런 모달 컴포넌트는 다수의 컴포넌트에 영향을 미칠 수 있다. 

1. App Wide State ⇒ 단지 다수의 컴포넌트가 아니라 애플리케이션의 모든 컴포넌트에 영향을 미치는 상태 
ex) 사용자 인증

Cross-Component State 와 App Wide State에서 데이터를 넣고 전체 props 함수를 업데이트하는 것은 번거로울 수 있어서 ‘**리액트 컨텍스트**’를 사용했었다. 
리덕스 역시 같은 문제를 해결해준다. 

**리액트 컨텍스트와 리덕스의 차이점은…**

1. 복잡성

리액트 컨텍스트는 잠재적인 단점은 상태관리가 상당히 복잡해질 수 있다. 

그 복잡성은 우리가 구축하는 애플리케이션의 종류에 따라 달라질 것이다. 

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a8b0f7a1-c3c3-41e5-9b3d-18c767c8e9b3/Untitled.png)

대형 애플리케이션을 구축할때 리액트 컨텍스트를 사용한다면 위와 같은 아주 많은 ContextProvider가 중첩될 수 있다. 

1. 성능

테마를 변경하거나 인증 같은 저빈도의 업데이트에는 좋지만, 데이터가 자주 변경되는 경우에는 좋지않습니다. 

그에 반해…

리덕스는 유동적인 상태 관리 라이브러리 입니다.

---

## 리덕스의 작동방식

: 리덕스는 애플리케이션에 있는 하나의 중앙 데이터 저장소입니다. 절대 2개 이상은 갖지않습니다. 

여기서 데이터는 상태를 가리킵니다. 

그 저장소에 인증상태, 테마, 입력상태 등 무엇이든 저장할 것이다. 

그러면 관리가 어려울 것 같지만, 그 저장소 전체를 항상 직접 관리할 필요가 없다. 

 

이 저장된 데이터를 어떻게 변경할까..???

⇒ 절대로 저장된 데이터를 직접 조작하지 않는다. 

    그 대신에 우리는 **reducer**라는 개념을 이용합니다. 

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd519c45-2d9b-4422-99db-e65c32969fa3/Untitled.png)

예를 들어, 어떤 컴포넌트의 버튼을 클릭하면 그게 데이터 변경을 트리거합니다.

그러면 컴포넌트는 action을 발송합니다. 리덕스는 그 액션을 reducer로 전달하고 원하는 작업을 수행합니다. 그러고나서, reducer는 새로운 상태를 뱉어내고 그게 실제로 그 중앙 데이터 저장소의 기존 상태를 대체하게 될 겁니다. 그리고 데이터 저장소의 상태가 업데이트 되면 구독 중인 컴포넌트가 알림을 받게 되고 컴포넌트는 업데이트를 합니다.  

---

### 리액트가 아닌 외부에서 리덕스 연습

```jsx

// 1. 리덕스 import
const redux = require('redux');  

// 2. 리듀서 함수 생성(파라미터: 기존상태, 액션)
const counterReducer = (state = {counter : 0}, action) => {
    if(action.type === 'increment'){
        return {
            counter : state.counter + 1
        };
    } else if (action.type === 'decrement') {
        return {
            counter : state.counter - 1
        };
    }

    // default 초기화 액션으로 dispatch된다면 state값 그대로 반환
    return state;
}

// 3. import한 리덕스 객체를 이용해서 저장소를 생성
const store = redux.createStore(counterReducer); 

// 4. 컴포넌트에 대한 구독 정의, getState()는 업데이트된 후의 최신 상태 스냅샷을 제공 
const counterSubscriber = () => {
    const latestState = store.getState();
    console.log('latestState::', latestState);
}

// 5. 리덕스가 구독함수를 인식하도록 하고 상태가 변경될 때마다 이 함수를 실행하라고 말해줘야한다.
store.subscribe(counterSubscriber);

// 6. dispatch는 액션을 발송하는 객체
store.dispatch({ type : 'increment', })
store.dispatch({ type : 'decrement', })

```

위의 코드는 연습용이고, 이제 실전에서 리덕스를 적용해보자!

---

### 리액트에 리덕스 적용

```jsx
// src/store/index.js
import { createStore } from 'redux';

const initialState = { counter : 0, showCounter: true}

const counterReducer = (state = initialState, action ) => {
    if(action.type === 'increment') {
        return { 
            counter : state.counter + action.amount,
            showCounter : state.showCounter
        }
    } else if(action.type === 'decrement') {
        return { 
            counter : state.counter - 1,
            showCounter : state.showCounter
        }
    } else if (action.type === 'toggle') {
        return { 
            counter : state.counter,
            showCounter : !state.showCounter
        }
    }

    return state;
}

const store = createStore(counterReducer);

export default store;
```

실전에서는 reducer함수를 createStore의 포인터로 지정하고 해당 store를 export해주었다. 

```jsx
//src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import store from './store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}><App /></Provider>);
```

이제 최상위 컴포넌트를 호출하는 index.js에 가서 react-redux의 Provider를 import하고

App을 Provider컴포넌트로 wrap하고 props로 store={store}를 주면 하위에 있는 컴포넌트들은 store에 접근이 가능하다. 

```jsx
//src/component/Counter.js

import classes from './Counter.module.css';

/*
useSelector는 자동으로 상태의 일부를 선택하게 해준다
useSelector 사용이유 : 함수가 어떤 데이터를 스토어에서 추출할지 결정하는데
규모가 큰 애플리케이션에서는 다양한 프로퍼티와 네스트 객체, 배열이 있다. 
따라서 전체 상태 객체에서 일부만 받을 수 있는 useSelector를 사용하였다.
*/
import { useSelector } from 'react-redux'; 

const Counter = () => {

  const counter = useSelector((state) => state.counter);
  const showCounter = useSelector((state) => state.showCounter);
  const dispatch = useDispatch();

  const toggleCounterHandler = () => {
    dispatch({type:'toggle'})
  };
	const incrementHandler = () => {
    dispatch({type:'increment'});
  }
  const decrementHandler = () => {
    dispatch({type:'decrement'});
  }

return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      {showCounter && <div className={classes.value}>{counter}</div>}
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={incrementHandler}>Increase by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter;
```

---

<aside>
💡 **리덕스 사용 시 유의할 점**

리덕스는 기존의 state를 대체하는데 사용하는 완전히 새로운 객체인 새 snapshot을 항상 반환해야한다. **리듀서함수의 argument를 통해 얻는 원본의 state를 절대 변경해서는 안된다.** 
⇒ 이로 인해 버그인 예측 불가능한 동작이 발생할 수 있고 디버깅하는 것도 어려워질 수 있다. 또한 버그가 발생하지 않더라도 state가 동기화 되지않는 더 큰 애플리케이션에서 예기치 않은 부작용이 생길 수 있고, ui가 더 이상 state를 정확히 반영하지 않을 수 있다.

</aside>

---

### 프로젝트가 복잡해질수록 리덕스를 사용하는데 문제점

- **액션타입(action)**
    
    액션을 발생시킬 떄 절대 오타가 나면 안된다.  오타가 나면 리듀서가 처리하지 못함
    
    애플리케이션이 커지고 여러 개발자가 같이 작업하고 서로 다른 액션이 많을 때, 이런 식별자중 하나를 망치기 십상이다. 식별자의 충돌이 발생할수도 있고요
    
- **상태(state)**
    
    가지고 있는 데이터와 상태가 많을수록 상태객체도 점점 커진다.  이 말인즉슨, 많은 상태를 복사해야 한다. 모든 상태 속성을 유지하려면 계속해서 복사해야한다. 그래서 이 리듀서 함수의 길이가 길어지고 그러다가 유지할 수 없을만큼 리덕스 파일이 거대해진다. 
    
- **상태의 변경불가성**
    
    기존의 상태를 함부러 바꿀 수 없고 복잡한 데이터를 가지고 있을 때, 중첩된 데이터를 실수로 바꾸면서 망치기가 쉽다. 
    

이런 방식을 해결하기 위해 **Redux Toolkit** 이라는 라이브러리를 사용한다.,
