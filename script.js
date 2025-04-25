"use strict";
let logg
function checkAuthStatus() {
    return fetch("./php/auth.php")
    .then(response => response.json())
    .then(data => {
        console.log("Auth status:", data);
        if (data.loggedIn) {
            logg = "user";
            if (data.user.role == "1") {
                logg = "admin"
            }
        }
    })
    .catch(error => console.error("Error checking login status:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("[data-PA='personal']")) {
        PA_info();
        renderCart();
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => showForm(button.dataset.field));
        });
    }  
});
function PA_info() {
    fetch("./php/auth.php")
    .then(response => response.json())
    .then(data => {
        console.log("Auth status:", data);
        if (data.loggedIn) {
            document.getElementById("userName").textContent = data.user.name;
            document.getElementById("username").textContent = data.user.name;
            document.getElementById("userEmail").textContent = data.user.email;
            const phone = document.getElementById("userPhone");
            data.user.phone ? phone.textContent = data.user.phone : phone.textContent = "Номера телефона не прикреплен"
            if (data.user.role == "1") {
                document.getElementById("adminPanel").classList.remove("hidden");
                showAdminPanel();
            }
        }
    })
    .catch(error => console.error("Error checking login status:", error));
}
function showForm(field) {
    let fieldSpan = document.getElementById(`user${field}`);
    if (!fieldSpan) return;

    let currentValue = fieldSpan.textContent.trim();
    let formContainer = fieldSpan.parentElement;
    
    formContainer.innerHTML = `
        <span id="user${field}">
            <input class="PA__top_input" type="text" id="new${field}" value="${currentValue == "Номера телефона не прикреплен" ? "" : currentValue}" maxlength="${field == "Name" ? "20" : field == "Phone" ? "13" : ""}">
        </span>
        <button class="PA__top_edit" onclick="updateUser('${field}')">Сохранить</button>
        <button class="PA__top_edit" onclick="cancelEdit('${field}', '${currentValue}')">Отмена</button>
    `;
}

function cancelEdit(field, originalValue) {
    let formContainer = document.getElementById(`user${field}`).parentElement;
    let string = "";
    if (field == "Email") {
        string += "Ваша почта:"
    } else if (field == "Phone") {
        string += "Телефон: "
    } else {
        string += "Ваше имя: "
    }
    string += `
        <span id="user${field}">${originalValue}</span> 
        <button class="edit-btn PA__top_edit" data-field="${field}">изменить</button>
    `;
    formContainer.innerHTML = string;
    if (field == "Name") {
        document.getElementById("username").innerHTML = originalValue
    }
    formContainer.querySelector(".edit-btn").addEventListener("click", () => showForm(field));
}

function updateUser(field) {
    let inputField = document.getElementById(`new${field}`);
    if (!inputField) {return;}

    let newValue = inputField.value.trim();
    if (!newValue) {
        alert("Поле не может быть пустым.");
        return;
    }

    fetch("./php/update_user.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ field: field, value: newValue })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cancelEdit(field, data.newValue); // Update UI with new value
            alert("Данные изменены!")
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error("Ошибка:", error);
        alert("Произошла ошибка. Попробуйте еще раз.");
    });
}

function showAdminPanel() {
    fetch("./php/data.php")
        .then(response => response.json())
        .then(products => {
            const adminPanel = document.getElementById("adminPanel");
            adminPanel.innerHTML = `
                <h2>Админ панель</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Особая цена</th>
                            <th>Цена</th>
                            <th>Описание</th>
                            <th>Категория</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody"></tbody>
                </table>
                <button onclick="addProduct()">Добавить товар</button>
            `;

            const tableBody = document.getElementById("productTableBody");

            products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td contenteditable="true" onblur="editProduct(${product.id}, 'Name', this)">${product.Name}</td>
                    <td contenteditable="true" onblur="editProduct(${product.id}, 'Special_price', this)">
                        ${product.Special_price ? product.Special_price : "No sale"}
                    </td>
                    <td contenteditable="true" onblur="editProduct(${product.id}, 'Price', this)">${product.Price}</td>
                    <td contenteditable="true" onblur="editProduct(${product.id}, 'Desciption', this)">${product.Desciption}</td>
                    <td contenteditable="true" onblur="editProduct(${product.id}, 'Category', this)">${product.Category}</td>
                    <td>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            adminPanel.classList.remove("hidden");
        })
        .catch(error => console.error("Error fetching products:", error));
}

