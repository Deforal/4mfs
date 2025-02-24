function checkLoginStatus() {
    fetch("auth.php")
        .then(response => response.json())
        .then(data => {
            console.log("Auth status:", data);
            if (data.loggedIn) {
                document.getElementById("login-link").innerText = `Welcome, ${data.user.name}`;
                document.getElementById("login-link").href = "PA.html";

                if (data.user.role === "admin") {
                    document.getElementById("admin-panel").style.display = "block";
                }
            } else {
                document.getElementById("login-link").innerText = "Login";
                document.getElementById("admin-panel").style.display = "none";
            }
        })
        .catch(error => console.error("Error checking login status:", error));
}

// Run on page load
document.addEventListener("DOMContentLoaded", checkLoginStatus);
function header() {
    const header = document.querySelectorAll(".header_mass")
    header.forEach(element => {
        let content = `
        <div class="top_else">
            <div class="top__logo">
                <a href="main.html"><img src="img/layer1.svg" alt=""></a>
            </div>
            <nav class="top__nav">
            `
            if (element.dataset.header == "Login") {
                content += `
                <a href="catagories.html" class="top__nav_category">Категории</a>
                `
            } else if (element.dataset.header == "categories") {
                content +=`
                <a href="Login_form.html" class="top__nav_sales">Вход/Регистрация</a>
                `
            } else {
                content +=`
                <a href="catagories.html" class="top__nav_category">Категории</a>
                <a href="Login_form.html" class="top__nav_sales">Вход/Регистрация</a>
                `
            }
        content += `</nav> </div>`
        element.innerHTML += content
    });
}
function footer() {
    const footer = document.querySelectorAll(".footer")
    footer.forEach(element => {
        element.innerHTML += `
        <div class="footer__logo">
        <a href="main.html"><img src="img/layer1.svg" alt=""></a>
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
document.addEventListener('DOMContentLoaded', () => {
    header()
    footer()
})
function sales() {
    fetch('data.php')
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
                    <button class="add_to_cart">В корзину</button>
                </div>
            </div>`
            }) 
        container.innerHTML = htmlInner
        htmlInner += '</section>';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
}
function categories() {
    fetch('data.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(result => {
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
                    if (result[count].Special_price !== null) {
                        htmlInner +=`
                        <div class="item_div">
                            <img src="img/${result[count].Img_name}" alt="" class="item_div__img">
                            <p class="item_name">${result[count].Name}</p>
                            <div class="price_n_button">
                                <div>
                                    <p class="first_price">${result[count].Special_price} руб.</p>
                                    <p class="second_price">${result[count].Price} руб</p>
                                </div>
                                <button class="add_to_cart">В корзину</button>
                            </div>
                        </div>`
                    } else {
                        htmlInner += `
                        <div class="item_div">
                            <img src="img/${result[count].Img_name}" alt="" class="item_div__img">
                            <p class="item_name">${result[count].Name}</p>
                            <div class="price_n_button">
                                <p class="first_price">${result[count].Price} руб.</p>
                                <button class="add_to_cart">В корзину</button>
                            </div>
                        </div>`;
                    }
                }
                count++;
            }
            htmlInner += '</section>'; // Close previous sectio
        });

        htmlInner += '</section>'; // Close the last section
        container.innerHTML = htmlInner;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
}
let price_switch = 1; // 1 for ascending, 0 for descending

function sortByPrice() {
    fetch('data.php')
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
                    <button class="add_to_cart">В корзину</button>
                </div>
            </div>`;
        });
        htmlInner += '</section>'; // Close section
        container.innerHTML = htmlInner;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
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
    fetch("register.php", {
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
    fetch("login.php", {
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
