const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");

// Craete new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,

  });
  res.status(200).json({
    success: true,
    order,
  })
});

// Get Single Order
exports.getSingleOrder = catchAsyncError(async (req,res,next) => {
  // const order  = await Order.findById(req.params.id).populate("user", "name email")
  const order  = await Order.findById(req.params.id).populate("user",["name","email"])
  if (!order) {
    return next(new ErrorHandler("No order found with that ID", 404))
  }
  res.status(200).json({
    success:true,
    order,
  })
})

// Get My Orders
exports.getMyOrders = catchAsyncError(async (req,res,next) => {
  const orders  = await Order.find({user: req.user._id})
  res.status(200).json({
    success:true,
    orders,
  })
})

// Get all order -- ADMIN
exports.getAllOrders = catchAsyncError(async (req,res,next) => {
  const orders  = await Order.find()
  let totalAmount = 0;
  orders.forEach(order => totalAmount += order.totalPrice)
  console.log({totalAmount})

  res.status(200).json({
    success:true,
    totalAmount,
    orders,
  })
})

// Update Order Status -- ADMIN
exports.updateOrder = catchAsyncError(async (req,res,next) => {
  const order = await Order.findById(req.params.id)
  if (!order) return next(new ErrorHandler("No order found with that ID", 404))
  
  if ( order.orderStatus === "Delivered") return next(new ErrorHandler("You have already delivered this order",400))

  order.orderItems.forEach(async order => {
    await updateStock(order.product,order.quantity)
  })

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered'){
    order.deliveredAt = Date.now()
  }

  await order.save({validateBeforeSave: false})

  res.status(200).json({
    success:true,
    order,
  })
})

const updateStock = async (productId,quantity) => {
  const product = await Product.findById(productId)
  product.stock  -= quantity
  await product.save({validateBeforeSave: false})
}

// Delete Order 
exports.deleteOrder = catchAsyncError(async (req,res,next) => {
  const order = await Order.findById(req.params.id)
  
  if (!order) return next(new ErrorHandler("No order found with that ID", 404))

  await order.remove()

  res.status(200).json({
    success:true,
  })
})
