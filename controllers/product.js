const formidable = require('formidable');
const _ = require('lodash');
const {
    errorHandler
} = require("../helpers/dbErrorHandler");
const Product = require("../models/product");
const fs = require('fs');
const product = require('../models/product');
const {
    NIL
} = require('uuid');


exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            });
        };

        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo1 = undefined;
    req.product.photo2 = undefined;
    req.product.photo3 = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {


    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        const {
            name,
            description,
            price,
            category,
            department
        } = fields;

        if (!name || !description || !price || !category || !department) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product(fields); // create new product

        if (files.photo1) {

            /*if (files.photo1.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }*/

            product.photo1.data = fs.readFileSync(files.photo1.path);
            product.photo1.contentType = files.photo1.type;
        };

        if (files.photo2) {
            product.photo2.data = fs.readFileSync(files.photo2.path);
            product.photo2.contentType = files.photo2.type;
        };

        if (files.photo3) {
            product.photo3.data = fs.readFileSync(files.photo3.path);
            product.photo3.contentType = files.photo3.type;
        };

        if (files.photo4) {
            product.photo4.data = fs.readFileSync(files.photo4.path);
            product.photo4.contentType = files.photo4.type;
        };


        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            result.photo1 = undefined;
            result.photo2 = undefined;
            result.photo3 = undefined;
            result.photo4 = undefined;
            res.json(result);
        });
    });


};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        deletedProduct.photo1 = undefined;
        deletedProduct.photo2 = undefined;
        deletedProduct.photo3 = undefined;
        deletedProduct.photo4 = undefined;

        res.json({
            deletedProduct,
            message: "Product deleted"
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = req.product; // current product
        product = _.extend(product, fields); //updated product

        if (files.photo1) {

            /*if (files.photo1.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }*/

            product.photo1.data = fs.readFileSync(files.photo1.path);
            product.photo1.contentType = files.photo1.type;
        };

        if (files.photo2) {
            product.photo2.data = fs.readFileSync(files.photo2.path);
            product.photo2.contentType = files.photo2.type;
        };

        if (files.photo3) {
            product.photo3.data = fs.readFileSync(files.photo3.path);
            product.photo3.contentType = files.photo3.type;
        };

        if (files.photo4) {
            product.photo4.data = fs.readFileSync(files.photo4.path);
            product.photo4.contentType = files.photo4.type;
        };


        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            result.photo1 = undefined;
            result.photo2 = undefined;
            result.photo3 = undefined;
            result.photo4 = undefined;
            res.json(result);
        });
    });

};

/**
 * sort by new arrival or popularity
 * 
 * by popularity => /products?sortBy=sold&order=asc&limit=4
 * by arrival => /products?sortBy=createdAt&order=asc&order=asc&limit=4
 * 
 **/

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    product.find()
        .select("-photo1")
        .select("-photo2")
        .select("-photo3")
        .select("-photo4")
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products searched not found"
                });
            }

            res.json(products);

        });

};

exports.listRelated = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({
            _id: {
                $ne: req.product
            }, // $ne for not including current product
            category: req.product.category
        })
        .select("-photo1")
        .select("-photo2")
        .select("-photo3")
        .populate('category', '_id name')
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products searched not found"
                });
            }

            res.json(products);

        });



};

exports.listCategory = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Categories not found"
            });
        }

        res.json(category);
    });
};


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// route - make sure its post


exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
    console.log("filters: ", req.body.filters);
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else if (key === "str") {
                if (req.body.filters[key].length < 3) {
                    continue;
                } else {
                    //console.log("str:== ", req.body.filters[key]);
                    findArgs.name = {
                        $regex: `${req.body.filters[key]}`,
                        $options: 'i'
                    };
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    // const str = findArgs.str;
    // findArgs.remove(str);
    console.log("findArgs", findArgs);
    Product.find(findArgs)
        .select("-photo1")
        .select("-photo2")
        .select("-photo3")
        .select("-photo4")
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.querySearch = (req, res) => {
    const query = {};

    if (req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        };
        console.log("query: ", req.query.search);
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }

        Product.find(query, (err, products) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }

                res.json(products);
            })
            .select("-photo1")
            .select("-photo2")
            .select("-photo3")
            .select("-photo4");

    }
};

exports.listByUser = (req, res) => {

    let userId = req.profile._id;
    let prodlist = [];
    let size = 0;

    Product.find({
            user: userId
        })
        .select("-photo1")
        .select("-photo2")
        .select("-photo3")
        .select("-photo4")
        .populate("user")
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            // res.json({
            //     size: data.length,
            //     data
            // });
            //console.log("here");
            prodlist = data;
            size = data.length;

            //console.log(prodlist);

            let newList = [];

            prodlist.forEach(element => {
                //console.log("loop");
                element.user = undefined;
                newList.push(element);
            });

            res.json({
                size: size,
                newList
            });

        })

    //res.json(user);
};

exports.photo1 = (req, res, next) => {
    if (req.product.photo1 === undefined) {
        return res.status(404).json({
            error: "404"
        });
    } else {
        res.set('Content-Type', req.product.photo1.contentType);
        return res.send(req.product.photo1.data);
    }

    next();
};

exports.photo2 = (req, res, next) => {
    if (req.product.photo2 === undefined) {
        return res.status(404).json({
            error: "404"
        });
    } else {
        res.set('Content-Type', req.product.photo2.contentType);
        return res.send(req.product.photo2.data);
    }

    next();
};

exports.photo3 = (req, res, next) => {
    if (req.product.photo3 === undefined) {
        return res.status(404).json({
            error: "404"
        });
    } else {
        res.set('Content-Type', req.product.photo3.contentType);
        return res.send(req.product.photo3.data);
    }

    next();
};

exports.photo4 = (req, res, next) => {

    if (req.product.photo4 === undefined) {
        return res.status(404).json({
            error: "404"
        });
    } else {
        res.set('Content-Type', req.product.photo4.contentType);
        return res.send(req.product.photo4.data);
    }

    next();
};