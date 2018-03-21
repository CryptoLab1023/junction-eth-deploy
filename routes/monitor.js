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
// console.log(master);
// console.log(CounterAddressList.length);

// ユーザーの名前
var user_name;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('monitor');
});

router.post('/post', function (req, res) {

    web3.eth.defaultAccount = web3.eth.accounts[0];

    // var startBlockNo = web3.eth.blockNumber - 20;
    // var i = startBlockNo;
    // var insert = function() {
    //     for (; i <= web3.eth.blockNumber; i++) {
    //         var result = web3.eth.getBlock(i);
    //         insertBlockRow(result, i)
    //             .then(insertTranRow(result.transactions, row), function(){console.log("insert失敗")})
    //     }
    // }
    // insert().then(
    //     function () {
    //         res.send(row);
    //     },
    //     function () {
    //         console.log("row失敗")
    //     }
    // )

    //行追加
    var row = "";
    for (var i = 0; i < web3.eth.blockNumber; i++) {
        var result = web3.eth.getBlock(i);
        row = row + "<tr><td>" + result.number + "</td>" +
        "<td>" + new Date(result.timestamp * 1000).toString() + "</td>" +
        "<td>" + result.hash + "</td>" +
            "<td>" + result.nonce + "</td></tr>";
        allData = "";
        for (var j = 0; j < result.transactions.length; j++){
            var data = web3.eth.getTransaction(result.transactions[j]);
            allData += JSON.stringify(data);
        }
        row = row + "<input type='text' value='" + allData + "' /></td>";
    }
    res.send(row);

    //行追加 トランザクション情報編集
    // function insertTranRow(transactions, row) {
    //     var allData = "";
    //
    // }
});


module.exports = router;
