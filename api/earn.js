const db = require('pouchdb')
var accounts = new db('accounts')

var candy = [
{name: "Tootsie Roll", percent: 20, sell: 10, rarity: "common"},
{name: "Candy Corn", percent: 10, sell: 10, rarity: "common"}, 
{name: "Licorice", percent: 10, sell: 10, rarity: "common"},
{name: "Smartie", percent: 10, sell: 100, rarity: "uncommon"},  
{name: "Peanut Butter Kiss", percent: 10, sell: 100, rarity: "uncommon"}, 
{name: "Hershey Bar", percent: 7, sell: 100, rarity: "uncommon"},
 {name: "Nerds", percent: 7, sell: 1000, rarity: "rare"}, 
 {name: "Nerds", percent: 7, sell: 1000, rarity: "rare"}, 
 {name: "Snicker", percent: 5, sell: 1000, rarity: "rare"},  
 {name: "Kit Kat", percent: 4, sell: 5000, rarity: "epic"}, 
  {name: "Twix", percent: 3, sell: 5000, rarity: "epic"},  
  {name: "Sour Patch Kids", percent: 3, sell: 5000, rarity: "epic"},
  {name: "Skittles", percent: 2, sell: 5000, rarity: "epic"}, 
  {name: "M&M's", percent: 1, sell: 50000, rarity: "legendary"}, 
  {name: "Reese’s Peanut Butter Cup", percent: 1, sell: 50000, rarity: "legendary"}
]

var candyarr = []
i=0
for (candi in candy) {
    for(var il=0; il < candy[candi].percent; il++){
        candyarr[i] = candy[candi]
        i++
    }
  
}
function random() {
    return candyarr[Math.floor(Math.random() * candyarr.length)]
}


module.exports ={
    candy: candy,
   yee: (uname, authorization) => {
        return new Promise((resolve, reject) => {
            accounts.get(uname) 
            .then((doc) => {
                if(doc.authorization == authorization) {
                    if(doc.hasOwnProperty("cooldown")) {
                        if(doc.cooldown+10000>=Date.now()) {
                            var msleft = doc.cooldown+10000-Date.now()
                            resolve({success: true,cooldown: true, msleft: msleft})
                        } else {
                            var candy = random()
                            if(doc.inv.hasOwnProperty(candy.name)) {
                                doc.inv[candy.name] = {amount: doc.inv[candy.name].amount+1}
                            } else {
                                doc.inv[candy.name] = {amount:1}
                            }
                            
                            
                            doc.cooldown = Date.now()
                            accounts.put(doc)
                            .then(() => {
                                resolve({success: true, cooldown:false, candy: candy, amount: 1, inv: doc.inv})
                            })
                        }
                    } else {
                        var candy = random()
        if(doc.inv.hasOwnProperty(candy.name)) {
            doc.inv[candy.name] = {amount: doc.inv[candy.name].amount+1}
        } else {
            doc.inv[candy.name] = {amount:1}
        }
        
        
        doc.cooldown = Date.now()
        
        accounts.put(doc)
        .then(() => {
            resolve({success: true, cooldown:false, candy: candy, amount: 1, inv: doc.inv})
        })
                }
                } else {
                    resolve({success: false, errormsg: "Invalid Authorization"})
                }
            })
            .catch((err) =>{
               //acc not found
               resolve({success: false, errormsg: "This account doesn't exist"})
            })
        })
        }
} 