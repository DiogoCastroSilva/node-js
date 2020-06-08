// Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    // See if cart alredy has product
    const cartProductIndex = this.cart.items.findIndex(
        cp => cp.productId.toString() === product._id.toString()
    );
    
    if (cartProductIndex >= 0) {
        // If has product add one more to quantity
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        // if doesnt have, add the product withquantity 1
        updatedCartItems.push({ 
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;
    return this.save(); 
}

userSchema.methods.removeFromCart = function(id) {
    const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString());
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);