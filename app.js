    // BUDGET CONTROLER
    var budgetCintroller = (function () {

        // some code
        var Expense = function (id, description, value) {
            this.id = id,
                this.description = description,
                this.value = value,
                this.percentage = -1
        };

        Expense.prototype.calcPercentages = function (totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100)
            } else {
                this.percentage = -1;
            }
        };
        Expense.prototype.getPercentages = function () {
            return this.percentage
        };

        var Income = function (id, description, value) {
            this.id = id,
                this.description = description,
                this.value = value
        };
        var calculateTotal = function (type) {
            var sum = 0;
            data.allItemes[type].forEach(function (current) {
                sum += current.value
            });
            data.totals[type] = sum;
        };

        var data = {
            allItemes: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: -1
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

            deleteItem: function (type, id) {
                var ids, index;

                ids = data.allItemes[type].map(function (current) {
                    return current.id
                });
                index = ids.indexOf(id);

                if (index !== -1) {
                    data.allItemes[type].splice(index, 1);
                }

            },

            calculatingBudget: function () {

                // calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');

                // calculate the budget: income - expenses
                data.budget = data.totals.inc - data.totals.exp;

                // calculate the percentage of income that we spent

                if (data.totals.inc > 0) {
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                } else {
                    data.percentage = -1;
                }

            },

            calculatePercentages: function () {
                data.allItemes.exp.forEach(function (current) {
                    current.calcPercentages(data.totals.inc);
                });
            },
            gettingPercentages: function () {

                var allPerc = data.allItemes.exp.map(function (current) {
                    return current.getPercentages();
                });
                return allPerc;
            },

            getBudget: function () {
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    tottalExp: data.totals.exp,
                    percentage: data.percentage
                };
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
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
            exppensesPercLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
        };
        var formatNumber = function (num, type) {
            var numSplit, int, dec, type;
            /*
            - or + sign before the number
            exactly 2 decimal points
            comma separating the thousand

            2310.4567 --> 2,310.46
            2000 --> 2,000.00
            */
            num = Math.abs(num);
            num = num.toFixed(2);

            numSplit = num.split('.');

            int = numSplit[0];
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }
            dec = numSplit[1];

            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        };
        var nodeListForEach = function (list, callback) {
            for (var i = 0; i < list.length; i++) {
                callback(list[i], i)
            }
        };

        //some code
        return {
            getInput: function () {

                return {
                    type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parseFloat konvertuje string u broj!!!

                };
            },

            addListItem: function (obj, type) {
                var html, newHtml, element;

                // create HTML string with placeholder text

                if (type === 'inc') {
                    element = DOMstrings.incomeContainer;

                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                } else if (type === 'exp') {
                    element = DOMstrings.expensesContainer;

                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }

                // replaceplaceholder text wit some actual data

                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

                // insert HTML in the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


            },
            deleteListItem: function (selectorID) {
                var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);

            },

            clearFields: function () {
                var fields, fieldsArr;

                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

                fieldsArr = Array.prototype.slice.call(fields); // NACIN PREBACIVANJA LISTE KOJU VRACA QUERYSELEKTOR U ARREY !!!!!!!!
                fieldsArr.forEach(function (current, index, array) {
                    current.value = '';
                });
                fieldsArr[0].focus();
            },

            // insert new budget value in UI
            displayBudget: function (obj) {
                var type;
                obj.budget > 0 ? type = 'inc' : type = 'exp';

                document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.tottalExp, 'exp');

                if (obj.percentage > 0) {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }
            },

            displayPercentages: function (percentages) {

                var fields = document.querySelectorAll(DOMstrings.exppensesPercLabel);

                nodeListForEach(fields, function (current, index) {
                    //some code
                    if (percentages[index] > 0) {
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '---';
                    }

                });
            },

            displayMonth: () => {
                let now, month, months, year;
                now = new Date();
                // let bozic = new Date(2019, 0, 7);
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ];
                year = now.getFullYear();
                month = now.getMonth();
                document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            },

            changedType: () => {

                let fields = document.querySelectorAll(
                    DOMstrings.inputType + ',' +
                    DOMstrings.inputDescription + ',' +
                    DOMstrings.inputValue
                );

                nodeListForEach(fields, function (cur) {
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

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

            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
            document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);
        };

        var updateBudget = function () {
            // 1. calculate budget
            budgetCtrl.calculatingBudget();
            // 2. display the budget
            var budget = budgetCtrl.getBudget();
            // 3. display the budget on UI
            UIctrl.displayBudget(budget);
        };

        var updatePercentages = function () {


            // calculate percentage
            budgetCtrl.calculatePercentages();
            // read percentage from the budget controler
            var percentages = budgetCtrl.gettingPercentages();
            // update the UI with the new percentages

            UIctrl.displayPercentages(percentages);
            console.log(percentages)
        };

        var ctrlAddIttem = function () {
            var input, newItem;
            // 1. get the field input data
            input = UIctrl.getInput();

            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
                // 2. add the item to thr bodget controler
                newItem = budgetCtrl.addItem(input.type, input.description, input.value);
                // 3. add the ittem to the UI
                UIctrl.addListItem(newItem, input.type);
                // 4. clear the fields
                UIctrl.clearFields();
                // 5. calculate and update budget
                updateBudget();
                // 5. calculate and update percentages
                updatePercentages();

            }
        };

        var ctrlDeleteItem = function (event) {
            var itemID, splitID, type, ID;
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            console.log(itemID)

            if (itemID) {

                //inc-0
                splitID = itemID.split('-');
                type = splitID[0];
                ID = parseInt(splitID[1]);

                // 1. delete the item from data strukture
                budgetCtrl.deleteItem(type, ID);
                // 2. delete the item from UI
                UIctrl.deleteListItem(itemID)
                // 3. update and show the new budget
                updateBudget();
                // 4. update and show new percentages
                updatePercentages();
            }
        }

        return {
            init: function () {
                UIctrl.displayMonth();

                UIctrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    tottalExp: 0,
                    percentage: -1
                });
                console.log('aplication started');
                return setupEventLesteners();
            }
        }

    })(budgetCintroller, UIControler);

    controler.init();