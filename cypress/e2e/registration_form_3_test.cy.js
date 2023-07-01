beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

//BONUS TASK: add visual tests for registration form 3

/*
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */

 describe('Section 1: visual tests', ()=> {
    it('This is my first test',() => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height, to be equal 166
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 165)
    })

        //Check if dropdown and dependencies between 2 dropdowns are correct
    it('Check that  list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        //Choosing Spain in dropdown, 4 cities have to appear in dependable dropdown (Malaga, Madrid, Valencia, Corralejo)
        cy.get('#country').select('Spain')
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
        cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
        cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo')

        //Choosing Estonia in dropdown, 3 cities have to appear in dependable dropdown (Tallinn, Haapsalu, Tartu)
        cy.get('#country').select('Estonia')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
        cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu')
        cy.get('#city').find('option').eq(3).should('have.text', 'Tartu')
    
        //Choosing Austria in dropdown, 3 cities have to appear in dependable dropdown (Vienna, Salzburg, Innsbruck)
        cy.get('#country').select('Austria')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
        cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')
    })

        // Check radio buttons and its content
    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never').and('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(2).check().should('be.checked')
        cy.get('input[type="radio"]').eq(3).check().should('be.checked')
    })

        // Check checkboxes, their content and links
    it('Check that list of checkboxes is correct', () => {
        // Array of found elements with given selector has 2 elements in total
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('input[type="checkbox"]').eq(0)
        cy.get('input[type="checkbox"]').next().eq(1)

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

        // Check that URL to Accept our cookie policy page is correct and clickable

        cy.get('button').children().should('have.length', 1)
        cy.get('div').children().eq(1).click()
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 3')
    })

        //Check email format
    it('Check that email format is correct', () => {
        cy.get('[type="email"]').type('invalid')
        cy.get('#emailAlert').should('be.visible')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('contain', 'Invalid email address')
        // Correct error mesage when field is empty
        cy.get('[type="email"]').clear()
        cy.get('#emailAlert').should('be.visible')
        cy.get('span[ng-show="myForm.email.$error.required"]').should('contain', 'Email is required')
    })
});

//BONUS TASK: add functional tests for registration form 3

/*
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */

describe('Section 2: functional tests', ()=> {
    it('check that all fields are filled in + validation',() => {
        cy.get('input[name="name"]').clear().type('Katre Alavee')
        cy.get('[type="email"]').type('katre.alavee@hot.ee')

        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tallinn')

        cy.get('div').should('contain', 'Date of birth').find('input[type="date"]').first().type('1990-10-29')
        cy.get('input[type="radio"]').eq(3).check()
        cy.get('#birthday').type('1990-10-29')
        cy.get('input[type="checkbox"]').first().click()
        cy.get('input[type="checkbox"]').last().click()

        //Submit button is enabled
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.enabled')

        //Sumbission is received if Submit button is clicked and message is visible
        cy.get('input[ng-disabled="myForm.$invalid"]').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')

    })

    it('check that only mandatory fields are filled in + validations',() => {
        cy.get('[type="email"]').type('katre.alavee@hot.ee')
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tallinn')
        cy.get('input[type="checkbox"]').first().click()
        cy.get('input[type="checkbox"]').last().click()
        //Submit button is enabled
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.enabled')
        //Sumbission is received if button is clicked and message is visible
        cy.get('input[ng-disabled="myForm.$invalid"]').click()
        cy.get('h1').contains('Submission received')
        cy.go('back')

    })

    it.only('User can not submit form with empty email field',() => {
        cy.get('[type="email"]').clear()
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Tallinn')
        cy.get('input[type="checkbox"]').first().click()
        cy.get('input[type="checkbox"]').last().click()

        //Submit button is enabled
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.enabled')

        cy.get('input[ng-disabled="myForm.$invalid"]').click()

        


    })




    
    //copy from other work
    it('User can not submit form with empty email field', () => {
        inputValidData()
        cy.get('[type="email"]').clear()
        //Error message should be visible
        cy.get('span[ng-show="myForm.email.$error.required"]').should('contain', 'Email is required').and('be.visible')
        //Submit button is disabled
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.disabled')
    });
    it('User can not submit form with empty country field', () => {
        inputValidData()
        cy.get('#country').select('')
        //Submit button is disabled
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.disabled')
    
    it('User can not submit form with empty city field', () => {
        inputValidData()
        cy.get('#city').select('')
        //Submit button is disabled
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.disabled')
    });
    it('User can not submit form with unchecked checkboxes', () => {
        inputValidData()
        //Privacy policy checkbox
        cy.get('input[type="checkbox"]').first().uncheck()
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.disabled')
        //Cookie policy checkbox
        cy.get('input[type="checkbox"]').last().uncheck()
        cy.get('input[ng-disabled="myForm.$invalid"]').should('be.disabled')
    });
    it('City is already chosen and country is updated, then city choice should be removed', () => {
        cy.get('#country').select('Estonia')
        cy.get('#city').select('Haapsalu')
        cy.get('#country').select('Austria')
        //Haapsalu is removed
        cy.get('#city').should('not.have.text', 'Haapsalu')
        //City options should be correct to country selected (Austria)
        cy.get('#city').find('option').eq(0).should('have.text', '')
        cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
        cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
        cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')
    });
    it('User can add a file', () => {
        inputValidData()
        //Add file
        cy.get('#myFile').selectFile('Screenshot.json.png')
        cy.readFile('Screenshot.json.png')
    })
})
function inputValidData() {
    cy.log('All mandatory fields will be filled')
    cy.get('[type="email"]').type('bonus@email.ee')
    cy.get('#country').select('Austria')
    cy.get('#city').select('Salzburg')
    cy.get('input[type="checkbox"]').first().click()
    cy.get('input[type="checkbox"]').last().click()
}

});










