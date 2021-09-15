const express = require('express');
const { isAdmin, isAuth, requireSignin } = require('../controllers/auth');
const router = express.Router();
const { create, categoryById, read, update, remove, list, createDepartment, departmentById, deptList} = require('../controllers/category');
const { userById } = require('../controllers/user');

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin,  create);
router.put("/category/update/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/category/delete/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/category/view/:categoryId", read)
router.get("/category/list", list)

router.post("/department/create/:userId", requireSignin, isAuth, isAdmin,  createDepartment);
router.get("/department/list", deptList);
router.param('departmentId', departmentById);


router.param('userId', userById);
router.param('categoryId', categoryById);


module.exports = router;