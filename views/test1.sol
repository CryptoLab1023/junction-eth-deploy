pragma solidity ^0.4.16;
// カウンター管理用Contract
contract CounterMaster {
    //カウンタContractのリスト
    //Contractはアドレスを指定して呼び出す必要があるため
    //アドレスとカウンターContractを対応するためのマップ情報
    mapping(address => Counter) private counters;
    //アドレスを管理する配列
    address[] private addressList;

    //カウンターContractを配列とマップに追加
    function addCounter(bytes32 name) public {
        //カウンターContractを作成
        Counter c = new Counter(name);
        //成配列にアドレスを追加
        addressList.push(address(c));
        // マップにアドレスとカウンターContractを登録
        counters[address(c)] = c;
    }

    //カウンターContractのアドレスリストの取得
    function getCounterAddressList() public constant returns (address[] counterAddressList) {
        counterAddressList = addressList;
    }
}

//カウンターContract
contract Counter {
    //カウンター項目見え
    bytes32 counterName;
    //カウント数
    uint32 numberOfCounter;
    //コンストラクタ (新規作成時にカウンター項目名を設定)
    function Counter(bytes32 name) public {
        counterName = name;
    }
    //カウントアップ
    function countUp() public {
        numberOfCounter++;
    }
    //カウンター項目名の取得
    function getCounterName() public constant returns (bytes32 name) {
        return counterName;
    }
    //カウント数の取得
    function getNumberOfCounter() public constant returns(uint32 number) {
        return numberOfCounter;
    }
}
