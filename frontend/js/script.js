const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input-task')

const fetchTasks = async () => {
    const response = await fetch('http://localhost:3333/tasks');
    const tasks = await response.json()
    return tasks
}

const addTask = async (event) => {
    event.preventDefault();
    const body = { title: inputTask.value }
    await fetch('http://localhost:3333/tasks', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    loadTasks()
    inputTask.value = ''
}

const updateTask = async ({ id, title, status }) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status })
    })

    loadTasks()
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'delete'
    })
    loadTasks()
}

const formatDate = (dateUTC) => {
    const options = { dateStyle: 'long', timeStyle: 'short' }
    const date = new Date(dateUTC).toLocaleString('pt-br', options)
    return date
}

const createElement = (tag, innerText = '', innerHTML = '') => {
    const element = document.createElement(tag)
    innerText ? element.innerText = innerText : null;
    innerHTML ? element.innerHTML = innerHTML : null;
    return element
}

const addOptions = (element, arrayOptions) => {
    arrayOptions.forEach(optionText => {
        const option = createElement('option', optionText, '')
        element.appendChild(option)
        option.value = optionText
    })
}

const createSelect = (value, arrayOptions) => {
    const selectStatus = createElement('select')
    addOptions(selectStatus, arrayOptions)
    selectStatus.value = value
    return selectStatus
}

const createRow = (task) => {

    const { id, title, created_at, status } = task;

    const tr = createElement('tr')
    const tdTitle = createElement('td', title)
    const tdCreatedAt = createElement('td', formatDate(created_at))

    const tdStatus = createElement('td')
    const arrayOptions = ['pendente', 'em andamento', 'concluída']
    const selectStatus = createSelect(status, arrayOptions)

    //exemplo de uso do operador spread ...
    selectStatus.addEventListener('change', ({ target }) => updateTask({ ...task, status: target.value }))
    tdStatus.appendChild(selectStatus)

    const tdActions = createElement('td')
    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>')

    const editForm = createElement('form')
    const editInput = createElement('input')
    editInput.value = title
    editForm.appendChild(editInput)

    editButton.classList.add('btn-action')
    deleteButton.classList.add('btn-action')

    editButton.addEventListener('click', ({ target }) => {
        tdTitle.innerText = ''
        tdTitle.innerHTML = ''
        tdTitle.appendChild(editForm)
    })
    editForm.addEventListener('submit', (event) => {
        event.preventDefault()
        updateTask({ ...task, title: editInput.value })
    })

    deleteButton.addEventListener('click', () => deleteTask(id))

    tdActions.appendChild(editButton)
    tdActions.appendChild(deleteButton)

    tr.appendChild(tdTitle)
    tr.appendChild(tdCreatedAt)
    tr.appendChild(tdStatus)
    tr.appendChild(tdActions)

    return tr
}

const loadTasks = async () => {
    const tasks = await fetchTasks()
    tbody.innerHTML = ''
    tasks.forEach(task => {
        const tr = createRow(task)
        tbody.appendChild(tr)
    })
}

addForm.addEventListener('submit', addTask)


loadTasks()