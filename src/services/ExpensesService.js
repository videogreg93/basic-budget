import firebase from 'firebase/app';

const ExpensesService = (function () {
    var _service;
    var db;
    var root;
    var expensesDB;
    function _getService() {
        if (!_service) {
            _service = this;
            return _service
        }
        return _service
    }
    function _init() {
        db = firebase.firestore();
    }
    function _onLogin() {
        console.log(firebase.auth().currentUser.uid);
        root = db.collection("users").doc(firebase.auth().currentUser.uid);
        expensesDB = root.collection("expenses")
    }
    function _getExpenses() {
        return expensesDB.get().then((querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                var item = doc.data();
                item.id = doc.id;
                data.push(item);
            });
            return data;
        });
    }
    function _addExpenses(expenses) {
        return Promise.all(
            expenses.map((item) => {
                return expensesDB
                    .add(item)
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            })
        );
    }
    function _addExpense(expense) {
        return expensesDB
            .add(expense)
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
    // Only adds expenses from the list that aren't already uploaded to firebase
    function _addOnlyNewExpenses(expenses) {
        return _getExpenses().then((items) => {
            console.log(items[3]);
            console.log(expenses[3]);
            var uniqueItems = expenses.filter(function (obj) { return items.findIndex(x => {
                return (x.Description == obj.Description && x.Date == obj.Date && obj.Cost == x.Cost)
            }) == -1 });
            console.log("Adding " + uniqueItems.length + " new items");
            return Promise.all(uniqueItems.map((item) => {
                return _addExpense(item);
            }));
        });
    }
    function _deleteExpense(expense) {
        return expensesDB
            .doc(expense.id)
            .delete()
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
    function _deleteAllExpenses() {
        return _getExpenses().then((items) => {
            return Promise.all(items.map((item) => {
                return _deleteExpense(item)
            }));
        });
    }
    return {
        init: _init,
        onLogin: _onLogin,
        getService: _getService,
        getExpenses: _getExpenses,
        addExpenses: _addExpenses,
        addExpense: _addExpense,
        addOnlyNewExpenses: _addOnlyNewExpenses,
        deleteExpense: _deleteExpense,
        deleteAllExpenses: _deleteAllExpenses
    }
})();

export default ExpensesService