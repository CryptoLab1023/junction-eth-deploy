var express = require("express");
var router = express.Router();
var bignumber = require("bignumber");
var CryptoJs = require("crypto-js");
var Utf8 = require("utf8");
var Web3 = require("web3");
var solc = require("solc");
var fs = require("fs");
var $ = require("jquery");
var SHA3 = require("sha3");
var util = require("util");
var web3 = new Web3();

if (!web3.currentProvider) {
  web3.setProvider(
    new Web3.providers.HttpProvider("http://192.168.99.100:8545")
  );
} else {
  console.log("error");
  exit;
}

const input = fs.readFileSync("./solidity/Junction.sol", "utf8");
const output = solc.compile(input, 1);
const bytecode = output.contracts[":JunctionContract"].bytecode;
const abi = JSON.parse(output.contracts[":JunctionContract"].interface);
console.log(abi);
// const ABI = JSON.parse(output.contracts[":Counter"].interface);
var master = web3.eth.contract(abi);
var contractNew = master.new(
    {
        from: web3.eth.coinbase,
        data: '0x' + bytecode,
        gas: '4700000'
    }, (error, result) => {
        console.log(error, result);
        if (typeof result.address !== 'undefined') {
            console.log('Contract mined! address: ' + result.address + ' transactionHash: ' + result.transactionHash);
        }
    }
);
// var CounterAddressList = master.getCounterAddressList();

// console.log(master);
// console.log(CounterAddressList.length);

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

    // // console.log(req.body);
    // web3.eth.defaultAccount = req.body.params[0];
    // // console.log(web3.personal);
    // table = "";
    // console.log(CounterAddressList.length);
    // for (var i = 0; i < CounterAddressList.length; i++) {
    //     // 対象のコントラクトの取得
    //     var Counter = web3.eth.contract(ABI).at(CounterAddressList[i]);
    //     // html編集,table追加,編集 ここから
    //     var name = web3.toAscii(Counter.getCounterName());
    //     var number = Counter.getNumberOfCounter();
    //     var table = table + '<tr><td><input type="radio" name="CounterAddress" value="' + CounterAddressList[i] + '"></td>' +
    //     '<td>' + name + '</td>' +
    //     '<td>' + number + '</td></tr>'
    //     // html編集, table追加, 編集 ここまで
    //     console.log(table);
    // }

    // res.send(table);
    web3.personal.unlockAccount(req.body.params[0], req.body.params[1], req.body.params[2],
        function (error, result) {
            console.log(result);
            // res.render('index', {
            //     'content': table
            // })
            // res.send(table);
        }
    );
});

// router.post('/post', function (req, res) {
//     web3.eth.defaultAccount = req.body.params[0];
//     //対象候補者コントラクトを取得
//     var Counter = web3.eth.contract(ABI).at(req.body.params[1]);
//     //対象候補者に投票
//     Counter.countUp((error, result) => {
//         if (!error) {
//             console.log(result);
//         }
//     });
// });



// router.post('/refresh', function (req, res) {
//     web3.eth.defaultAccount = req.body.params[0];
//     console.log(CounterAddressList);
//     table = "";
//     console.log(CounterAddressList.length);
//     for (var i = 0; i < CounterAddressList.length; i++) {
//         // 対象のコントラクトの取得
//         var Counter = web3.eth.contract(ABI).at(CounterAddressList[i]);
//         // html編集,table追加,編集 ここから
//         var name = web3.toAscii(Counter.getCounterName());
//         var number = Counter.getNumberOfCounter();
//         var table = table + '<tr><td><input type="radio" name="CounterAddress" value="' + CounterAddressList[i] + '"></td>' +
//         '<td>' + name + '</td>' +
//         '<td>' + number + '</td></tr>'
//         // html編集, table追加, 編集 ここまで
//         console.log(table);
//     }
//     res.send(table);
// });


router.post('/add', function (req, res) {
    web3.eth.defaultAccount = req.body.params[0];
    var name = req.body.params[1];
    master.setGreeting(name, (error, result) => {
        if (!error) {
            var say = master.say()
            console.log(say);
            res.send(say);
        }
    });
})

router.post('/load', (req, res) => {
    web3.eth.defaultAccout = req.body.params[0];
    var accounts = web3.eth.accounts;
    console.log(accounts);
    res.send(accounts);
})

module.exports = router;
