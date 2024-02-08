import './App.css';
import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './UseBookSearch'


function App() {

  const[query, setQuery] = useState('')
  const[pageNumber, setPageNumber] = useState(1)
  
  const {
    books,
    hasMore,
    loading,
    error

  } = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookRef = useCallback(node => {
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        console.log('Visible')
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if(node) observer.current.observe(node)
  },[loading, hasMore])

  function handleChange(e){
    setQuery(e.target.value)
    setPageNumber(1)
  }



  return (
    <div className="App">
      <input type='text' value={query} onChange={handleChange}></input>
      {
        books.map((book, index) => {
          if(books.length === index + 1){
            return <div ref={lastBookRef} key={book}>{book}</div>
          }
          else {
            return <div key={book}>{book}</div>
          }
        })
      }
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error Fetching"}</div>
    </div>
  );
}

export default App;
