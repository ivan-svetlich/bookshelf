const BOOKSHELF = "https://localhost:44320"; //SERVER URL

const URLS = {
    "BOOKSHELF": {
        "AUTH": BOOKSHELF + "/api/AuthManagement/",
        "BOOKS": BOOKSHELF + "/api/Books",
        "CHAT": BOOKSHELF + "/chatHub/",
        "COMMENTS": BOOKSHELF + "/api/Comments/",
        "FRIENDS": BOOKSHELF + "/api/Friends/",
        "NOTIFICATIONS": BOOKSHELF + "/api/Notifications/",
        "PRODUCTS": BOOKSHELF + "/api/Products/",
        "MERCADO_PAGO": BOOKSHELF + "/api/payments/MercadoPago/",
        "PROFILES": BOOKSHELF + "/api/Profiles/"
    },
    "GOOGLE_BOOKS_URL": "https://www.googleapis.com/books/v1"
}

const KEYS = {
    "MERCADO_PAGO": {
        "PUBLIC_KEY": "INSERT YOUR MERCADO PAGO PUBLIC KEY HERE" //INSERT THE PUBLIC KEY PROVIDED BY MERCADO PAGO
    },
    "RE_CAPTCHA": {
        "PUBLIC_KEY": "INSERT YOUR RE-CAPTCHA PUBLIC KEY HERE" //INSERT THE PUBLIC KEY PROVIDED BY GOOGLE RE-CAPTCHA
    }
}

export {
    URLS,
    KEYS
};