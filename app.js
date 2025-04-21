const input = document.querySelector('[data-cy="todo-input"]');
const addButton = document.querySelector('[data-cy="add-button"]');
const todoList = document.querySelector('[data-cy="todo-list"]');

let todos = [];

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    let filtered = todos;

    if (filter === 'active') {
        filtered = todos.filter(t => !t.completed);
    } else if (filter === 'completed') {
        filtered = todos.filter(t => t.completed);
    }

    filtered.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span data-cy="todo-text">${todo.text}</span>
            <div>
                <button data-cy="complete-button" data-index="${index}" aria-label="Hotovo alebo Zrušiť">
                    ${todo.completed ? 'Zrušiť' : 'Hotovo'}
                </button>
                <button data-cy="delete-button" data-index="${index}" aria-label="Zmazať úlohu">Zmazať</button>
            </div>
        `;
        todoList.appendChild(li);
    });

    saveToLocalStorage();
}

function addTodoFromInput() {
    const text = input.value.trim();
    if (text && text.length <= 100) {
        todos.push({
            text,
            completed: false
        });
        input.value = '';
        renderTodos();
    } else {
        alert('Maximum character limit reached');
    }
}

// === Event Listeners ===

addButton.addEventListener('click', addTodoFromInput);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodoFromInput();
    }
});

todoList.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (index !== undefined) {
        if (e.target.matches('[data-cy="complete-button"]')) {
            todos[index].completed = !todos[index].completed;
        } else if (e.target.matches('[data-cy="delete-button"]')) {
            todos.splice(index, 1);
        }
        renderTodos();
    }
});

document.querySelector('[data-cy="filter-all"]').addEventListener('click', () => renderTodos('all'));
document.querySelector('[data-cy="filter-active"]').addEventListener('click', () => renderTodos('active'));
document.querySelector('[data-cy="filter-completed"]').addEventListener('click', () => renderTodos('completed'));

// Initial load
loadFromLocalStorage();
renderTodos();