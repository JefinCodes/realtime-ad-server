const prisma = require("../config/prisma");
const supabase = require("../config/supabase");

module.exports = async (req, res, next) => {

    try {

        const authUserId = req.auth.sub;

        let advertiser = await prisma.advertiser.findUnique({
            where: {
                authUserId
            }
        });

        if (!advertiser) {

            const {
                data,
                error
            } = await supabase.auth.admin.getUserById(authUserId);

            if (error) {
                return res.status(401).json({
                    message: "Supabase user not found"
                });

            }

            advertiser = await prisma.advertiser.upsert({
                where: {
                    authUserId,
                },
                update: {},
                create: {
                    authUserId,
                    email: data.user.email,
                    name: "Advertiser",
                },
            });

        }

        req.advertiser = advertiser;

        next();

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
