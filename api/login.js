const db = require('pouchdb')
var accounts = new db('accounts')
const bcrypt = require('bcrypt')
module.exports = (uname, pword) => {
return new Promise((resolve, reject) => {
    accounts.get(uname) 
    .then((doc) => {
bcrypt.compare(pword,doc.pword)
.then((result) => {
    if(result) {
        //noice
        resolve({success: true, uname: doc._id, authorization: doc.authorization})
    } else {
        //invalid pword
        resolve({success: false, errormsg: "Invalid Password"})
    }
})
    })
    .catch((err) =>{
       //acc not found
       resolve({success: false, errormsg: "This account doesn't exist"})
    })
})
}