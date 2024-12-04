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
if (localStorage.getItem("LoggedIn") == "true") {
    const reg_links = document.querySelectorAll(".registration-link")
    reg_links.forEach(element => {
        element.innerHTML = "Профиль"
});
}
function Login_form() {
    if (localStorage.getItem("LoggedIn") == "true") {
        const reg_main = document.getElementById("reg__main")
        reg_main.innerHTML = ` 
        
        
        `
    } else {
        if (localStorage.getItem("LoggedIn") == "reg") {
            const reg_main = document.getElementById("reg__main")
            reg_main.innerHTML = `
            <form action="register.php" method="post" class="reg__form center" id="reg_form">
            <h2 class="payment_header center">Регистрация</h2> 
            <p class="name_of_textbox center">E-mail:</p>
            <input type="email" name="email" class="contacts_textbox" placeholder="example@mail.ru" required>
            <p class="name_of_textbox center">Имя пользователя:</p>
            <input type="text" name="username" class="contacts_textbox" placeholder="Имя пользователя" required>
            <p class="name_of_textbox center">Пароль:</p>
            <input type="password" name="password" class="contacts_textbox" required>
            <p class="name_of_textbox center">Подтверждение пароля:</p>
            <input type="password" name="confirm_password" class="contacts_textbox" required>
            <button type="submit" class="contacts_submit">Отправить</button>
            <a href="" class="reg__a" onclick="localStorage.setItem('LoggedIn', 'log')">Зарегестрироваться</a>
            </form>
            `
        } else {
            const reg_main = document.getElementById("reg__main")
            reg_main.innerHTML = `
            <form action="register.php" method="post" class="reg__form center" id="reg_form">
            <h2 class="payment_header center">Вход</h2> 
            <p class="name_of_textbox center">Логин:</p>
            <input type="pas" name="" class="contacts_textbox" placeholder="E-mail или имя пользователя">
            <p class="name_of_textbox center">Пароль:</p>
            <input type="password" name="" class="contacts_textbox">
            <button type="submit" class="contacts_submit">Отправить</button>
            <a href="" class="reg__a" onclick="localStorage.setItem('LoggedIn', 'reg')">Войти</a>
            </form>
            `
        }
    }
}
document.getElementById('reg_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const email = document.querySelector('input[name="email"]').value.trim();
    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value.trim();

    // Validate form fields
    if (!email || !username || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Prepare data to be sent
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);

    // Send data to PHP script using fetch API
    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registration successful!");
            localStorage.setItem("LoggedIn", "true")
            // const registrationLink = document.querySelectorAll('.registration-link');
            // registrationLink.forEach(element => {
            //     if (element) {
            //         element.href = 'new_link.html'; // Replace with your desired link
            //         element.textContent = 'New Link Text'; // Optionally change the link text
            //     }
            // });
            
            // Optionally redirect to another page
            window.location.href = 'main.html';
        } else {
            alert("Registration failed: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error with the registration.");
    });
});