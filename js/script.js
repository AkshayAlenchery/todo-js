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

const completedTodo = (event, todoId, listId) => {
  const listDetails = JSON.parse(localStorage.getItem(listId))
  const ele = event.currentTarget
  const index = listDetails.todo.findIndex(todo => todo.id === todoId)
  listDetails.todo[index].completed = ele.checked
  localStorage.setItem(listId, JSON.stringify(listDetails))
  const parentNode = event.currentTarget.parentNode
  if (ele.checked === true) {
    parentNode.parentNode.style.textDecoration = 'line-through'
    parentNode.parentNode.style.color = '#999'
  } else {
    parentNode.parentNode.style.textDecoration = 'none'
    parentNode.parentNode.style.color = '#3f3844'
  }
}

const deleteTodo = (event, todoId, listId) => {
  const listDetails = JSON.parse(localStorage.getItem(listId))
  const todos = listDetails.todo
  const index = listDetails.todo.findIndex(todo => todo.id === todoId)
  todos.splice(index, 1)
  listDetails.todo = todos
  listDetails.todoCount -= 1
  localStorage.setItem(listId, JSON.stringify(listDetails))
  event.currentTarget.parentNode.parentNode.remove()
}

const scheduleTodo = (event, todoId, listId) => {
  const listDetails = JSON.parse(localStorage.getItem(listId))
  const todos = listDetails.todo
  const index = listDetails.todo.findIndex(todo => todo.id === todoId)
  todos[index].scheduled = event.target.value
  listDetails.todo = todos
  localStorage.setItem(listId, JSON.stringify(listDetails))
  console.log(event)
  event.target.previousElementSibling.classList = 'schedule'
  event.target.previousElementSibling.textContent = event.target.value
}

const showNote = event => {
  const note = event.target.nextSibling
  if (note.classList.contains('hide')) note.classList = 'show'
  else note.classList = 'hide'
}

const addNote = (event, todoId, listId) => {
  if (event.keyCode === 13 && event.target.value !== '') {
    const listDetails = JSON.parse(localStorage.getItem(listId))
    const todos = listDetails.todo
    const index = listDetails.todo.findIndex(todo => todo.id === todoId)
    todos[index].note = event.target.value
    listDetails.todo = todos
    localStorage.setItem(listId, JSON.stringify(listDetails))
  }
}

const showTodoEdit = event => {
  const todoName = event.target.parentNode.parentNode.childNodes[1]
  const span = todoName.childNodes[0]
  const input = todoName.childNodes[1]
  span.className = 'hide'
  input.className = 'show'
}

const updateTodoName = (event, todoId, listId) => {
  event.target.className = 'show'
  event.target.setAttribute('placeholder', '')
  if (event.keyCode === 13) {
    if (event.target.value === '') {
      event.target.className = 'error'
      event.target.setAttribute('placeholder', 'Please enter a list name')
    } else {
      const listDetails = JSON.parse(localStorage.getItem(listId))
      const todos = listDetails.todo
      const index = listDetails.todo.findIndex(todo => todo.id === todoId)
      todos[index].value = event.target.value
      listDetails.todo = todos
      localStorage.setItem(listId, JSON.stringify(listDetails))
      event.target.className = 'hide'
      event.target.previousSibling.className = 'show'
      event.target.previousSibling.textContent = event.target.value
      event.target.value = ''
    }
  }
}

