const express =require("express");
const User = require("../model/User");
const {verifyWebhook}=require("@clerk/backend/webhooks")
const router = express.Router();
const {StatusCodes}=require("http-status-codes")

router.post("/", async(req,res)=>{
    try{
 const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

if(!signingSecret) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Webhook secret is not provided"})
    return;
}


const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf-8") : String(req.body);

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

    res.status(StatusCodes.OK).json({ received: true });
  } catch (error) {
    console.error("Error in Clerk webhook:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Webhook verification failed" });
  }
})



module.exports = router;