function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch("./php/delete_product.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Product deleted");
            showAdminPanel();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error deleting product:", error));
}

function addProduct() {
    const name = prompt("Enter product name:");
    if (!name) return;

    const specialPrice = prompt("Enter special price (leave empty for no sale):");
    const price = prompt("Enter price:");
    if (!price || isNaN(price)) {
        alert("Invalid price.");
        return;
    }

    const desc = prompt("Enter description:");
    const category = prompt("Enter category:");

    fetch("./php/add_product.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            special_price: specialPrice || null,
            price: parseFloat(price),
            desc: desc,
            category: category
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Product added");
            showAdminPanel();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error adding product:", error));
}


function editProduct(id, field, element) {
    const newValue = element.textContent.trim();

    fetch("./php/edit_product.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value: newValue })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error editing product:", data.error);
            alert("Ошибка: " + data.error);
        } else {
            console.log("Product updated:", data.success);
        }
    })
    .catch(error => console.error("Fetch error:", error));
}

function header() {
    const header = document.querySelector("header")
    if (header.classList == "header") {
        header.innerHTML = `<div class="top">
        <div class="top__logo">
            <a href="index.html"><img src="img/layer1.svg" alt=""></a>
        </div>
        <nav class="top__nav">
            <a href="catagories.html" class="top__nav_category">Категории</a>
            <a href="${logg ? "PA.html" : "Login_form.html"}" class="top__nav_sales">
                ${logg ? "Личный кабинет" : "Вход/Регистрация"}
            </a>
        </nav>
        </div>`
    } else {
        let content = `
        <div class="top_else">
            <div class="top__logo">
                <a href="index.html"><img src="img/layer1.svg" alt=""></a>
            </div>
            <nav class="top__nav">
            `
            if (header.dataset.header == "Login") {
                content += `
                <a href="catagories.html" class="top__nav_category">Категории</a>
                `
            } else if (header.dataset.header == "categories") {
                content +=`
                <a href="${logg ? "PA.html" : "Login_form.html"}" class="top__nav_sales">
                ${logg ? "Личный кабинет" : "Вход/регистрация"}
                </a>
                `
            }  else {
                content +=`
                <a href="catagories.html" class="top__nav_category">Категории</a>
                <a href="${logg ? "PA.html" : "Login_form.html"}" class="top__nav_sales">
                    ${logg ? "Личный кабинет" : "Вход/Регистрация"}
                </a>
                `
            }
            
        content += `</nav> </div>`
        header.innerHTML += content
    }
    
}
function footer() {
    const footer = document.querySelectorAll(".footer")
    footer.forEach(element => {
        element.innerHTML += `
        <div class="footer__logo">
        <a href="index.html"><img src="img/layer1.svg" alt=""></a>
        </div>
        <nav class="footer__nav">
            <div class="footer__nav_links">
                <a href="manufactors.html">Производители</a>
                <a href="delivery.html">Доставка</a>
                <a href="payment.html">Оплата</a>
                <a href="contacts.html">Обратная связь</a>
            </div>
            <p>г.Иркутск, ул. Баррикад, д. 147 Телефон: (8924) 70-11-548  e-mail: epikego@mail.ru</p>
        </nav>`
    });
}

