// React : 사용자 정의 태그(component)를 만드는 기술

import './App.css';
import { useState } from 'react';

function Header(props) {
// props : 'Header'의 속성을 object로 전달 받음 => props = {title: "", onChangeMode: ""}
  return (
    <header>
      <h1><a href="/" onClick={event => {
        // preventDefault : <a>의 기본동작(page reload)을 방지하는 method
        event.preventDefault();
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  )
}
function Navigation(props) {
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i]
    lis.push(
      <li key={t.id}>
        <a id={t.id} href={"/read/"+t.id} onClick={event => {
          event.preventDefault();
          props.onChangeMode(Number(event.target.id));
          // Number() : 태그의 속성으로 넘기면 입력값이 숫자더라도 문자로 전달되기 때문에 숫자로 converting
          // target: parameter("event")를 유발시킨 태그를 가리킴 => <a>
        }}>{t.title}</a>
      </li>
    )
  }
  return (
    <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  )
}
function Article(props) {
  return (
    <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  )
}
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={event => {
        event.preventDefault();
        // event.target가 가리키는 태그(<form>)의 내부 태그 중 name이 'title'인 태그의 입력값을 가리킴 => <input/>의 입력값
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type='text' name='title' placeholder='title' /></p>
        <p><textarea name='body' placeholder='body'></textarea></p>
        <p><input type='submit' value='Create' /></p>
      </form>
    </article>
  )
}
function Update(props) {
  // return의 element의 prop(초기값: 'value', 변경값: 'onChange()')에 넘겨줄 state
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={event => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type='text' name='title' placeholder='title' value={title} onChange={event => {
          setTitle(event.target.value);
        }}/></p>
        <p><textarea name='body' placeholder='body' value={body} onChange={event => {
          setBody(event.target.value);
        }}></textarea></p>
        <p><input type='submit' value='Update' /></p>
      </form>
    </article>
  )
}

function App() {

  // useState => [0]: 상태의 값('mode': 'WELCOME') 
  //             [1]: 상태의 값을 변경할 때 사용하는 함수('setMode')
  // const state = useState('WELCOME');
  // const mode = state[0];
  // const setMode = state[1];
  // 위 세줄을 한 줄로 축약하면 다음 줄과 같음
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState();
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'HTML', body:'HTML...'},
    {id:2, title:'CSS', body:'CSS...'},
    {id:3, title:'JavaScript', body:'JavaScript...'}
  ]);
  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if (mode === 'READ') {
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    // react에서 태그를 나열할 때는 하나의 태그 안에 담아두어야 하는데, 빈태그를 사용함 => <> </>
    contextControl = <>
                      <li>
                        <a href={'/update/'+id} onClick={event => {
                          event.preventDefault();
                          setMode('UPDATE');
                        }}>Update</a>
                      </li>
                      <li>
                        <input type="button" value="Delete" onClick={() => {
                          const newTopics = []
                          for(let i=0; i<topics.length; i++) {
                            if(topics[i].id !== id) {
                              newTopics.push(topics[i]);
                            }
                          }
                          setTopics(newTopics);
                          setMode('WELCOME');
                        }} />
                      </li>
                    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      // useState의 state가 Primitive 형식(string,number...)이 아닌 Object 형식(object,array)일 경우,
      // state의 상태변경하기 위해서는 state를 별도로 복제한 후 변수변경하는 방식으로 우회해야함.(object={}, array=[])
      // 복제: const newState = [...state]  ->  변수변경: newState.push(~~)  ->  상태변경: setState(newState)
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(_title, _body) => {
      const newTopics = [...topics]
      const updatedTopics = {id:id, title:_title, body:_body}
      console.log(updatedTopics)
      for(let i=0; i<newTopics.length; i++) {
        if(newTopics[i].id === id) {
          newTopics[i] = updatedTopics;
          break;
        }
      }
      console.log(newTopics)
      setTopics(newTopics);
      setMode('READ')
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Navigation topics={topics} onChangeMode={(id) => {
        setMode('READ');
        setId(id);
      }}></Navigation>
      {content}
      <ul>
        <li>
          <a href='/create' onClick={event => {
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
      
      
    </div>
  );
}

export default App;
