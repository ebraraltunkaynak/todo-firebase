import {AiOutlinePlus} from 'react-icons/ai'
import { useState,useEffect } from 'react';
import './App.css';
import Todo from './Todo';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const style= {
  bg:`h-screen w-screen p-4 bg-gradient-to-r from-[#8e44ad] to-[#3498db]`,
  container:`bg-slate-300 max-w-[700px] w-full m-auto  rounded-md shadow-xl p-4`,
  heading:`text-4xl text-gray-800 text-center font-bold p-4`,
  form:`flex justify-between `,
  input:` border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-600 text-slate-100`,
  count:`text-center text-xl text-gray-600`
}

function App() {

  const [todos, setTodos] = useState([])
  const [input,setInput]  = useState('')


  //create todo
const createTodo = async (e) =>{
  e.preventDefault(e);
  if(input==='' ){
    alert("please enter a todo")

    return 

  }
  await addDoc(collection(db, 'todos'), {
    text:input,
    completed:false
  })
  setInput('')

  

}

  // read todo

  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // update todo

  const toggleComplete = async (todo) => {

    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
     });

  }
  //delete todo

  const deleteTodo = async (id) =>{
    await deleteDoc(doc(db, 'todos', id))
  }
  return (
    <div className={style.bg}>
     <div className={style.container}>
      <h3 className={style.heading}>Todo App</h3>

    <form onSubmit={createTodo} className={style.form}>
      <input value={input}
       onChange={(e)=>setInput(e.target.value)} 
       type="text" 
       className={style.input}
        placeholder="Add a todo" />
      <button className={style.button}><AiOutlinePlus size={30} /></button>
    </form>

    <ul>
      {todos.map((todo,index) => (
          <Todo key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo}/>
      ))}

    </ul>
    {todos.length <1 ? null :  <p className={style.count}> {`You have ${todos.length} todos`}</p> }
   
      </div>
    </div>
  );
}

export default App;
