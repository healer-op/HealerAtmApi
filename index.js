const express = require('express')
const {
    readFileSync,
    writeFileSync
} = require('fs');
const fs = require("fs");
const app = express()


const port = process.env.PORT || 3000;

let rep;

app.get("/userCash/:username", async function (req, res) {
    let username = req.params.username;
    let raw = readFileSync('db/database.json', 'utf8');
    let data = JSON.parse(raw);
    let find_Username = data.find(element => element.username == username);
    if (find_Username) {
        rep = [{"response":find_Username.cash}]
        res.send(rep)
    } else {
        rep = [{
            "response": false
        }]
        res.send(rep);
    }

});

app.get("/createUser/:username/:password", async function (req, res) {
    let username = req.params.username;
    let password = req.params.password;
    if (!password) {
        rep = [{
            "response": false
        }]
        res.send(rep);
    } else {
        let raw = readFileSync('db/database.json', 'utf8');
        let data = JSON.parse(raw);
        let findUsername = data.find(element => element.username == username);
        if (!findUsername) {
            let newData = {
                "username": username,
                "password": password,
                "cash": 0
            }
            data.push(newData);
            var newData2 = JSON.stringify(data);
            fs.writeFile("db/database.json", newData2, (err) => {
                // Error checking 
                if (err) throw err;
                rep = [{
                    "response": true
                }]
                res.send(rep);
            });
        } else {
            rep = [{
                "response": false
            }]
            res.send(rep);
        }
    }
});

app.get("/cashUpdate/:username/:cash", async function (req, res) {
    let username = req.params.username;
    let cash = req.params.cash;
    let raw = readFileSync('db/database.json', 'utf8');
    let data = JSON.parse(raw);
    let index = data.findIndex(element => element.username == username);
    let find_Username = data.find(element => element.username == username);
    if (index != -1) {
        let newData = {
            "username": username,
            "password": find_Username.password,
            "cash": cash
        }
        data.splice(index, 1);
        data.push(newData);
        var newData2 = JSON.stringify(data);
        fs.writeFile("db/database.json", newData2, (err) => {
            // Error checking 
            if (err) throw err;
            rep = [{
                "response": true
            }]
            res.send(rep);
        });
    } else {
        rep = [{
            "response": false
        }]
        res.send(rep);
    }

});

app.get("/cashTransfer/:from/:to/:amount", async function (req, res) {
    let from = req.params.from;
    let to = req.params.to;
    let amount = req.params.amount;
    let raw = readFileSync('db/database.json', 'utf8');
    let data = JSON.parse(raw);
    let indexofFrom = data.findIndex(element => element.username == from);
    let indexofTo = data.findIndex(element => element.username == to);
    if(indexofFrom!=-1 && indexofTo!=-1){
        let find_UsernameofFrom = data.find(element => element.username == from);
        let find_Usernameofto = data.find(element => element.username == to);

        fromCash = parseInt(find_UsernameofFrom.cash) - parseInt(amount)
        toCash = parseInt(find_Usernameofto.cash) + parseInt(amount)
        if(fromCash >=0){
            let newDataofFrom = {
                "username":from,
                "password":find_UsernameofFrom.password,
                "cash":`${fromCash}`
            }
            data.splice(indexofFrom, 1);
            data.push(newDataofFrom);
            var newDataforFrom = JSON.stringify(data);
            fs.writeFile("db/database.json", newDataforFrom, (err) => {
                // Error checking 
                if (err) throw err;
            });
            indexofTo = data.findIndex(element => element.username == to);
            if(indexofTo!=-1){
                let newDataofto = {
                    "username":to,
                    "password":find_Usernameofto.password,
                    "cash":`${toCash}`
                }
                data.splice(indexofTo, 1);
                data.push(newDataofto);
            var newDataforto = JSON.stringify(data);
            fs.writeFile("db/database.json", newDataforto, (err) => {
                // Error checking 
                if (err) throw err;
                rep = [{
                    "response": true
                }]
                res.send(rep);
            });
            }
            else{
                rep = [{
                    "response": false
                }]
                res.send(rep);
            }
            

        }
        else{
            rep = [{
                "response": false
            }]
            res.send(rep);
        }
        
    }
    
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('MADE BY HEALER')
})