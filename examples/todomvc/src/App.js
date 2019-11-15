import { createSub, component } from 'framework-x'
import * as R from 'ramda'
import React from 'react'
import { evt } from './eventTypes'
import { NewTodoTextInput, VisibleTodosList } from './todos/components/TodosList'
import { VisibilityFilters } from './todos/components/VisibilityFilters'
import { getAllTodosCount, getDoneCount, getNotDoneCount } from './todos/selectors'


const ActiveItemsRemaining = component('ActiveItemsRemaining',
  createSub({ nActive: getNotDoneCount }),
  ({ nActive }) =>
    <span className="todo-count">
        <strong>{nActive || 'No'}</strong> {`item${nActive === 1 ? '' : 's'}`} left
      </span>
)


const ClearCompleted = component('ClearCompleted',
  { injectDispatch: true },
  ({ dispatch }) =>
    <button
      className="clear-completed"
      onClick={() => dispatch(evt.CLEAR_ALL_DONE)}>
      Clear completed
    </button>
)


const Footer = component('Footer',
  createSub({ canClearCompleted: R.pipe(getDoneCount, n => n > 0), }),
  ({ canClearCompleted }) => (
    <footer className="footer">
      <ActiveItemsRemaining />
      <VisibilityFilters />
      {canClearCompleted && <ClearCompleted />}
    </footer>
  )
)


const MarkAllDone = component('MarkAllDone',
  createSub({
    nDone: getDoneCount,
    nTotal: getAllTodosCount,
  }), ({ dispatch, nDone, nTotal }) =>
    <span>
  <input
    className="toggle-all"
    type="checkbox"
    checked={nDone === nTotal}
    readOnly
  />
  <label onClick={() => dispatch(evt.MARK_ALL_DONE)} />
</span>
)


const MainSection = component('MainSection', createSub({
    moreThanOneTodo: R.pipe(getAllTodosCount, x => x >= 1),
  }), ({ moreThanOneTodo }) =>
    <section className={'main'}>
      {moreThanOneTodo && <MarkAllDone />}
      <VisibleTodosList />
      {moreThanOneTodo && <Footer />}
    </section>
)


export const App = () => (
  <div  className={'todoapp'}>
    <header className={'header'}>
      <h1>todos</h1>
      <NewTodoTextInput />
    </header>
    <MainSection/>
    {/*<Notifications />*/}
  </div>
)
