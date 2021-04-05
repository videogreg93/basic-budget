import firebase from 'firebase/app';

const ExampleDataService = (function () {
    var _service;
    var db;
    var root;
    function _getService() {
        if (!_service) {
            _service = this;
            db = firebase.firestore();
            root = db.collection("examples");
            return _service
        }
        return _service
    }
    function _getFields() {
        return root.doc("fields").collection("data").get().then((querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                var item = doc.data().value;
                data.push(item);
            });
            return data;
        });
    }
    function _getExampleExpenses() {
        return root.doc("expenses").collection("Data").get().then((querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                var item = doc.data();
                data.push(item);
            });
            console.log(data);
            return data;
        });
    }
    
    return {
        getService: _getService,
        getFields: _getFields,
        getExampleExpenses: _getExampleExpenses
    }
})();

export default ExampleDataService