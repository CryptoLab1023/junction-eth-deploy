pragma solidity ^0.4.20;

contract JunctionContract {
    // アイテムの名前を売り手に紐付ける
    mapping (string => address) private itemNameToSeller;
    mapping (string => uint) private itemToPrice;
    // アイテムを売り手に紐付ける
    mapping (uint => address) private itemToSeller;
    // 履歴をアドレスに買い手紐付け
    mapping (uint => address ) private historyToBuyer;
    // 履歴をアドレスに売り手紐付け
    mapping (uint => address ) private historyToSeller;
    // 売り手の売っている商品の数を返す
    mapping (address => uint) private sellerItemCount;
    // 売り手の履歴の数を返す
    mapping (address => uint) private sellerHistoryCount;
    // 買い手の履歴の数を返す
    mapping (address => uint) private buyerHistoryCount;

    // 履歴の構造体
    struct History {
        string name;
        uint price;
        uint32 amount;
    }

    // 商品の構造体
    struct Item {
        string name;
        uint price;
    }

    // 構造体配列
    History[] histories;
    // 商品配列
    Item[] items;

    // 売れたら起こるイベント
    event SellingSuccessful(address _currentSeller, string _name, uint _price);

    // 売り手側ファンクション
    // アイテムを登録する
    function setItem(string _name, uint _price) external {
        Item memory item = Item(_name, _price);
        items.push(item);
        itemNameToSeller[_name] = msg.sender;
        sellerItemCount[msg.sender]++;
        uint id = items.length - 1;
        itemToSeller[id] = msg.sender;
    }

    // 売り手からアイテムを取得する
    function getItemsFromSeller(address _seller) external constant returns (uint[]) {
        uint[] memory result = new uint[](sellerItemCount[_seller]);
        uint counter = 0;
        for (uint i = 0; i < items.length; i++) {
            if (itemToSeller[i] == _seller) {
                result[counter] = items[i].price;
                counter++;
            }
        }
        return result;
    }

    // 売り手から履歴を取得する
    function getHistoriesFromSeller(address _seller) external constant returns(uint[]) {
        uint[] memory result = new uint[](sellerHistoryCount[_seller]);
        uint counter = 0;
        for (uint i = 0; i < histories.length; i++) {
            if (historyToSeller[i] == _seller) {
                result[counter] = histories[i].price;
                counter++;
            }
        }
        return result;
    }

    // アイテムの売り手を取得する
    function getPrice(string _name) public view returns (uint) {
        return itemToPrice[_name];
    }

    function getAllItems() public view returns (uint[]) {
        uint[] memory result = new uint[](items.length);
        uint counter = 0;
        for (uint i = 0; i < items.length; i++) {
            result[counter] = items[i].price;
            counter++;
        }
        return result;
    }

    // 買い手側ファンクション
    // 買い手から履歴を取得する
    function getHistoriesFromBuyer(address _buyer) external constant returns(uint[]) {
        uint[] memory result = new uint[](buyerHistoryCount[_buyer]);
        uint counter = 0;
        for (uint i = 0; i < histories.length; i++) {
            if (historyToBuyer[i] == _buyer) {
                result[counter] = histories[i].price;
                counter++;
            }
        }
        return result;
    }

    // プライベートなアイテム購入ファンクション
    function _buy(string _name, uint _price, uint32 _amount) private {
        address currentSeller = itemNameToSeller[_name];
        History memory history = History(_name, _price, _amount);
        histories.push(history);
        currentSeller.transfer(_price);
        sellerHistoryCount[currentSeller]++;
        buyerHistoryCount[msg.sender]++;
        uint id = histories.length - 1;
        historyToBuyer[id] = msg.sender;
        historyToSeller[id] = currentSeller;
        SellingSuccessful(currentSeller, _name, _price);
    }

    // バリデーションありの購入パブリックファンクション
    function buy(string _name, uint32 _amount) external payable {
        _buy(_name, msg.value, _amount);
    }


}

