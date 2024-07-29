const {Router} = require("express");
const userRouter = require("./user.routes")
const userNotes = require("./notes.routes")
const tagsRouter = require("./tags.routes")

const router = Router();

router.use("/notes", userNotes)
router.use("/users", userRouter);
router.use("/tags", tagsRouter)

module.exports = router