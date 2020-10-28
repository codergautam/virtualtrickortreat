const bcrypt = require('bcrypt')
const db = require('pouchdb')
var accounts = new db('accounts')
const { v4: uuidv4 } = require('uuid');

module.exports = (uname, pword) => {
    return new Promise((resolve, reject) => {
        if(pword.length < 3) {
            resolve( {success: false, errormsg: "Password has to be atleast 2 characters"})
        } else {
        if(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i.test(uname)) {
            if(uname.length > 3 && uname.length <17) {
                bcrypt.hash(pword, 10).then((hash) => {
        
                    accounts.get(uname)
                    .then((doc) => {
                        //account exists
                        resolve( {success: false, errormsg: "This account name is already taken"})
                    })
                    .catch((err) => {
                        if(err.status == 404) {
                       var authorization = uuidv4()
                            accounts.put({
                                _id: uname,
                                pword: hash,
                                authorization: authorization,
                                inv: {},
                                bal: 0
                            }).then(() => {
                            resolve({success: true, authorization: authorization, name: uname})
                            })
                            .catch(() => {
                                resolve({success: false, errormsg: "db error"})
                            })
                            
                        } else {
                            console.log(err)
                            resolve( {success: false, errormsg: "db error"})
                        }
                        
                       
    
                    })

    
                });
            } else {
                resolve( {success: false, errormsg: "Name has to be bigger than 3 characters, and less than 17"})
            }
        } else {
            resolve( {success: false, errormsg: "Name must only contain Alphanumeric and Space..."})
        }
    }
    })

}