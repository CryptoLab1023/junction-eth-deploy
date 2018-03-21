var express = require('express');
var router = express.Router();
var bignumber = require('bignumber');
var CryptoJs = require('crypto-js');
var Utf8 = require('utf8');
var Web3 = require('web3');
var async = require('async');
var $ = require('jquery');

var url = "http://192.168.99.100:8545";
var user_name;
var web3 = new Web3;
var provider = new web3.providers.HttpProvider(url);
web3.setProvider(provider);

//web3で接続しているか確認
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
// console.log("balance:", balance);

//CounterコントラクトのABI
var ABI = [
    {
        "constant": false,
        "inputs": [],
        "name": "countUp",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCounterName",
        "outputs": [
            {
                "name": "name",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getNumberOfCounter",
        "outputs": [
            {
                "name": "number",
                "type": "uint32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "name",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];

//CounterMasterコントラクトのABI
var masterABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getCounterAddressList",
        "outputs": [
            {
                "name": "counterAddressList",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "bytes32"
            }
        ],
        "name": "addCounter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Counterのアドレスを指定
var master = web3.eth.contract(masterABI).at("0x92715816b5666686e7fdc4d531b5147a3fedae41");
var CounterAddressList = master.getCounterAddressList();

console.log(master);
console.log(CounterAddressList.length);


// ユーザーの名前
var user_name;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',
        {
            title: 'Express',
            content: ""
        }
    );
});

router.post('/login', function (req, res) {

    // console.log(req.body);
    web3.eth.defaultAccount = req.body.params[0];
    // console.log(web3.personal);
    table = "";
    console.log(CounterAddressList.length);
    for (var i = 0; i < CounterAddressList.length; i++) {
        // 対象のコントラクトの取得
        var Counter = web3.eth.contract(ABI).at(CounterAddressList[i]);
        // html編集,table追加,編集 ここから
        var name = web3.toAscii(Counter.getCounterName());
        var number = Counter.getNumberOfCounter();
        var table = table + '<tr><td><input type="radio" name="CounterAddress" value="' + CounterAddressList[i] + '"></td>' +
        '<td>' + name + '</td>' +
        '<td>' + number + '</td></tr>'
        // html編集, table追加, 編集 ここまで
        console.log(table);
    }

    // res.send(table);

    web3.personal.unlockAccount(req.body.params[0], req.body.params[1], req.body.params[2],
        function (error, result) {
            console.log(result);
            // res.render('index', {
            //     'content': table
            // })
            res.send(table);
        }
    );
});

router.post('/post', function (req, res) {
    web3.eth.defaultAccount = req.body.params[0];
    console.log(web3.eth.defaultAccount);
    //対象候補者コントラクトを取得
    var Counter = web3.eth.contract(ABI).at(req.body.params[1]);
    //対象候補者に投票
    Counter.countUp((error, result) => {
        if (!error) {
            console.log(result);
        }
    });
});

router.post('/refresh', function (req, res) {

    // console.log(req.body);
    web3.eth.defaultAccount = req.body.params[0];
    // console.log(web3.personal);
    table = "";
    console.log(CounterAddressList.length);
    for (var i = 0; i < CounterAddressList.length; i++) {
        // 対象のコントラクトの取得
        var Counter = web3.eth.contract(ABI).at(CounterAddressList[i]);
        // html編集,table追加,編集 ここから
        var name = web3.toAscii(Counter.getCounterName());
        var number = Counter.getNumberOfCounter();
        var table = table + '<tr><td><input type="radio" name="CounterAddress" value="' + CounterAddressList[i] + '"></td>' +
        '<td>' + name + '</td>' +
        '<td>' + number + '</td></tr>'
        // html編集, table追加, 編集 ここまで
        console.log(table);
    }
    res.send(table);
});

module.exports = router;