checkAuthStatus().then(() => {
    header();
    footer();
})
function change_button(id, element) {
    const button = document.querySelector(`[data-itemid="${id}"]`)
    if (element) {
        if (element.place =="cart") {
            console.log("cart_start");
            const amount = button.querySelector(".cart__item_left_amount")
            const column = amount.parentElement
            const price = column.querySelector(".cart__item_overall")
            price.innerHTML = `Итого: ${price.dataset.price * element.Count} руб.`
            amount.outerHTML = `
            <div class="cart__item_left_amount">
                <button class="increase" data-itemid = "${id}">▲</button>
                <p><i class="cart__item_left_i">Количество: ${element.Count}</i></p>
                <button class=${element.Count == 1 ? `"disabled_decrease" disabled` : "decrease"} data-itemid = "${id}">▼</button> 
            </div>
            `
        } else {
            button.outerHTML = `
            <div class="item_div__amount" data-itemid="${id}" data-itemType="div">
                <img src="./img/trash_can.svg" alt="" onclick=delete_itemCart(${id})>
                <div class="item_div__amount_div">Добавлено: ${element.Count}</div>
                <div class="add_to_cart__amount">
                    <button class="increase" data-itemid = "${id}">▲</button>
                    <button class=${element.Count == 1 ? `"disabled_decrease" disabled` : "decrease"} data-itemid = "${id}">▼</button>  
                </div>
            </div>
            `; 
        }
       
    } else {
        button.outerHTML = `<button class="add_to_cart" data-itemid = "${id}">В корзину</button>`;
    }
    
}
function change_amount(id, object) {
    let div = 0;
    div = document?.querySelector(`[data-itemid="${id}"]`)
    if (object.place == "cart") {
        const amount = div.querySelector(".cart__item_left_i")
        amount.innerHTML = `Количество: ${object.Count}` 
        const column = amount.parentElement.parentElement.parentElement
        const price = column.querySelector(".cart__item_overall")
        price.innerHTML = `Итого: ${price.dataset.price * object.Count} руб.`
    } else {
        const amount = div.querySelector(".item_div__amount_div")
        amount.innerHTML = `Добавлено: ${object.Count}` 
    }
    
    
}
function addToCart() {
    fetch("./php/get_cart.php")
    .then(response => response.json())
    .then(data => {
        const cartMap = new Map();
        data.data.forEach(item => {
            cartMap.set(String(item.Product_id), item);
        });
        const itemDivs = document.querySelectorAll(".item_div");
        itemDivs.forEach(div => {
            const buttonEl = div.querySelector("[data-itemid]");
            const itemId = buttonEl?.dataset.itemid;
            if (itemId && cartMap.has(itemId)) {
                change_button(itemId, cartMap.get(itemId));
            }
        });
    })
    .catch(error => {
        console.log(error);
    })
    // const button = document.querySelector(`.add_to_cart[data-itemid="${id}"]`);
}
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("categories__grid")) {
        document.getElementById("categories__grid").addEventListener("click", function (e) {
            IncrDecr(e, "categories")
        });
    } 
    if (document.getElementById("cart")) {
        document.getElementById("cart").addEventListener("click", function (e) {
            IncrDecr(e, "cart")
        });
    } 

    
})
function IncrDecr(e, place) {
    const addBtn = e.target.closest(".add_to_cart");
    const increaseBtn = e.target.closest(".increase");
    const decreaseBtn = e.target.closest(".decrease");
    if (addBtn || increaseBtn) {
        const id = parseInt(addBtn?.dataset.itemid || increaseBtn?.dataset.itemid, 10);
        if (logg) {
            fetch("./php/add_offer.php", {
                method: "POST",
                headers: {"Content-Type":"application/JSON"},
                body: JSON.stringify(id)
            })
            .then(response => response.json())
            .then(data => {
                const object = {}
                if (data.data.Count <= 2) {
                    object.Count = data.data.Count
                    object.place = place
                    change_button(id, object)
                } else {
                    object.Count = data.data.Count
                    object.place = place
                    change_amount(id, object)
                }
            })
            .catch(error => {
                console.log("Error: " + error);
            })
        } else {
            console.log("Нужно войти");
        }
        return;
    }

    if (decreaseBtn) {
        const id = Number(decreaseBtn.dataset.itemid)
        fetch("./php/decrease_amount.php", {
            method: "POST",
            headers: {"Content-Type":"application/JSON"},
            body: JSON.stringify(id)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const object = {}
                if (data.data.Count == 1) {
                    object.Count = data.data.Count
                    object.place = place
                    change_button(id, object)
                } else {
                    object.Count = data.data.Count
                    object.place = place
                    change_amount(id, object)
                }
            } else {
                console.log(data.error);
            }
        })
        .catch(error => {
            console.log("Error: " + error);
        })
        return;
    }
}

