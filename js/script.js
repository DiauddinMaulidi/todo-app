let todos = []
let RENDER_EVENT = 'render-todo'

document.addEventListener('DOMContentLoaded', function() {
    let submitForm = document.getElementById('form')
    submitForm.addEventListener('submit', function(e) {
        e.preventDefault()
        addTodo()
    })

    function tbt() {
        const timeStamp = document.querySelector('#date').value
        const results = timeStamp.split('-')

        const tgl = results[2]
        const bln = results[1]
        const thn = results[0]

        return `${tgl}-${bln}-${thn}`
    }

    function addTodo() {
        const titleTugas = document.querySelector('#title')
        const timeStamp = document.querySelector('#date')
        const tugas = titleTugas.value

        const generate = generateID()
        const newObject = generateObjectTodo(generate, tugas, tbt(), false)
        todos.push(newObject)
        titleTugas.value = ''
        timeStamp.value = ''
        console.log(newObject);


        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    function generateID() {
        return +new Date()
    }
    
    function generateObjectTodo(id, tugas, timeStamp, isComplete) {
        return {
            id, tugas, timeStamp, isComplete
        }
    }

    function makeTodos(todoObject) {
        const textTitle = document.createElement('h2')
        textTitle.innerText = todoObject.tugas

        const timeStamp = document.createElement('p')
        timeStamp.innerText = todoObject.timeStamp

        const textContainer = document.createElement('div')
        textContainer.classList.add('inner')
        textContainer.append(textTitle, timeStamp)

        const container = document.createElement('div')
        container.classList.add('item', 'shadow')
        container.append(textContainer)
        container.setAttribute('id', `${todoObject.id}`)


        if( todoObject.isComplete ) {
            const buttonUndo = document.createElement('button')
            buttonUndo.classList.add('undo-button')
            
            buttonUndo.addEventListener('click', function() {
                undoButtonComplete(todoObject.id)
            })

            const buttonTrash = document.createElement('button')
            buttonTrash.classList.add('trash-button')

            buttonTrash.addEventListener('click', function() {
                removeButtonComplete(todoObject.id)
            })

            container.append(buttonUndo, buttonTrash)
        } else {
            const checkButton = document.createElement('button')
            checkButton.classList.add('check-button')

            checkButton.addEventListener('click', function() {
                addButtonComplete(todoObject.id)
            })

            container.append(checkButton)
        }

        return container
    }

    function addButtonComplete(todoId) {
        const todoTarget = findTodo(todoId)

        if( todoTarget == null ) return;

        todoTarget.isComplete = true
        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    function undoButtonComplete(todoId) {
        const todoTarget = findTodo(todoId)

        todoTarget.isComplete = false
        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    function removeButtonComplete(todoId) {
        const todoTarget = findTodo(todoId)
        
        todos.splice(todoTarget, 1)
        document.dispatchEvent(new Event(RENDER_EVENT))
    }
    
    function findTodo(todoId) {
        for (const todoItem of todos) {
            if( todoItem.id === todoId ) {
                return todoItem
            }
        }
        return null
    }


    document.addEventListener(RENDER_EVENT, function() {
        const listItem = document.getElementById('todos')
        listItem.innerHTML = ''
        
        const doneTodos = document.getElementById('todosDone')
        doneTodos.innerHTML = ''
        
        for (const result of todos) {
            const todoCheck = makeTodos(result)
            if( !result.isComplete ) {
                listItem.append(todoCheck)
            } else {
                doneTodos.append(todoCheck)
            }
        }
    })

})
