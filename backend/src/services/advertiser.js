const prisma = require("../config/prisma");
const supabase = require("../config/supabase");

exports.updateName = async (advertiserId, name) => {

    if (!name || name.trim() === "") {
        throw new Error("Name is required.");
    }

    return await prisma.advertiser.update({
        where: {
            id: advertiserId,
        },
        data: {
            name: name.trim(),
        },
    });
};

exports.addMoney = async (advertiserId, amount) => {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be greater than zero.");
    }

    return await prisma.advertiser.update({
        where: {
            id: advertiserId,
        },
        data: {
            walletBalance: {
                increment: amount,
            },
        },
    });
};

exports.deleteAccount = async (advertiser) => {

    const { error } = await supabase.auth.admin.deleteUser(
        advertiser.authUserId
    );

    if (error) {
        throw new Error(`Failed to delete Supabase user: ${error.message}`);
    }

    await prisma.advertiser.delete({
        where: {
            id: advertiser.id,
        },
    });
};