async function renderCart() {
    try {
        const response = await fetch("./php/get_cart.php");
        if (!response.ok) {
            console.log("Response wasn't okay: " + response.statusText);
            return;
        }
        const cartData = await response.json();

        const response1 = await fetch("./php/data.php");
        if (!response1.ok) {
            console.log("Response wasn't okay: " + response1.statusText);
            return;
        }
        const productsData = await response1.json();

        let productCount = {};
        cartData.data.forEach(cartItem => {
            const id = cartItem.Product_id;
            productCount[id] = cartItem.Count;
        });
        
        // Step 2: Filter unique products from productsData
        let matchedProducts = productsData
            .filter(product => productCount[product.id]) // Keep only those in the cart
            .map(product => ({
                ...product, // Keep product details
                count: productCount[product.id] // Attach count from cart
            }));
        let htmlInner = "";
        matchedProducts.forEach(item => {
            htmlInner += `
            <div class="cart__item" data-cartProduct = "${item.id}">
                <div class="cart__item_left">
                    <img src="./img/${item.Img_name}" alt="${item.Name}">
                    <div class="cart__item_left_column" data-itemid = "${item.id}">
                        <p>Название: ${item.Name}</p>
                        <p>Цена: ${item.Special_price || item.Price} руб.</p>
                        <div class="cart__item_left_amount">
                            <button class="increase" data-itemid = "${item.id}">▲</button>
                            <p><i class="cart__item_left_i">Количество: ${item.count}</i></p>
                            <button class=${item.count == 1 ? `"disabled_decrease" disabled` : "decrease"} data-itemid = "${item.id}">▼</button> 
                        </div>
                        <p class="cart__item_overall" data-price="${item.Special_price || item.Price}">Итого: ${item.count * (item.Special_price || item.Price)} руб.</p>
                    </div>
                </div>
                <div class="cart__item_right">
                    <p class="cart__item_description">Описание: ${item.Description || "Описание товара отсутствует"}</p>
                    <div class="cart__item_order">
                        <button onclick=orderCart(${item.id})>Заказать</button>
                        <button onclick=delete_itemCart(${item.id})>Удалить</button>
                    </div>
                    
                </div>
            </div>`
        })
        const cartDiv = document.querySelector(".cart");
        cartDiv.innerHTML = htmlInner;
        
    } catch (error) {
        console.log("Error: " + error);
    }
}

async function orderCart(id) {
    try {
        const ordering = await fetch("./php/order_cart.php", {
            method: "POST",
            headers: {"Content-Type":"application/JSON"},
            body: JSON.stringify(id)
        })
        const success = await ordering.json();
        success.success == true ? alert("Заказ оформлен") : alert(success.error)
        renderCart();
    } catch (error) {
        console.log("Error" + error);
    }
}

async function delete_itemCart(id) {
    try {
        let post;
        id == "all" ? post = "all" : post = id;
        const ordering = await fetch("./php/delete_itemCart.php", {
            method: "POST",
            headers: {"Content-Type":"application/JSON"},
            body: JSON.stringify(post)
        })
        const success = await ordering.json();
        if(document.querySelector('[data-PA ="cart"]')) {
            renderCart(); 
        } else {
            change_button(id)
            addToCart()
        }
    } catch (error) {
        console.log("Error" + error);
    }
}
    
