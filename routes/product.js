const express = require('express');
const {
    isAdmin,
    isAuth,
    requireSignin
} = require('../controllers/auth');
const router = express.Router();
const {
    create,
    read,
    productById,
    remove,
    update,
    list,
    listRelated,
    listCategory,
    listBySearch,
    listByUser,
    photo1,
    photo2,
    photo3,
    photo4,
    querySearch
} = require('../controllers/product');
const {
    userById
} = require('../controllers/user');

router.get('/product/view/:productId', productById, read);
router.post("/product/create/:userId", requireSignin, isAuth, create); //("/product/create/:userId", requireSignin, isAuth, isAdmin,  create);
router.delete("/product/delete/:productId/:userId", requireSignin, isAuth, remove); //isAdmin,
router.put("/product/update/:productId/:userId", requireSignin, isAuth, isAdmin, update);
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/category", listCategory);
router.post("/products/by/search", listBySearch);
router.get("/products/byuser/:userId", listByUser);
router.get("/products/query/search", querySearch);
router.get("/product/photo1/:productId", photo1);
router.get("/product/photo2/:productId", photo2);
router.get("/product/photo3/:productId", photo3);
router.get("/product/photo4/:productId", photo4);

router.param('productId', productById);
router.param('userId', userById);


module.exports = router;