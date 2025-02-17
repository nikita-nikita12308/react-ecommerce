import Product from "../models/product.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import Order from "../models/order.js";
import { mailStyle, transporter } from "../helpers/mail.js";
dotenv.config();

export const create = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required" });
      case !shipping.trim():
        return res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    // create product
    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

export const list = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const photo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "photo"
    );
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");
    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
      case !description.trim():
        res.json({ error: "Description is required" });
      case !price.trim():
        res.json({ error: "Price is required" });
      case !category.trim():
        res.json({ error: "Category is required" });
      case !quantity.trim():
        res.json({ error: "Quantity is required" });
      case !shipping.trim():
        res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        res.json({ error: "Image should be less than 1mb in size" });
    }

    // update product
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

export const filteredProducts = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    console.log("args => ", args);

    const products = await Product.find(args);
    console.log("filtered products query => ", products.length);
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

export const productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.json(total);
  } catch (err) {
    console.log(err);
  }
};

export const listProducts = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

export const productsSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");

    res.json(results);
  } catch (err) {
    console.log(err);
  }
};

export const relatedProducts = async (req, res) => {
  try {
    const { productId, categoryId } = req.params;
    const related = await Product.find({
      category: categoryId,
      _id: { $ne: productId },
    })
      .select("-photo")
      .populate("category")
      .limit(3);

    res.json(related);
  } catch (err) {
    console.log(err);
  }
};

export const createOrder = async (req, res) => {
  try {
    const cart = req.body.cart;
    const user = req.user._id;
    const {
      city,
      phone,
      fullName,
      region,
      postNumber,
      paymentMethod,
      cartTotal,
    } = req.body;
    const createdOrder = await Order.create({
      products: cart,
      city,
      phone,
      fullName,
      region,
      postNumber,
      paymentMethod,
      cartTotal,
      buyer: user,
    });

    const mailOptions = {
      from: {
        name: "Сирна Насолода",
        address: process.env.GMAIL_USER,
      },
      to: process.env.OWNER_MAIL,
      subject: "Нове Замовлення",
      html: mailStyle(`
      <h3>Хтось замовив продукт з магазину!</h3>
      <p>Статус  замовлення можна змінити в кабінеті адміністратора</p>
      <p>
        Деталі  замовлення доступні в
        <a href="${req.protocol}://${process.env.BASE_LINK}/dashboard/admin/orders">кабінеті адміністратора</a>.
      </p>
      <p>ПІБ ${fullName}</p>
      <p>Телефон ${phone}</p>
      <p>Місто / Село : ${city}</p>
      <p>Область / Округ : ${region}</p>
      <p>Номер відділення Нової Пошти : ${postNumber}</p>
      <p>Всього ${cartTotal} грн </p>

    `),
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(201).json({ success: true, data: createdOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("buyer", "email name");
    // send email

    // prepare email
    const mailOptions = {
      from: {
        name: "Сирна Насолода",
        address: process.env.GMAIL_USER,
      },
      to: order.buyer.email,
      subject: "Статус Замовлення",
      html: mailStyle(`
      <h3>Вітаємо, ${order.fullName}!</h3>
      <p>Статус вашого замовлення: <span class="status">${order.status}</span></p>
      <p>
        Деталі вашого замовлення доступні в
        <a href="${req.protocol}://${process.env.BASE_LINK}/dashboard/user/orders">особистому кабінеті</a>.
      </p>
    `),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json(order);
  } catch (err) {
    console.log(err);
  }
};

export const paymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(req.body);
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: status },
      { new: true }
    ).populate("buyer", "email name");
    // send email
    console.log(order);
    res.json(order);
  } catch (err) {
    console.log(err);
  }
};
