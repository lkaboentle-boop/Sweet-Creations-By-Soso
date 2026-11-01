**Sweet Creations By Soso - Bakery Website**

Kaboentle Lesejane - ST10504677
WEBE5020 - Web Development Task 1

**Overview**
This is a Website development for a small bakery for Sweet Creations By Soso owned by Kagiso Moruti. The purpose of this website is to create an online presence where customers can learn about the bakery, view products and submit enquiries. The website show the bakery's handmade Jam Tarts and different kinds of Biscuits while improving communication and accessibility.

**Website Goals and Objectives**

*The goal for the website is:*
•	Gain 20-40 regular customers
•	Introduce attractive packaging and branding
•	Increase brand awareness within the local community
•	Expand product range with new flavours 
•	Hire staff as the business grows
•	Expand and provide delivery


*The objectives of the website include:*
•	Marketing of the bakery and their home-made products on the website.
•	Displaying the jam tarts and biscuit products in a systematic manner.
•	Enabling the customers to make enquires and place their orders.
•	Offering the contact details so that the customers can have communicate with Kagiso Moruti easily.
•	 Improving credibility through professionalism on the website. 

**Key Features and Functionality**

•	Home - Introduce the bakery Sweet Creations by Also with an enticing picture of the bakery with a description
•	About Us - Give information about the bakery owner, Kagiso Moruti, the history of the bakery, and the value of the business.
•	Products - Display the products offered by the bakery such as jam tarts and biscuits.
•	Enquiry - where customers will enquire about the products or make orders.
•	Contact - Provides the business's phone number, email, social media links, and other contact details.

**Timeline and Milestone**

•	Week 1: Research, planning and requirements gathering.
•	Week 2: Wireframing, layout design, colour palette, fonts and visual design.
•	Week 3: Website development using HTML and CSS.
•	Week 4: JavaScript, interactive features, testing and debugging.
•	Week 5: Final improvements, responsive design, final review and documentation.
•	Week 6: Submission and Github update

**Sitemap**
<img width="1352" height="767" alt="Screenshot 2026-08-30 210814" src="https://github.com/user-attachments/assets/f92acc15-45a2-4403-9158-557b0dff35a3" />

**FEEDBACK IMPLEMENTATION**

**Improvements Made:**
- Improved the overall CSS Stylesheet.
- Added an external CSS stylesheet
- Improved typography and colour consistency
- Added responsive design
- Improved the navigation menu
- Added product cards, prices and description
- Added shopping cart
- Added login and sign-up pages
- Added profile page
- Added profile image upload functionality
- Improved spacing layouts for desktop, tablet and mobile
- Improved buttons elements that call to action
- Added clearer form labels and input fields.
  
**Website Pages**
- **Home Page:** Introduces Sweet By Soso and provides links to the main areas of the website.
- **About Us:** Provides information about the bakery, its history, mission, vision and the owner Kagiso Moruti.
- **Products Page:** Displays the available products including product name, price and description. Customer can also add a product to cart.
- **Enquiry Page:** Allows customers to submit information about products they would like to order or enquiry about. The form includes full name, email address, phone number, product selection, quantity, special requests/message and submit button.
- **Contact Page:** The page provides the owners phone/WhatsApp, email address, bakery location, working hours and contact message form.
- **Cart Page:** The page display products selected by customer, users can view multiple items, quantities and total cost.
- **Login Page:** Allows registered customers to enter their account email and password.
- **Signup Page:** Allows new customers to create an account and add their details.
- **Profile Page:** Allows a customer to view and manage their profile information, users can also upload their own profile image, change password, and logout.

**Website Structure**
Each page includes:
- Header
- Logo image and Name
- Navigation menu
- Main content
- Footer
- Cart functionality is available where appropriate.

**Responsive Design**
Shared responsive rules in `css/styles.css` cover every page, with tablet adjustments below 900px and phone layouts below 600px.

- **Desktop:** Navigation and footer content are horizontal, product cards use a two-column grid, and enquiry/contact content can sit side by side.
<img width="1649" height="983" alt="Screenshot 2026-10-05 095139" src="https://github.com/user-attachments/assets/78c2c7b0-1d86-4f81-bf87-56d74ccc2fc2" />

- **Tablet:** Content columns and spacing adapt to narrower screens; forms and contact sections stack, while product and profile layouts remain readable.
<img width="1504" height="969" alt="Screenshot 2026-09-30 223923" src="https://github.com/user-attachments/assets/8a9d9170-9dae-4b1d-b2ba-2ef2aa941d5e" />

- **Mobile:** Navigation wraps, product cards and page sections stack, images and form controls fit the available width, and cart/profile/footer layouts are arranged for narrow screens.
<img width="1594" height="1007" alt="Screenshot 2026-09-30 223750" src="https://github.com/user-attachments/assets/d2cc2ff1-bae5-4a8d-acd0-6e4bc833ccda" />


GetEmoji(2026), Available at: https://getemoji.com/ (Accessed: 24 September 2026)







## JavaScript functionality added (Formative 2)

The shared `js/app.js` file adds interactive behaviour across the website:

- **Shopping cart:** add products, persist cart contents in `localStorage`, show a cart item count, increase/decrease quantities, remove products, calculate totals, and start a checkout enquiry.
- **Product browsing:** search products by name/description and sort by featured order, price, or name.
- **Forms:** validate signup details, confirm password matches, validate email/phone, and show feedback for contact/enquiry submissions. Demo form submissions are stored locally in the browser.
- **Account demo:** signup/login and profile details are stored locally; the profile can be edited and a profile image preview saved.
- **Feedback:** accessible status messages confirm user actions.

### How to test

1. Open `index.html` in a browser (or use the VS Code Live Server extension).
2. Visit Products, add items to cart, and open Cart to test quantity changes and totals.
3. Create an account using an email and a password of at least 8 characters, then test login and profile editing.
4. Submit a contact message or enquiry and observe the confirmation message.

**Important:** this is a front-end coursework demonstration. `localStorage` is browser-specific and can be inspected by users; it is not secure authentication, and forms do not send data to the bakery or a server. A production website needs a secure backend, password hashing, server-side validation, and a real order/contact delivery process.


## SEO and form-validation improvements

- Added a unique page title and meta description to every HTML page, plus responsive viewport metadata and a consistent language declaration.
- Added Open Graph metadata and Bakery structured data to the homepage. Verify business details before publishing.
- Added meaningful page titles, corrected the products-page spelling, and improved form labels, autocomplete attributes, input types, length limits, and constraints.
- Added `robots.txt` and `sitemap.xml`. Before launch, replace sitemap relative paths with the full public HTTPS URLs for the deployed site. Do not add a canonical URL until the final domain is known.
- JavaScript validates full names, email, telephone number, quantity, password confirmation, terms acceptance, and message length. Browser `localStorage` is demo-only; forms do not send messages to the bakery and localStorage authentication is not suitable for real customer accounts. Use a secure backend for production.
- SEO improvements cannot guarantee search ranking; publish on a crawlable domain, use HTTPS, optimize image sizes, and register the live site with Google Search Console.