function sales() {
    fetch('./php/data.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(result => {
        const container = document.getElementById('categories__grid');
        let htmlInner = '';
        htmlInner += '<section class="categories__grid bottom_margin_123px center">';
        const filteredData = result.filter(item => item.Special_price != null)
        filteredData.forEach(item => {
        htmlInner += `
            <div class="item_div">
                <img src="img/${item.Img_name}" alt="" class="item_div__img">
                <p class="item_name">${item.Name}</p>
                <div class="price_n_button">
                    <div>
                        <p class="first_price">${item.Special_price} руб.</p>
                        <p class="second_price">${item.Price} руб</p>
                    </div>
                    <button class="add_to_cart" data-itemid = "${item.id}">В корзину</button>
                </div>
            </div>`
            }) 
        container.innerHTML = htmlInner
        htmlInner += '</section>';
        addToCart();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
}
function categories() {
    fetch('./php/data.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(result => {
        console.log(result);
        const container = document.getElementById('categories__grid');
        let htmlInner = '';
        let currentCategory = '';
        let count = 0;
        let array = []
        while (count < result.length - 1) {
            if (array.includes(result[count].Category)) {
                count++
            }  else {
                array.push(result[count].Category)
                count++
            }  
        }
        array.splice([array.indexOf("")], 1)
        console.log(array)
        array.forEach(item => {
            count = 0
            htmlInner += `<h2 class="categories__section_header center" id="${item}_categories">${item}</h2>`;
            htmlInner += '<section class="categories__grid bottom_margin_123px center">'; // Start new section
            while (count < result.length - 1) {
                if (item == result[count].Category) {
                    htmlInner +=`
                    <div class="item_div">
                        <img src="img/${result[count].Img_name}" alt="" class="item_div__img">
                        <p class="item_name">${result[count].Name}</p>
                    <div class="price_n_button">`;
                    if (result[count].Special_price !== null) {
                        htmlInner += `<div>
                            <p class="first_price">${result[count].Special_price} руб.</p>
                            <p class="second_price">${result[count].Price} руб</p>
                        </div> `;
                    } else {
                        htmlInner += `<p class="first_price">${result[count].Price} руб.</p>`;
                    }
                    htmlInner +=`<button class="add_to_cart" data-itemid = "${result[count].id}">В корзину</button>
                    </div>
                    </div>`;
                }
                count++;
            }
            htmlInner += '</section>'; // Close previous sectio
        });

        htmlInner += '</section>'; // Close the last section
        container.innerHTML = htmlInner;
        addToCart();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
}
let price_switch = 1; // 1 for ascending, 0 for descending

function sortByPrice() {
    fetch('./php/data.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(items => {
        // Determine the price to sort by (Special_price or Price)
        items.forEach(item => {
            item.sortPrice = item.Special_price !== null ? item.Special_price : item.Price;
        });

        // Sort items based on the current price_switch value
        items.sort((a, b) => {
            return price_switch === 1 ? a.sortPrice - b.sortPrice : b.sortPrice - a.sortPrice;
        });
        //If a.sortPrice < b.sortPrice, a stays before b, therefore if we want the opposite, we flip a and b like after :
        // Toggle the price_switch for the next click
        price_switch = price_switch === 1 ? 0 : 1;

        // Build HTML to display sorted items
        const container = document.getElementById('categories__grid');
        let htmlInner = '<section class="categories__grid bottom_margin_123px center">'; // Start new section
        items.forEach(item => {
            htmlInner += `
            <div class="item_div">
                <img src="img/${item.Img_name}" alt="" class="item_div__img">
                <p class="item_name">${item.Name}</p>
                <div class="price_n_button">
                    <div>
                        <p class="first_price">${item.Special_price !== null ? item.Special_price : item.Price} руб.</p>
                        ${item.Special_price !== null ? `<p class="second_price">${item.Price} руб</p>` : ''}
                    </div>
                    <button class="add_to_cart" data-itemid = "${item.id}">В корзину</button>
                </div>
            </div>`;
        });
        htmlInner += '</section>'; // Close section
        container.innerHTML = htmlInner;
        addToCart();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("[data-form='log_reg']")) {
        reg_form();
        log_form();
    }
})
function reg_form() {
    document.getElementById("reg_form").addEventListener('submit', function(event) {
    event.preventDefault()
    const fields = document.querySelectorAll ('[data-register]')
    const Allfields = {}
    const element = document.querySelector(".form_error")
    fields.forEach(field => {
        if (field.value == '') {
            field.style.backgroundColor = "rgba(255, 0, 0, 0.452)"
            return;
        } else {
            Allfields[field.dataset.register] = field.value
            field.style.backgroundColor = ""
            
        }
    })

    if (Allfields.Rpassword !== Allfields.password) {
        element.style.display = "block"
        element.textContent = "Пароли не совпадают"
        return;
    } else {
        element.style.display = "none"
    }
    delete Allfields.Rpassword;
    fetch("./php/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Allfields)
    })
    .then(response => response.json()) 
    .then(data => {
        let jsonData = data;
        console.log(jsonData);
        if (jsonData.success) {
            element.style.display = "none";
            alert(jsonData.success); 
            window.location.href = "PA.html"
        } else {
            element.style.display = "block";
            element.textContent = jsonData.error;
        }
    })
        .catch(error => console.error("Error:", error));
    })
}

function log_form() {
    document.getElementById("log_form").addEventListener('submit', function(event) {
    event.preventDefault()
    const fields = document.querySelectorAll ('[data-login]')
    const Allfields = {}
    const element = document.querySelectorAll(".form_error")[1]
    fields.forEach(field => {
        if (field.value == '') {
            field.style.backgroundColor = "rgba(255, 0, 0, 0.452)"
            return;
        } else {
            Allfields[field.dataset.login] = field.value
            field.style.backgroundColor = ""
            
        }
    })
    console.log(Allfields);
    fetch("./php/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Allfields)
    })
    .then(response => response.json()) 
    .then(data => {
        let jsonData = data;
        console.log(jsonData);
        if (jsonData.success) {
            element.style.display = "none";
            alert(jsonData.success); 
            window.location.href = "PA.html"
        } else {
            element.style.display = "block";
            element.textContent = jsonData.error;
        }
    })
        .catch(error => console.error("Error:", error));
    })
}

