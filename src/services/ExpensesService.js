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
                data.push(doc.data());
            });
            return data;
        });
    }
    function _addExpenses(expenses) {
        expenses.forEach((item) => {
            expensesDB
                .add(item)
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
    function _addExpense(expense) {
        return expensesDB
            .add(expense)
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
    return {
        init: _init,
        onLogin: _onLogin,
        getService: _getService,
        getExpenses: _getExpenses,
        addExpenses: _addExpenses,
        addExpense: _addExpense
    }
})();

export default ExpensesService