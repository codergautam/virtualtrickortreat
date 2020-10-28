const db = require('pouchdb')
var accounts = new db('accounts')
const candy1 = require("./earn")
var map = {}
for (sad in candy1.candy) { 
    map[candy1.candy[sad].name] = candy1.candy[sad]
}
module.exports = (uname, authorization, candy, amount) => {
return new Promise((resolve, reject) => {
    accounts.get(uname) 
    .then((doc) => {
        if(authorization == doc.authorization) {
            if(map.hasOwnProperty(candy)) {
                if(doc.inv.hasOwnProperty(candy)) {
                    doc.bal = 0
                    if(doc.inv[candy].amount-amount >=0) {
                        var pricegain= amount*map[candy].sell
                        
                        doc.inv[candy].amount -= amount
                        var remaining = doc.inv[candy].amount 
                        if(doc.inv[candy].amount == 0) {
                            delete doc.inv[candy]
                        }
                        doc.bal += pricegain
                        accounts.put(doc)
                        .then(() => {
                            resolve({success: true, moneyearn: pricegain, remainingcandy: remaining, remainingbal: doc.bal, inv: JSON.stringify(doc.inv)})
                        })

                    } else{
                        resolve({success: false, errormsg: "User doesn't have this much candy"})
                    }
                } else {
                    resolve({success: false, errormsg: "User doesn't have this candy"})
                }

            } else {
                resolve({success: false, errormsg: "Invalid candy"})
            }
        } else {
            resolve({success: false, errormsg: "Invalid authorization"})
        }
    })
    .catch((err) =>{
       //acc not found
       resolve({success: false, errormsg: "This account doesn't exist"})
    })
})
}