/* Sweet Creations By Soso */

// This script handles the shopping cart, checkout, product search and sort, user accounts, and form submissions for the Sweet Creations By Soso website. It uses localStorage to persist data across page reloads and provides user feedback through notifications.
(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector); //using the $ to select an HTML element
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)]; //using the $$ to select multiple HTML elements and return them as an array


  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback; // this lines takes stored JSON data and makes it usable in JavaScript. If the data is not found, it returns a fallback value.
    } catch {    
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const money = value => `R${Number(value).toFixed(2)}`;

  function notify(message) {
    let box = $('#siteNotice');

    if (!box) {
      box = document.createElement('div');
      box.id = 'siteNotice';
      box.setAttribute('role', 'status');
      box.style.cssText =
        'position:fixed;right:20px;bottom:20px;z-index:9999;background:#5a332e;color:#fff;padding:13px 18px;border-radius:10px;box-shadow:0 4px 18px #0002;max-width:320px'; // this line sets the style of the notification box, including its position, color, padding, border radius, and shadow.
      document.body.appendChild(box);
    }

    box.textContent = message; // this line sets the text content of the notification box to the message passed to the notify function.
    box.style.display = 'block';
    clearTimeout(window.noticeTimer);
    window.noticeTimer = setTimeout(() => {
      box.style.display = 'none';
    }, 3000);
  }

  window.addToCart = (name, price) => { // this function adds a product to the shopping cart. It takes the product name and price as parameters.
    price = Number(price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      notify('This product could not be added. Please try again.');
      return;
    }

    const cart = read('sosoCart', []);
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    write('sosoCart', cart); // this line saves the updated cart back to localStorage, ensuring that the changes persist across page reloads.
    updateCartCount();
    notify(`${name} added to your cart.`);
  };

  function updateCartCount() {
    const count = read('sosoCart', []).reduce(
      (sum, item) => sum + item.quantity, // this line calculates the total number of items in the cart by summing up the quantity of each item. It uses the reduce method to iterate through the cart array and accumulate the total quantity.
      0
    );

    $$('a[href="cart.html"]').forEach(link => { // this line selects all anchor elements that link to the cart page and iterates over them using forEach. It allows the function to update the cart count display on multiple links if they exist on the page.
      if (!link.dataset.originalCartLabel) {
        link.dataset.originalCartLabel = link.textContent.trim();
      }

      const label = link.dataset.originalCartLabel.replace(/\s*\(\d+\)$/, '');
      link.textContent = `${label} (${count})`;
    });
  }

  function renderCart() {
    const container = $('.cart-container');
    if (!container) return;

    const cart = read('sosoCart', []);
    container.innerHTML = '';

    if (!cart.length) {
      container.innerHTML =
        '<div class="cart-empty" style="text-align:center;padding:35px"><h2>Your cart is empty \u{1F36A}</h2><p>Add some freshly baked treats to get started.</p><a class="cart-btn" href="products.html">Browse Products</a></div>'; // this line sets the inner HTML of the cart container to display a message indicating that the cart is empty. It includes a heading, a paragraph, and a link to browse products. The Unicode character \u{1F36A} represents a cookie emoji, adding a visual element to the message.
      return;
    }

    
    const items = document.createElement('div'); // this line creates a new div element to hold the cart items. It will be used to dynamically generate and display the list of products in the cart.
    items.className = 'cart-items';

    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const details = document.createElement('div');
      details.className = 'item-details';

      const title = document.createElement('h2');
      title.textContent = item.name;

      const price = document.createElement('p');
      price.textContent = `${money(item.price)} each`;
      details.append(title, price);

      const quantity = document.createElement('div');
      quantity.className = 'quantity';

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '\u2212';
      minus.setAttribute('aria-label', `Decrease ${item.name} quantity`);
      minus.onclick = () => changeQuantity(index, -1);

      const qty = document.createElement('span');
      qty.textContent = item.quantity;

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.setAttribute('aria-label', `Increase ${item.name} quantity`);
      plus.onclick = () => changeQuantity(index, 1);
      quantity.append(minus, qty, plus);

      const total = document.createElement('strong');
      total.className = 'item-total';
      total.textContent = money(item.price * item.quantity);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.className = 'cart-btn';
      remove.style.cssText = 'padding:8px 12px';
      remove.onclick = () => {
        const current = read('sosoCart', []);
        current.splice(index, 1);
        write('sosoCart', current);
        renderCart();
        updateCartCount();
      };

      row.append(details, quantity, total, remove);
      items.append(row);
    });

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const summary = document.createElement('div'); // this line creates a new div element to hold the cart summary, which includes the total price and action buttons. It will be used to display the overall cost of the items in the cart and provide options for proceeding to checkout or continuing shopping.
    summary.className = 'cart-summary';
    summary.innerHTML = `<p class="total-line"><span>Total</span> <strong>${money(total)}</strong></p><div class="cart-buttons"><button type="button" class="cart-btn" id="checkoutButton">Proceed to Checkout</button><a href="products.html" class="cart-btn">Continue Shopping</a></div>`;

    container.append(items, summary);

    $('#checkoutButton').addEventListener('click', () => {
      location.href = 'checkout.html';
    });
  }

  function renderCheckout() {
    const itemsContainer = $('#checkoutItems');
    const checkoutForm = $('#checkoutForm');
    if (!itemsContainer || !checkoutForm) return;

    const cart = read('sosoCart', []);
    itemsContainer.innerHTML = '';
    const placeOrderButton = $('#placeOrderButton');

    if (!cart.length) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'checkout-empty';
      emptyMessage.textContent = 'Your cart is empty. ';

      const productsLink = document.createElement('a');
      productsLink.href = 'products.html';
      productsLink.textContent = 'Browse our treats';
      emptyMessage.append(productsLink);
      itemsContainer.append(emptyMessage);
      $('#checkoutTotal').textContent = money(0);
      checkoutForm.hidden = true;
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'checkout-item';

      const description = document.createElement('span');
      description.textContent = `${item.name} × ${item.quantity}`;

      const price = document.createElement('strong');
      price.textContent = money(item.price * item.quantity);
      row.append(description, price);
      itemsContainer.append(row);
    });

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    $('#checkoutTotal').textContent = money(total);
    checkoutForm.hidden = false;
    placeOrderButton.disabled = false;

    const user = read('sosoUser', null);
    if (user) {
      $('#checkoutName').value = user.name || '';
      $('#checkoutEmail').value = user.email || '';
      $('#checkoutPhone').value = user.phone || '';
    }
  }

  // Checkout form handling
  const checkoutForm = $('#checkoutForm'); // this line selects the checkout form element from the DOM and assigns it to the variable checkoutForm. It will be used to handle the form submission and process the order.
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!checkoutForm.reportValidity()) return;

      const cart = read('sosoCart', []);
      if (!cart.length) {
        renderCheckout();
        return;
      }

      const data = Object.fromEntries(new FormData(checkoutForm).entries());
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') data[key] = data[key].trim();
      });

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const reference = `SCS-${Date.now()}`;
      const orders = read('sosoEnquiries', []);
      orders.push({
        ...data,
        items: cart,
        total,
        reference,
        submittedAt: new Date().toISOString(),
      });

      try {
        write('sosoEnquiries', orders);
        write('sosoCart', []);
      } catch {
        notify('We could not save your order. Please try again.');
        return;
      }

      updateCartCount();
      checkoutForm.hidden = true;
      $('#checkoutItems').textContent =
        `Your order request ${reference} was sent. Contact the bakery to confirm your order.`;
      notify('Order request sent. Contact the bakery to confirm.');
    });
  }

  function changeQuantity(index, delta) {
    const cart = read('sosoCart', []);
    if (!cart[index]) return;

    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart.splice(index, 1);

    write('sosoCart', cart);
    renderCart();
    updateCartCount();
  }

  // Add product search and sort tools
  function addProductTools() {
    const grid = $('.products-container');
    if (!grid || $('#productSearch')) return;

    const tools = document.createElement('div');
    tools.className = 'product-tools';
    tools.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;margin:18px 0';
    tools.innerHTML =
      '<label style="flex:1;min-width:200px"><span class="visually-hidden">Search products</span><input id="productSearch" type="search" placeholder="Search sweet treats\u2026" style="width:100%;padding:12px;border:1px solid #d8c7c1;border-radius:8px"></label><label><span class="visually-hidden">Sort products</span><select id="productSort" style="padding:12px;border:1px solid #d8c7c1;border-radius:8px"><option value="default">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="az">Name: A\u2013Z</option></select></label><p id="productCount" aria-live="polite" style="width:100%;margin:0"></p>';

    grid.parentNode.insertBefore(tools, grid); // this line inserts the product tools (search and sort) into the DOM, placing them before the product grid. It allows users to filter and sort the products displayed on the page.

    const cards = $$('.product-card', grid);
    const original = [...cards];

    function filterProducts() {
      const query = $('#productSearch').value.trim().toLowerCase();
      const visible = original.filter(card =>
        card.textContent.toLowerCase().includes(query)
      );
      const sort = $('#productSort').value;

      const price = card => {
        const match = card
          .querySelector('.price')
          ?.textContent.match(/R\s*(\d+(?:\.\d+)?)/i); // this line extracts the price from the product card's text content using a regular expression. It looks for a pattern that matches the currency symbol "R" followed by a number, capturing the numeric value for sorting purposes.

        return match ? Number(match[1]) : 0;
      };

      if (sort === 'low') visible.sort((a, b) => price(a) - price(b));
      if (sort === 'high') visible.sort((a, b) => price(b) - price(a));
      if (sort === 'az') {
        visible.sort((a, b) =>
          (a.querySelector('h3')?.textContent || '').localeCompare(
            b.querySelector('h3')?.textContent || ''
          )
        );
      }

      original.forEach(card => {
        card.hidden = !visible.includes(card);
      });
      visible.forEach(card => grid.appendChild(card));
      $('#productCount').textContent =
        `Showing ${visible.length} of ${original.length} products.`;
    }

    $('#productSearch').addEventListener('input', filterProducts);
    $('#productSort').addEventListener('change', filterProducts);
    filterProducts();
  }

  // Accounts are stored in here and not for production use.
  const signup = $('#SignupForm');

  if (signup) {
    signup.addEventListener('submit', event => {
      event.preventDefault();

      // Validate the form fields before submission
      const name = $('#signupName')?.value.trim() || '';
      const email = $('#signupEmail')?.value.trim().toLowerCase() || '';
      const phone = $('#signupPhone')?.value.trim() || '';
      const password = $('#signupPassword')?.value || '';
      const confirm = $('#signupConfirmPassword')?.value || '';

      if (!name || !email || !phone || !password || !confirm) { 
        notify('Please complete every field.');
        return;
      }
      if (name.length < 2) {
        notify('Please enter your full name.');
        return;
      }
      if (!$('#terms')?.checked) {
        notify('Please agree to the terms and conditions.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        notify('Please enter a valid email address.');
        return;
      }
      if (!/^[-+()\d\s]{7,20}$/.test(phone)) {
        notify('Please enter a valid phone number.');
        return;
      }
      if (password.length < 8) {
        notify('Your password must be at least 8 characters.');
        return;
      }
      if (password.length > 128) {
        notify('Your password must be 128 characters or fewer.');
        return;
      }
      if (password !== confirm) {
        notify('Passwords do not match.');
        return;
      }

      const users = read('sosoUsers', []);
      if (users.some(user => user.email === email)) {
        notify('An account with this email already exists.');
        return;
      }

      users.push({ name, email, phone, password });
      write('sosoUsers', users);
      write('sosoUser', { name, email, phone });
      notify('Account created successfully!');
      setTimeout(() => {
        location.href = 'profile.html';
      }, 700);
    });
  }

  // Login form handling
  const login = $('#loginForm');

  if (login) {
    login.addEventListener('submit', event => {
      event.preventDefault();

      const email = $('#loginEmail')?.value.trim().toLowerCase();
      const password = $('#loginPassword')?.value;
      const user = read('sosoUsers', []).find(
        item => item.email === email && item.password === password
      );

      if (!user) {
        notify('Email or password is incorrect. Create an account first if you are new.');
        return;
      }

      write('sosoUser', {
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
      notify('Welcome back!');
      setTimeout(() => {
        location.href = 'profile.html';
      }, 600);
    });
  }


  // Load profile data on profile page
  function loadProfile() {
    const user = read('sosoUser', null);
    if (!user) return;

    const profileName = $('#profileName');
    if (profileName) profileName.textContent = user.name;

    const name = $('#name');
    if (name) name.textContent = user.name;

    const email = $('#email');
    if (email) email.textContent = user.email;

    const phone = $('#phone');
    if (phone) phone.textContent = user.phone || 'Not provided';

    const savedPhoto = localStorage.getItem('sosoProfilePhoto');
    if (savedPhoto && $('#profileImage')) {
      $('#profileImage').src = savedPhoto;
    }
  }

  // Load profile on page load
  window.editProfile = () => {
    const user = read('sosoUser', {});
    const name = prompt('Enter your full name:', user.name || '');
    if (name === null) return;

    const phone = prompt('Enter your phone number:', user.phone || '');
    if (phone === null) return;

    if (!name.trim()) {
      notify('Name cannot be empty.');
      return;
    }

    user.name = name.trim();
    user.phone = phone.trim();
    write('sosoUser', user);

    const users = read('sosoUsers', []);
    const match = users.find(item => item.email === user.email);
    if (match) {
      match.name = user.name;
      match.phone = user.phone;
      write('sosoUsers', users);
    }

    loadProfile();
    notify('Profile updated.');
  };

  window.Logout = () => {
    localStorage.removeItem('sosoUser');
    notify('You have logged out.');
  };

  // Profile photo upload and validation

  const upload = $('#profileUpload');
  if (upload) {
    upload.addEventListener('change', () => {
      const file = upload.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        notify('Please choose an image file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        notify('Please choose an image smaller than 2 MB.');
        return;
      }

      const reader = new FileReader(); // this line creates a new instance of the FileReader class, which is used to read the contents of files (in this case, the selected profile photo) asynchronously. It allows the application to process the file without blocking the main thread, enabling a smoother user experience.
      reader.onload = () => {
        localStorage.setItem('sosoProfilePhoto', reader.result);
        if ($('#profileImage')) $('#profileImage').src = reader.result;
        notify('Profile photo updated.');
      };
      reader.readAsDataURL(file);
    });
  }

  $$('form').forEach(form => {
    if (form === signup || form === login || form === checkoutForm) return;

    // Determine if the form is an enquiry or contact form based on its context or submit button text
    const submitText =
      form.querySelector('button[type="submit"]')?.textContent.trim().toLowerCase() ||
      '';
    const isEnquiry =
      form.closest('.enquiry-form') || /enquiry|order/i.test(submitText);
    const isContact =
      form.closest('.message-box') || /message/i.test(submitText);

    if (!isEnquiry && !isContact) return;

    form.addEventListener('submit', event => {
      event.preventDefault();


      // Validate the form fields before submission
      const message = form.querySelector('textarea[name="message"]');
      const name = form.querySelector('input[name="name"]');

      if (name && name.value.trim().length < 2) {
        name.setCustomValidity(
          'Please enter your full name (at least 2 characters).'
        );
        name.reportValidity();
        name.setCustomValidity('');
        return;
      }
      if (message && message.value.trim().length < 10) {
        message.setCustomValidity('Please enter at least 10 characters.');
        message.reportValidity();
        message.setCustomValidity('');
        return;
      }
      if (!form.reportValidity()) return;

      const data = Object.fromEntries(new FormData(form).entries());
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') data[key] = data[key].trim();
      });

      const key = isEnquiry ? 'sosoEnquiries' : 'sosoMessages';
      const records = read(key, []);
      records.push({ ...data, submittedAt: new Date().toISOString() });
      write(key, records);
      form.reset();

      const confirmation = isEnquiry
        ? 'Thank you! Your enquiry is sent. Contact the bakery to confirm your order.'
        : 'Thank you! Your message is sent.';
      notify(confirmation);
    });
  });

  const enquiryForm = $('.enquiry-form form');
  if (enquiryForm) {
    const inputs = $$('input', enquiryForm);

    if (inputs[0]) {
      inputs[0].id = 'enquiryName';
      inputs[0].name = 'name';
      inputs[0].type = 'text';
    }
    if (inputs[1]) {
      inputs[1].id = 'enquiryEmail';
      inputs[1].name = 'email';
      inputs[1].type = 'email';
    }

    const phone = $('input[name="phone"]', enquiryForm);
    if (phone) {
      phone.type = 'tel';
      phone.pattern = '[+()0-9\\s-]{7,20}'; // this line sets a regular expression pattern for the phone input field, allowing only certain characters (digits, spaces, plus signs, parentheses, and hyphens) and enforcing a length between 7 and 20 characters. It helps ensure that users enter valid phone numbers in the expected format.
    }

    const product = $('#product', enquiryForm);
    if (product) product.name = 'product';

    const quantity = $('#quantity', enquiryForm);
    if (quantity) {
      quantity.min = '1';
      quantity.step = '1';
      quantity.name = 'quantity';
    }
  }

  $$('button').forEach(button => {
    const link = $('a', button);
    if (!link) return;

    button.type = 'button';
    button.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && button.id !== 'checkoutButton') location.href = href;
    });
  });

  updateCartCount();
  renderCart();
  renderCheckout();
  addProductTools();
  loadProfile();
})();

// Where i got information about the jQuery

/* keybrains.io (2026), Available at: https://keybrains.io/jquery-tutorial/ (Accessed: 28 November 2026)*/
/* jQuery Learning Center(2026), Available at: https://learn.jquery.com/about-jquery/how-jquery-works/ (Accessed: 28 October 2026)*/
/* jQuery Learning Center(2026), Available at: https://learn.jquery.com/jquery-ui/getting-started/ (Accessed: 28 October 2026)*/
/* YouTube by Soft-All(2025), Available at: https://www.youtube.com/playlist?list=PLH246IZCIBeA0wV9HrOX7mIsksuGwO4Uw (Accessed: 29 October 2026)*/