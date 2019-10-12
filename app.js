    // BUDGET CONTROLER
    var budgetCintroller = (function () {

        // some code
        var Expense = function (id, description, value) {
            this.id = id,
                this.description = description,
                this.value = value
        };
        var Income = function (id, description, value) {
            this.id = id,
                this.description = description,
                this.value = value
        };

        var data = {
            allItemes: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            }
        };

        return {
            addItem: function (type, des, val) {
                var newItem, ID;
                // creat enew id
                if (data.allItemes[type].length > 0) {
                    ID = data.allItemes[type][data.allItemes[type].length - 1].id + 1
                } else {
                    ID = 0;
                }

                // creat enew item based on type  inc or exp
                if (type === 'exp') {
                    newItem = new Expense(ID, des, val)
                } else if (type === 'inc') {
                    newItem = new Income(ID, des, val)
                }
                // push it to our data structure
                data.allItemes[type].push(newItem);
                // return the new element
                return newItem;
            },
            testing: function () {
                console.log(data);
            }
        };
    })();

    // UI CONTROLER
    var UIControler = (function () {

        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list'
        }

        //some code
        return {
            getInput: function () {

                return {
                    type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: document.querySelector(DOMstrings.inputValue).value
                };
            },

            addListItem: function (obj, type) {
                var html, newHtml, element;

                // create HTML string with placeholder text

                if (type === 'inc') {
                    element = DOMstrings.incomeContainer;

                    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                } else if (type === 'exp') {
                    element = DOMstrings.expensesContainer;

                    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }

                // replaceplaceholder text wit some actual data

                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);

                // insert HTML in the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            },

            getDOMstrings: function () {
                return DOMstrings;
            }
        }

    })();

    // GLOBAL APP CONTROLER
    var controler = (function (budgetCtrl, UIctrl) {
        var setupEventLesteners = function () {
            var DOM = UIctrl.getDOMstrings();
            // whqt will be done on button press
            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddIttem);
            // whqt will be done on button press
            document.addEventListener('keypress', function (event) {

                if (event.keyCode === 13 || event.which === 13) {
                    ctrlAddIttem()
                }
            });
        };
        // some code

        var ctrlAddIttem = function () {
            var input, newItem;
            // 1. get the field input data
            input = UIctrl.getInput();
            // 2. add the item to thr bodget controler
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the ittem to the UI
            UIctrl.addListItem(newItem, input.type);
            // 4. calculate budget
            // 5. display the budget on UI
        };

        return {
            init: function () {
                console.log('aplication started');
                return setupEventLesteners();
            }
        }

    })(budgetCintroller, UIControler);

    controler.init();