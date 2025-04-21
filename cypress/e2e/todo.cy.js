describe('To-Do Manager App', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('adds a new task via button click', () => {
        cy.get('[data-cy="todo-input"]').type('Kúpiť mlieko')
        cy.get('[data-cy="add-button"]').click()
        cy.get('[data-cy="todo-text"]').should('have.text', 'Kúpiť mlieko')
    })

    it('adds a new task via Enter key', () => {
        cy.get('[data-cy="todo-input"]').type('Umýť auto{enter}')
        cy.get('[data-cy="todo-text"]').should('have.text', 'Umýť auto')
    })

    it('does not add empty tasks', () => {
        cy.get('[data-cy="todo-input"]').type('   ')
        cy.get('[data-cy="add-button"]').click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('marks task as completed and uncompleted', () => {
        cy.get('[data-cy="todo-input"]').type('Vyvenčiť psa{enter}')
        cy.get('[data-cy="complete-button"]').click()
        cy.get('li').first().should('have.class', 'completed')
        cy.get('[data-cy="complete-button"]').click()
        cy.get('li').first().should('not.have.class', 'completed')
    })

    it('deletes a task', () => {
        cy.get('[data-cy="todo-input"]').type('Zmazať ma prosím{enter}')
        cy.get('[data-cy="delete-button"]').click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('filters tasks correctly', () => {
        cy.get('[data-cy="todo-input"]').type('Úloha 1{enter}')
        cy.get('[data-cy="todo-input"]').type('Úloha 2{enter}')
        cy.get('[data-cy="complete-button"]').first().click()

        cy.get('[data-cy="filter-active"]').click()
        cy.get('[data-cy="todo-text"]').should('contain', 'Úloha 2').and('have.length', 1)

        cy.get('[data-cy="filter-completed"]').click()
        cy.get('[data-cy="todo-text"]').should('contain', 'Úloha 1').and('have.length', 1)

        cy.get('[data-cy="filter-all"]').click()
        cy.get('[data-cy="todo-text"]').should('have.length', 2)
    })

    it('shows empty list after deleting all tasks', () => {
        cy.get('[data-cy="todo-input"]').type('Task 1{enter}')
        cy.get('[data-cy="todo-input"]').type('Task 2{enter}')
        cy.get('[data-cy="delete-button"]').first().click()
        cy.get('[data-cy="delete-button"]').first().click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('does not add a task when input is empty', () => {
        cy.get('[data-cy="todo-input"]').clear()
        cy.get('[data-cy="add-button"]').click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('persists tasks after page reload', () => {
        cy.get('[data-cy="todo-input"]').type('Test persistence{enter}')
        cy.reload()
        cy.get('[data-cy="todo-text"]').should('contain', 'Test persistence')
    })

    it('applies completed class when task is marked as completed', () => {
        cy.get('[data-cy="todo-input"]').type('Dohodnúť schôdzku{enter}')
        cy.get('[data-cy="complete-button"]').click()
        cy.get('li').first().should('have.class', 'completed')
    })

    it('displays all tasks when "all" filter is clicked', () => {
        cy.get('[data-cy="todo-input"]').type('Test filter{enter}')
        cy.get('[data-cy="complete-button"]').click()
        cy.get('[data-cy="filter-all"]').click()
        cy.get('[data-cy="todo-text"]').should('have.length', 1)
    })

    it('has aria-label for input and buttons', () => {
        cy.get('[data-cy="todo-input"]').should('have.attr', 'aria-label', 'Pridaj úlohu')
        cy.get('[data-cy="add-button"]').should('have.attr', 'aria-label', 'Pridať úlohu')
    })

    it('trims whitespace from input before adding a task', () => {
        cy.get('[data-cy="todo-input"]').type('   Test s medzerami   ')
        cy.get('[data-cy="add-button"]').click()
        cy.get('[data-cy="todo-text"]').should('have.text', 'Test s medzerami')
    })

    it('adds multiple tasks in a row', () => {
        const tasks = ['Prvá', 'Druhá', 'Tretia']
        tasks.forEach(task => {
            cy.get('[data-cy="todo-input"]').type(`${task}{enter}`)
        })
        cy.get('[data-cy="todo-text"]').should('have.length', tasks.length)
    })

    it('does not add task on Enter if input is empty', () => {
        cy.get('[data-cy="todo-input"]').type('     {enter}')
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('shows no tasks in active filter when all are completed', () => {
        cy.get('[data-cy="todo-input"]').type('Hotovo 1{enter}')
        cy.get('[data-cy="complete-button"]').click()
        cy.get('[data-cy="filter-active"]').click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('updates task visibility after completing it under active filter', () => {
        cy.get('[data-cy="todo-input"]').type('Aktívna úloha{enter}')
        cy.get('[data-cy="filter-active"]').click()
        cy.get('[data-cy="complete-button"]').click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })
})

describe('Maximum character limit in input field', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('input does not accept more than 100 characters', () => {
        const longText = 'A'.repeat(150);
        cy.get('[data-cy="todo-input"]').type(longText);
        cy.get('[data-cy="todo-input"]')
            .invoke('val')
            .should('have.length', 100);
    })

    it('adds a task with the maximum allowed characters', () => {
        const maxText = 'A'.repeat(100)
        cy.get('[data-cy="todo-input"]').type(maxText)
        cy.get('[data-cy="add-button"]').click()
        cy.get('[data-cy="todo-text"]').should('have.text', maxText)
    })

    it('prevents typing beyond the maximum length', () => {
        cy.get('[data-cy="todo-input"]').type('A'.repeat(100))
        cy.get('[data-cy="todo-input"]').should('have.value', 'A'.repeat(100))
        cy.get('[data-cy="todo-input"]').type('B')
        cy.get('[data-cy="todo-input"]').should('have.value', 'A'.repeat(100))
    })
})

describe('Additional usability tests', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('does not add a task if only Enter is pressed without typing', () => {
        cy.get('[data-cy="todo-input"]').type('{enter}')
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })

    it('adds multiple tasks in correct order', () => {
        cy.get('[data-cy="todo-input"]').type('Prvá{enter}')
        cy.get('[data-cy="todo-input"]').type('Druhá{enter}')
        cy.get('[data-cy="todo-input"]').type('Tretia{enter}')
        cy.get('[data-cy="todo-text"]').eq(0).should('have.text', 'Prvá')
        cy.get('[data-cy="todo-text"]').eq(1).should('have.text', 'Druhá')
        cy.get('[data-cy="todo-text"]').eq(2).should('have.text', 'Tretia')
    })

    it('handles Unicode characters properly', () => {
        cy.get('[data-cy="todo-input"]').type('🧪 Úloha s emoji 🚀{enter}')
        cy.get('[data-cy="todo-text"]').should('have.text', '🧪 Úloha s emoji 🚀')
    })

    it('trims whitespace-only tasks and prevents them', () => {
        cy.get('[data-cy="todo-input"]').type('     \n     ')
        cy.get('[data-cy="add-button"]').click()
        cy.get('[data-cy="todo-text"]').should('not.exist')
    })
})