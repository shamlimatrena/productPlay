const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

//Cors setup
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:9090"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/hello", (req, res) => {
  try {
    res.send({ msg: "hello" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For User Registration
app.post("/registration", async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, password } = req.body;

    const user = await prisma.user.create({
      data: { first_name, last_name, email, phone, address, password },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await prisma.user.findFirst({
      where: { email: email },
    });

    let user = {
      user_id: userData.id,
      user_name: userData.first_name,
      user_email: userData.email,
    };

    if (userData.password == password) {
      res.status(200).send(user);
    } else {
      res.status(401).send({ msg: "invalid", body: req.body });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For creating a product
app.post("/product/create", async (req, res) => {
  try {
    let {
      title,
      categories,
      description,
      price,
      rent_price,
      rent_period,
      owner_id,
    } = req.body;

    price = parseFloat(price);
    rent_price = parseFloat(rent_price);

    const product = await prisma.product.create({
      data: {
        title,
        categories,
        description,
        price,
        rent_price,
        rent_period,
        owner: {
          connect: {
            id: owner_id,
          },
        },
      },
    });

    res.status(201).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For updating a product
app.put("/product/update/:id", async (req, res) => {
  try {
    let { title, categories, description, price, rent_price, rent_period } =
      req.body;

    //Parsing to avoid type errors
    price = parseFloat(price);
    rent_price = parseFloat(rent_price);

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        categories,
        description,
        price,
        rent_price,
        rent_period,
      },
    });

    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For deleting a product
app.delete("/product/delete/:id", async (req, res) => {
  try {
    const product = await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting a single product
app.get("/product/:id", async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: parseInt(req.params.id) },
    });

    //increasing post view
    let view = product.views + 1;

    //updating the view count
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        views: view,
      },
    });

    res.status(200).send(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting all the products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({});

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting all the products by User
app.get("/products/user/:id", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { owner_id: parseInt(req.params.id) },
    });

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting all sold products of a User
app.get("/sold-products/user/:id", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { owner_id: parseInt(req.params.id), status: "bought" },
    });

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting all bought products of a User
app.get("/bought-products/user/:id", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { buyer_id: parseInt(req.params.id) },
    });

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting all lent products of a User
app.get("/lent-products/user/:id", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { owner_id: parseInt(req.params.id), status: "rented" },
    });

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For getting all rented products of a User
app.get("/rented-products/user/:id", async (req, res) => {
  try {
    const rentals = await prisma.rentals.findMany({
      where: { renter_id: parseInt(req.params.id) },
      include: {
        product: true, //eager loading products
      },
    });

    res.status(200).send(rentals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For buying a product
app.post("/buy/product/:id", async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: "bought",
        buyer: {
          connect: {
            id: req.body.buyer_id,
          },
        },
      },
    });

    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//For renting a product
//function to check rent date periods conflicts
function checkRentalConflict(rentals, newRental) {
  for (const rental of rentals) {
    const existingRentFrom = new Date(rental.rent_from);
    const existingRentTo = new Date(rental.rent_to);
    const newRentFrom = new Date(newRental.rent_from);
    const newRentTo = new Date(newRental.rent_to);

    if (
      (newRentFrom >= existingRentFrom && newRentFrom <= existingRentTo) ||
      (newRentTo >= existingRentFrom && newRentTo <= existingRentTo) ||
      (existingRentFrom >= newRentFrom && existingRentFrom <= newRentTo) ||
      (existingRentTo >= newRentFrom && existingRentTo <= newRentTo)
    ) {
      return true; // Conflict found
    }
  }
  return false; // No conflicts
}

//Renting Route
app.post("/rent/product/:id", async (req, res) => {
  try {
    const product_id = parseInt(req.params.id);

    // -- checking rental information to check date availability -- //

    let rentals = await prisma.rentals.findMany({
      where: {
        product_id: product_id,
      },
    });

    const hasConflict = checkRentalConflict(rentals, req.body);

    //Returning forbidden status if conflict is found
    if (hasConflict) {
      res.status(403).send({ err: "conflict found in rental dates" });
      return;
    }

    const product = await prisma.product.update({
      where: { id: product_id },
      data: {
        status: "rented",
      },
    });

    const rental = await prisma.rentals.create({
      data: {
        rent_from: req.body.rent_from,
        rent_to: req.body.rent_to,
        product: {
          connect: {
            id: product_id,
          },
        },
        renter: {
          connect: {
            id: parseInt(req.body.renter_id),
          },
        },
      },
    });

    res.status(200).send({ product: product, rental: rental });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
