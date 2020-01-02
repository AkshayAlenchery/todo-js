//! Global variables
const listAddInput = document.getElementById('list-add')
const todoAddInput = document.getElementById('todo-add')
const listContainer = document.getElementById('show-list-container')
const todoContainer = document.getElementById('todo-container')
const todoHeader = document.getElementById('todo-header')
const todoList = document.getElementById('todo-list')

const listIds = localStorage.getItem('listIds') ? JSON.parse(localStorage.getItem('listIds')) : []

//! Todo functions

const addNewList = event => {
  const listName = listAddInput.value
  if (listName === '') {
    listAddInput.className = 'error'
    listAddInput.setAttribute('placeholder', 'Please enter a list name')
  } else {
    const newList = {
      id: listIds.length === 0 ? 1 : listIds[listIds.length - 1] + 1,
      listName: listName,
      todoCount: 0,
      todo: []
    }
    listIds.push(newList.id)
    localStorage.setItem('listIds', JSON.stringify(listIds))
    localStorage.setItem(newList.id, JSON.stringify(newList))
    renderList(newList)
    listAddInput.value = ''
  }
}

const showTodo = (event, listId) => {
  if (todoContainer.classList.contains('hide')) {
    todoContainer.classList.remove('hide')
  }
  const listDetails = JSON.parse(localStorage.getItem(listId))
  todoHeader.getElementsByTagName('span')[0].textContent = listDetails.listName
  const attr = document.createAttribute('list-id')
  attr.value = listId
  todoAddInput.setAttributeNode(attr)
  todoList.innerHTML = ''
  if (listDetails.todoCount === 0) {
    const span = document.createElement('span')
    span.textContent = "No todo's to display at the moment."
    todoList.style.textAlign = 'center'
    todoList.appendChild(span)
  }
}

const deleteTodo = (event, listId) => {
  localStorage.removeItem(listId)
  listIds.splice(
    listIds.findIndex(id => id === listId),
    1
  )
  localStorage.setItem('listIds', JSON.stringify(listIds))
  event.currentTarget.parentNode.remove()
}

const renderList = list => {
  const div = document.createElement('div')
  const span1 = document.createElement('span')
  span1.textContent = list.listName
  span1.setAttribute('onclick', 'showTodo(event, ' + list.id + ')')
  div.appendChild(span1)
  const span2 = document.createElement('span')
  span2.className = 'mdi mdi-delete'
  span2.setAttribute('onclick', 'deleteTodo(event, ' + list.id + ')')
  div.appendChild(span2)
  div.className = 'list'
  listContainer.appendChild(div)
}

const renderTodo = todo => {
  // Stopped here
}

const addNewTodo = event => {
  const todoName = todoAddInput.value
  const listId = todoAddInput.getAttribute('list-id')
  if (todoName === '') {
    todoAddInput.className = 'error'
    todoAddInput.setAttribute('placeholder', 'Please enter a todo')
  } else {
    const listDetails = JSON.parse(localStorage.getItem(listId))
    const todo = listDetails.todo
    const newTodo = {
      id: todo.length === 0 ? 1 : todo[todo.length - 1].id + 1,
      value: todoName,
      scheduled: false,
      completed: false,
      priority: 0
    }
    todo.push(newTodo)
    listDetails.todo = todo
    listDetails.todoCount += 1
    localStorage.setItem(listId, JSON.stringify(listDetails))
    renderTodo(newTodo)
    todoAddInput.value = ''
  }
}

const resetInput = element => {
  element.className = ''
  element.setAttribute('placeholder', 'Create a new list')
}

//! Load all the lists stored in localstorage
listIds.forEach(listId => {
  renderList(JSON.parse(localStorage.getItem(listId)))
})

//! Event Listeners

listAddInput.addEventListener('keydown', event => {
  resetInput(listAddInput)
  if (event.keyCode === 13) addNewList()
})

todoAddInput.addEventListener('keydown', event => {
  resetInput(todoAddInput)
  if (event.keyCode === 13) addNewTodo()
})

document.getElementsByClassName('mdi-close-box')[0].addEventListener('click', () => {
  todoContainer.classList += 'hide'
})
