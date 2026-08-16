export function requireWebhookSecret(req , res , next){

    const provided = req.query.secret;

    const expected = process.env.INTERNAL_WEBHOOK_SECRET;

    if(!provided || provided !== expected){
        return res.status(403).send('Forbidden');
    }

    next();

}