const db = require('pouchdb')
var accounts = new db('accounts')
module.exports = (uname) => {
return new Promise((resolve, reject) => {
    accounts.get(uname) 
    .then((doc) => {
        delete doc.authorization
        resolve({success: true, user: doc})
    })
    .catch((err) =>{
       //acc not found
       resolve({success: false, errormsg: "This account doesn't exist"})
    })
})
}