var express = require('express');
var router = express.Router();
var bignumber = require('bignumber');
var CryptoJs = require('crypto-js');
var Utf8 = require('utf8');
var Web3 = require('web3');
var $ = require('jquery');

var url = "http://192.168.99.100:8545";
var user_name;
var web3 = new Web3;
var provider = new web3.providers.HttpProvider(url);
web3.setProvider(provider);
web3.eth.defaultAccount = web3.eth.accounts[0];

//web3で接続しているか確認
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
console.log("balance:", balance);


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

var master = web3.eth.contract(masterABI).at("0x112a8e4952469e16af20a35faf5a88bc5e207290");
var CounterAddressList = master.getCounterAddressList();
// console.log(master);
// console.log(CounterAddressList);

var user_name = 

//初期処理
function init() {
    web3.eth.defaultAccount = user_name;
    var table = document.getElementById('list');
    for (var i = 0; i < CounterAddressList.length; i++) {
        //対象のコントラクトの取得
        var Counter = web3.eth.contract(ABI).at(CounterAddressList[i]);
        // html編集,table追加,編集 ここから
        var row = table.insertRow();
        var td = row.insertCell(0);
        var radioButton1 = document.createElement('input');
        radioButton1.type = 'radio';
        radioButton1.name = 'CounterAddress';
        radioButton1.value = CounterAddressList[i];
        td.appendChild(radioButton1);
        td = row.insertCell(1);
        td.innerHTML = web3.toAscii(Counter.getCounterName());
        td = row.insertCell(2);
        td.innerHTML = Counter.getNumberOfCounter();
        // html編集, table追加, 編集 ここまで
    }
}

//更新
function refresh() {
    web3.eth.defaultAccount = user_name;
    //html編集table行の削除ここから
    var table = document.getElementById('list');
    for (var i = CounterAddressList.length; i > 0; i--) {
        table.deleteRow(i);
    }
    //html編集table行の削除ここまで
    init();
}

//カウントアップ
function countUp() {
    web3.eth.defaultAccount = user_name;
    var targetAddress;
    var CounterList = document.getElementsByName("CounterAddress");
    for (i = 0; i < CounterList.length; i++) {
        if (CounterList[i].checked) {
            //対象の候補者コントラクトアドレスを取得
            targetAddress = CounterList[i].value;
        }
    }
    //対象候補者コントラクトを取得
    var Counter = web3.eth.contract(ABI).at(targetAddress);
    //対象候補者に投票
    Counter.countUp();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(err, req, res){
	var obj = {};
	console.log('body: ' + JSON.stringify(req.data));
	res.send(req.body);
});

module.exports = router;
