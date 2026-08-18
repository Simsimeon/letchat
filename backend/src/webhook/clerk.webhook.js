import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
      res.status(503).json({ message: "Webhook secret is not provided" });
      return;
    }

    // clerk's verifier expects a Web Request with the raw body; express.raw gives a Buffer.
    const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });

    // throws if the signature is wrong or the body was tampered with; only then do we trust evt.
    const evt = await verifyWebhook(request, { signingSecret });

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")[0];

      await User.findOneAndUpdate(
        { clerkId: u.id },
        { clerkId: u.id, email, fullName, profilePic: u.image_url },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    if (evt.type === "user.deleted") {
      if (evt.data.id) await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error in Clerk webhook:", error);
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;





























































































// const express = require("express");
// const User = require("../model/User");
// const { verifyWebhook } = require("@clerk/backend/webhooks");
// const router = express.Router();
// const { StatusCodes } = require("http-status-codes");

// router.post("/", async (req, res) => {
//   try {
//     const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
//     if (!signingSecret) {
//       console.error("❌ CLERK_WEBHOOK_SIGNING_SECRET is missing in .env");
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Webhook secret is not provided" });
//       return;
//     }

//     // 1. Convert the raw body buffer explicitly to a UTF-8 string
//     if (!req.body || !Buffer.isBuffer(req.body)) {
//       console.error("❌ req.body is not a Buffer. Check your express.raw() middleware order.");
//       res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid body format" });
//       return;
//     }
//     const payload = req.body.toString("utf-8");

//     // 2. Map the exact Svix/Clerk verification headers
//     const headers = {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     };

//     const request = new Request("http://internal/webhooks/clerk", {
//       method: "POST",
//       headers: new Headers(headers),
//       body: payload,
//     });
    
//     // Throws if the signature validation fails
//     const evt = await verifyWebhook(request, { signingSecret });
    
//     if (evt.type === "user.created" || evt.type === "user.updated") {
//       const u = evt.data;
//       console.log("📝 Processing Clerk event:", evt.type, "User ID:", u.id);

//       // Safe extraction from Clerk data payload
//       const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ?? u.email_addresses?.[0]?.email_address;
//       const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")[0];
      
//       console.log("📊 Extracted data:", { clerkId: u.id, email, fullName, profilePic: u.image_url });
      
//       const result = await User.findOneAndUpdate(
//         { clerkId: u.id },
//         { clerkId: u.id, email, fullName, profilePic: u.image_url },
//         { new: true, upsert: true, setDefaultsOnInsert: true },
//       );
//       console.log("✅ User saved to database:", result);
//     }

//     if (evt.type === "user.deleted") {
//       if (evt.data.id) {
//         await User.findOneAndDelete({ clerkId: evt.data.id });
//         console.log("🗑️ User deleted from database:", evt.data.id);
//       }
//     }

//     res.status(StatusCodes.OK).json({ received: true });
//   } catch (error) {
//     console.error("Error in Clerk webhook:", error);
//     res.status(StatusCodes.BAD_REQUEST).json({ message: "Webhook verification failed" });
//   }
// });

// module.exports = router;











































