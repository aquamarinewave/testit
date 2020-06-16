//Запрос  166gu6fGl80R5fo9-Z3HBWDiRMtL_dCq9aDBtlPDeyZM
window.onload = function() {

    let bag = {}; 
    let goods = {};

// save cart
    function localBagFromStorage() {
        if (localStorage.getItem('bag') != undefined) {
            bag = JSON.parse(localStorage.getItem('bag'));
            console.log(bag);
        }
    }

    localBagFromStorage();


    let getJSON = function(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            let status = xhr.status;
            if(status === 200) {
                callback(null, xhr.response)
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }

    // Обработка запроса
    getJSON('https://spreadsheets.google.com/feeds/list/166gu6fGl80R5fo9-Z3HBWDiRMtL_dCq9aDBtlPDeyZM/1/public/full?alt=json', function(err, data) {
        console.log(data);
        if(err !== null) {
            console.log(err);
        } else {
            data = data['feed']['entry'];
            console.log(data);
            goods = arrayHelper(data);
            console.log(goods);
            document.querySelector('.shop-field').innerHTML = showGoods(data);
            showBag();
        }
    });



    function showGoods(data) {
        let out = '';
        for(let i = 0; i < data.length; i++) {
            if (data[i]['gsx$show']['$t'] == 1) {
                out +='<div class="goods">';         
                out +='<h5 class="good-title">' + data[i]['gsx$name']['$t'] + '</h5>';            
                out +='<img class="good-img" src="' + data[i]['gsx$image']['$t'] + '" alt="" width=100px>';             
                out +='<p class="good-price">Price: ' + data[i]['gsx$price']['$t'] + '</p>';             
                out +='<p class="good-description">' + data[i]['gsx$description']['$t'] + '</p>';
                out +='<p class="good-btn-buy"><button class="btn-buy" name="add-to-card" data="' + data[i]['gsx$id']['$t'] + '">BUY</button></p>';         
                out +='</div>'; 
            }     
        }
        return out;
    }

    document.onclick = function(e) {
        console.log(e);
        if (e.target.attributes.name != undefined) {
            if (e.target.attributes.name.nodeValue == 'add-to-card') {
                addToBag(e.target.attributes.data.nodeValue);
            } else if (e.target.attributes.name.nodeValue == 'delete-good') {
                delete bag[e.target.attributes.data.nodeValue];
                showBag();
                localStorage.setItem('bag', JSON.stringify(bag));
            } else if (e.target.attributes.name.nodeValue == 'add-good') {
                bag[e.target.attributes.data.nodeValue]++;
                showBag();
                localStorage.setItem('bag', JSON.stringify(bag));
            } else if (e.target.attributes.name.nodeValue == 'remove-good') {
                if (bag[e.target.attributes.data.nodeValue] > 1) {
                    bag[e.target.attributes.data.nodeValue]--;
                } else {
                    delete bag[e.target.attributes.data.nodeValue];
                }
                showBag();
                localStorage.setItem('bag', JSON.stringify(bag));
            } else if (e.target.attributes.name.nodeValue == 'buy') { 
                // Code for php mail start
                let name = document.getElementById('customer-name').value;
                let email = document.getElementById('customer-email').value;
                let phone = document.getElementById('customer-phone').value;
                getJSON('php mail/mail.php', function(err, data) {
                    console.log(data);
                    if (err !== null) {

                    } else {

                    }
                });
            } else if (e.target.attributes.name.nodeValue == 'catalog-box') {
                showCatalog();
            }
        }
    }

    function addToBag(elem) {
        if(bag[elem] !== undefined) {
            bag[elem]++;
        } else {
            bag[elem] = 1;
        }
        console.log(bag);
        showBag();
        localStorage.setItem('bag', JSON.stringify(bag));
    }

    function arrayHelper(arr) {
        let out = {};
        for (let i = 0; i < arr.length; i++) {
            let temp = {};
            temp['name'] = arr[i]['gsx$name']['$t'];
            temp['image'] = arr[i]['gsx$image']['$t'];
            temp['price'] = arr[i]['gsx$price']['$t'];
            temp['description'] = arr[i]['gsx$description']['$t'];
            temp['show'] = arr[i]['gsx$show']['$t'];
            out[arr[i]['gsx$id']['$t']] = temp;
        }
        return out;
    }

    function showBag() {
        let ul = document.querySelector('.bag-items');
        ul.innerHTML = '';
        let sum = 0;
        for (let key in bag) {
            let divlist = document.createElement('div');
            divlist.setAttribute('class', 'list-items-bag');

            let liList = document.createElement('li');

            let btnDeletGood = document.createElement('i');
            btnDeletGood.setAttribute('class', 'delete-good');
            btnDeletGood.setAttribute('class', 'fas fa-times-circle');
            btnDeletGood.setAttribute('name', 'delete-good');
            btnDeletGood.setAttribute('data', key);
            btnDeletGood.innerHTML = '';

            let btnAddGood = document.createElement('i');
            btnAddGood.setAttribute('class', 'add-good');
            btnAddGood.setAttribute('class', 'fas fa-plus-square');
            btnAddGood.setAttribute('name', 'add-good');
            btnAddGood.setAttribute('data', key);
            btnAddGood.innerHTML = '';

            let btnRemoveGood = document.createElement('i');
            btnRemoveGood.setAttribute('class', 'remove-good');
            btnRemoveGood.setAttribute('class', 'fas fa-minus-square');
            btnRemoveGood.setAttribute('name', 'remove-good');
            btnRemoveGood.setAttribute('data', key);
            btnRemoveGood.innerHTML = '';

            let goodsInBag = document.createElement('div');
            goodsInBag.setAttribute('class', 'good-in-bag');
            goodsInBag.innerHTML = '<a href="#">' + goods[key]['name'] + '</a>';
            liList.append(goodsInBag);

            let imageBag = document.createElement('div');
            imageBag.setAttribute('class', 'image-in-bag');
            imageBag.innerHTML = '<img src="' + goods[key]['image'] + '">';
            liList.append(imageBag);

            let countGoods = document.createElement('div');
            countGoods.setAttribute('class', 'count-goods');
            countGoods.innerHTML =  '<span>' + bag[key] + '</span>';
            countGoods.append(btnAddGood);
            countGoods.prepend(btnRemoveGood);
            liList.append(countGoods);

            let amountGoods = document.createElement('div');
            amountGoods.setAttribute('class', 'amount');
            amountGoods.innerHTML =  goods[key]['price']*bag[key] + ' грн. ';
            amountGoods.append(btnDeletGood);
            liList.append(amountGoods);

            sum += goods[key]['price']*bag[key];
            divlist.append(liList);
            ul.append(divlist);
        }
    
        let totalBag = document.createElement('div');
        totalBag.setAttribute('class', 'total-bag');
        totalBag.innerHTML =  'Всего: ' + sum + " грн.";
        ul.append(totalBag);

        let orderBag = document.createElement('button');
            orderBag.setAttribute('class', 'buy-bag');
            orderBag.setAttribute('name', 'buy-bag');
            orderBag.innerHTML = 'Оформить заказ';
        ul.append(orderBag);
    }

    function showHeaderBag() {
        let bagHeader = document.querySelector('.bag-header-total');
        
        let bagFull = document.querySelector('.total-bag');
        bagHeader.innerHTML = bagFull;
    }
    showHeaderBag();

    function showCatalog() {
        if (document.getElementById('show-catalog').style.display == 'none') {
            document.getElementById('show-catalog').style.display = 'block';
        } else {
            document.getElementById('show-catalog').style.display = 'none';
        }
    }



}