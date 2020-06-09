const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

exports.generateHeader = (pdfDoc) => {
    pdfDoc
        .image(__dirname + '/shop.png', 50, 50, { width: 60, align: 'left' })
        .fillColor("#444444")
        .fontSize(10)
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown();
};

exports.generateUserData = (pdfDoc, email) => {
    const date = new Date();
    pdfDoc
        .fontSize(13)
        .text(email, 90, 127)
        .fontSize(10)
        .text(`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`, 90, 143)
        .moveDown();
}

exports.generateTable = (pdfDoc, products) => {
    // Header
    pdfDoc
        .text('Description', 100, 200)
        .text('Price', 300, 200)
        .text('Quantity', 400, 200)
        .text('Total', 500, 200)
        .moveDown(3);

    let totalPrice = 0;
    let height = 220;
    // Rows
    products.forEach(p => {
        pdfDoc
            .text(p.product.title, 100, height)
            .text(p.product.price, 300, height)
            .text(p.quantity, 400, height)
            .text(p.quantity * p.product.price, 500, height)
        height += 15;
        totalPrice += p.quantity * p.product.price;
    });

    // Footer - Total
    pdfDoc
        .moveDown(2)
        .text(totalPrice, 500);
}