const renderTodo = (todo, listId) => {
  const div1 = document.createElement('div')
  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.setAttribute('name', 'completed')
  checkbox.setAttribute('id', 'completed')
  if (todo.completed === true) checkbox.setAttribute('checked', 'true')
  checkbox.setAttribute('onclick', 'completedTodo(event, ' + todo.id + ', ' + listId + ')')
  div1.appendChild(checkbox)

  const div2 = document.createElement('div')
  const span1 = document.createElement('span')
  span1.textContent = todo.value
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('name', 'todo-name')
  input.setAttribute('onkeydown', 'updateTodoName(event, ' + todo.id + ', ' + listId + ')')
  input.value = todo.value
  input.className = 'hide'
  div2.appendChild(span1)
  div2.appendChild(input)

  const div3 = document.createElement('div')
  const span2 = document.createElement('span')
  if (todo.scheduled === false) span2.className = 'mdi mdi-calendar-clock schedule'
  else {
    span2.className = 'schedule'
    span2.textContent = todo.scheduled
  }
  span2.setAttribute('title', 'Schedule')
  span2.setAttribute('id', 'schedule-span')
  div3.appendChild(span2)
  const date = document.createElement('input')
  date.setAttribute('type', 'date')
  date.setAttribute('name', 'schedule-add')
  date.setAttribute('id', 'schedule-add')
  date.setAttribute('onchange', 'scheduleTodo(event, ' + todo.id + ', ' + listId + ')')
  // date.className = 'hide'
  div3.appendChild(date)

  const div4 = document.createElement('div')
  const span3 = document.createElement('span')
  span3.className = 'mdi mdi-file-document-box-plus note'
  span3.setAttribute('title', 'Add note')
  span3.setAttribute('onclick', 'showNote(event)')
  div4.appendChild(span3)
  const note = document.createElement('textarea')
  note.setAttribute('name', 'note-add')
  note.setAttribute('id', 'note-add')
  note.setAttribute('cols', '20')
  note.setAttribute('rows', '10')
  note.value = todo.note
  note.setAttribute('onkeydown', 'addNote(event,' + todo.id + ', ' + listId + ')')
  note.className = 'hide'
  div4.appendChild(note)

  const div5 = document.createElement('div')
  const span4 = document.createElement('span')
  span4.className = 'mdi mdi-priority-high priority'
  span4.setAttribute('title', 'Set priority')
  div5.appendChild(span4)
  const select = document.createElement('select')
  select.setAttribute('name', 'priority-add')
  select.setAttribute('id', 'priority-add')
  const options = ['Low', 'Medium', 'High']
  options.forEach((value, index) => {
    const option = document.createElement('option')
    option.setAttribute('value', index)
    option.textContent = value
    select.appendChild(option)
  })
  select.className = 'hide'
  div5.appendChild(select)

  const div6 = document.createElement('div')
  const span5 = document.createElement('span')
  span5.className = 'mdi mdi-content-save-edit edit'
  span5.setAttribute('title', 'Edit')
  span5.setAttribute('onclick', 'showTodoEdit(event)')
  div6.appendChild(span5)

  const div7 = document.createElement('div')
  const span6 = document.createElement('span')
  span6.className = 'mdi mdi-delete delete'
  span6.setAttribute('title', 'Delete')
  span6.setAttribute('onclick', 'deleteTodo(event, ' + todo.id + ', ' + listId + ')')
  div7.appendChild(span6)

  const mainDiv = document.createElement('div')
  if (todo.completed === true) {
    mainDiv.style.textDecoration = 'line-through'
    mainDiv.style.color = '#999'
  }
  mainDiv.className = 'todo'
  mainDiv.appendChild(div1)
  mainDiv.appendChild(div2)
  mainDiv.appendChild(div3)
  mainDiv.appendChild(div4)
  mainDiv.appendChild(div5)
  mainDiv.appendChild(div6)
  mainDiv.appendChild(div7)
  todoList.appendChild(mainDiv)
}

const showTodo = (event, listId) => {
  if (todoContainer.classList.contains('hide')) {
    todoContainer.classList.remove('hide')
    todoContainer.classList += 'show'
  }
  const listDetails = JSON.parse(localStorage.getItem(listId))
  todoHeader.getElementsByTagName('span')[0].textContent = listDetails.listName
  const attr = document.createAttribute('list-id')
  attr.value = listId
  todoAddInput.setAttributeNode(attr)
  todoList.innerHTML = ''
  if (listDetails.todoCount === 0) {
    // const span = document.createElement('span')
    // span.textContent = "No todo's to display at the moment."
    // todoList.style.textAlign = 'center'
    // todoList.appendChild(span)
  } else {
    const todos = listDetails.todo
    todos.forEach(todo => renderTodo(todo, listId))
  }
}

const deleteList = (event, listId) => {
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
  span2.className = 'mdi mdi-delete delete'
  span2.setAttribute('title', 'Delete')
  span2.setAttribute('onclick', 'deleteList(event, ' + list.id + ')')
  div.appendChild(span2)
  div.className = 'list'
  listContainer.appendChild(div)
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
      priority: 0,
      note: ''
    }
    todo.push(newTodo)
    listDetails.todo = todo
    listDetails.todoCount += 1
    localStorage.setItem(listId, JSON.stringify(listDetails))
    renderTodo(newTodo, listId)
    todoAddInput.value = ''
  }
}

const resetInput = element => {
  element.className = ''
  element.setAttribute('placeholder', 'Create a new list')
}

const hideTodoContainer = event => {
  if (todoContainer.classList.contains('show')) {
    todoContainer.classList.remove('show')
    todoContainer.classList += 'hide'
    console.log(todoContainer)
  }
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
