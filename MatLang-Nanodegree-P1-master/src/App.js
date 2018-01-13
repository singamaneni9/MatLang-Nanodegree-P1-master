import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookshelfTable from './components/BookshelfTable'
import Search from './components/Search'

export default class BooksApp extends Component {
  state = {
          books: [],
          showSearchPage: true
  }

  
    componentDidMount () {
      BooksAPI.getAll().then((books) => {
        this.setState( { books: books, showSearchPage: false })
      })
    }
 
  onShelfChange = (book,shelf) => {
    BooksAPI.update(book,shelf)
      .then((response) => {
        book.shelf = shelf
        this.setState( (state) => (
          { books: state.books.filter(b => b.id !== book.id).concat([ book ]),
            showSearchPage: false}
          )
        )
      })
  };

  render() {

    // In order to display the different shelves, the state data gets filtered
    // for each individual state
    const state = this.state.books
    const wantToRead = state.filter((book) => book.shelf === 'wantToRead')
    const read = state.filter((book) => book.shelf === 'read')
    const currentlyReading = state.filter((book) => book.shelf === 'currentlyReading')

    return (
        <div className="app">
            <Route path="/searchbooks" render={({history}) => (
              <Search books={currentlyReading.concat(wantToRead,read)}
                      onShelfChange={
                        (book,shelf) =>{
                        this.onShelfChange(book,shelf);
                        history.push('/');
                        }
                      }/>
            )}
            />
            <Route exact path="/" render={() => (
                <div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                        <BookshelfTable
                        currentlyReading={currentlyReading}
                        wantToRead={wantToRead}
                        read={read}
                        onShelfChange={this.onShelfChange}
                        />
                    </div>
                    <div className="open-search">
                        <Link to="/searchbooks">
                        </Link>
                    </div>
                </div>
            )}/>
        </div>
      )
    }
  }
