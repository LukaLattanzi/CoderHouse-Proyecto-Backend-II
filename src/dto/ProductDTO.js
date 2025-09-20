export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.status = product.status;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = product.thumbnails;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }

    static create(product) {
        return new ProductDTO(product);
    }

    static createArray(products) {
        return products.map(product => new ProductDTO(product));
    }
}

export class ProductListDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status;
        this.thumbnails = product.thumbnails && product.thumbnails.length > 0
            ? [product.thumbnails[0]]
            : [];
    }

    static create(product) {
        return new ProductListDTO(product);
    }

    static createArray(products) {
        return products.map(product => new ProductListDTO(product));
    }
}

export class ProductCartDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.price = product.price;
        this.stock = product.stock;
        this.status = product.status;
        this.thumbnails = product.thumbnails && product.thumbnails.length > 0
            ? [product.thumbnails[0]]
            : [];
    }

    static create(product) {
        return new ProductCartDTO(product);
    }

    static createArray(products) {
        return products.map(product => new ProductCartDTO(product));
    }
}