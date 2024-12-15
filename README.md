# eShop

#### Welcome to eShop !
eShop is your one-stop online platform for all essential products. We aim to deliver high-quality, nutritious items right to your doorstep, saving you time and effort. Enjoy a seamless shopping experience with fast delivery and affordable prices.



### Admin Features

1. **Platform Management:**

- Manage user accounts (vendors and customers), including options to suspend or delete accounts.

- Blacklist vendor shops to stop their operations.

- Dynamically manage product categories (add, edit, or delete categories).

- Manage platform content, including vendor shops and product categories.

### Vendor Features


- Create and manage shop profiles, products, and inventory.

- View order history and respond to customer reviews.


### Customer Features

- Browse, filter, and compare products from multiple vendors.

- Add items to the cart, purchase products, and leave reviews for purchased items.

- Integrate with payment systems like Aamarpay for secure transactions.

- Access order history to review past purchases.

- Leave reviews and ratings for purchased products.

## Technologies

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT-based user authentication
- **File Storage:** Cloudinary integration for product images
- **Payment Gateway:** Aamarpay

## :link: How to run the application locally

###  Step 1: Clone the Repository

Clone the repository to your local machine using Git:

```node
git clone <repository-url>
```

###  Step 2: Navigate to the Project Directory

Go to the cloned repository folder:

```node
cd <repository-name>
```

###  Step 3: Install Dependencies

Install the required packages using npm:

```node
npm install
```

###  Step 4: Set up the `.env` File

Create a .env file in the root directory and add the necessary environment variables:

```node
PORT = 5000;
DATABASE_URL =
  'postgresql://username:password@localhost:5432/mydatabase?schema=public';
```

 configuration file which is under `./src/config` folder named as `index.ts`.

### Step 5: Generate Prisma Client

Run this command to generate the Prisma client:

```node
npx prisma generate
```


### Step 6: Run Database Migrations

Apply the Prisma migrations to set up the database:

```node
npx prisma migrate dev
```



### Step 7: Start the Server

Launch the application in development mode:

```node
npm run dev
```


```node
"scripts": {
    "start:dev": "ts-node-dev --respawn --transpile-only ./src/server.ts",
    "start:prod": "node ./dist/server.js",
    //...more scripts
  }
```

Now, you can access the application at http://localhost:5000 (or your specified port).


