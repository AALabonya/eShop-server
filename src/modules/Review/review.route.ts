import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), ReviewController.createReview);
router.post("/create-reply", ReviewController.createReply);
router.get(
    "/",
    ReviewController.getAllReviews
);

export const ReviewRoutes = router;
