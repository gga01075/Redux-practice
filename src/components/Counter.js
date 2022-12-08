import classes from "./Counter.module.css";
import { useDispatch, useSelector } from "react-redux";

const Counter = () => {
  /* 
   useSelector 사용이유 : 함수가 어떤 데이터를 스토어에서 추출할지 결정하는데
   규모가 큰 애플리케이션에서는 다양한 프로퍼티와 네스트 객체, 배열이 있다. 
   따라서 전체 상태 객체에서 일부만 받을 수 있는 useSelector를 사용하였다.
  */
  const counter = useSelector((state) => state.counter);
  const showCounter = useSelector((state) => state.showCounter);
  const dispatch = useDispatch();

  const toggleCounterHandler = () => {
    dispatch({type:'toggle'})
  };

  const incrementHandler = () => {
    dispatch({type:'increment', amount:5});
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
