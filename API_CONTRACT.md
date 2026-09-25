# API contract

The frontend is intentionally API-first. It does not contain a local product database.

## 1. GET /api/catalog

Response can be either a plain array or an object:

```json
{
  "products": [
    {
      "id": "chicken-biryani",
      "name": "Chicken Biryani",
      "price": 220,
      "category": "Biryani",
      "emoji": "🍗",
      "description": "Aromatic basmati rice with tender chicken and spices.",
      "available": true
    }
  ],
  "categories": ["Biryani", "Starters", "Main Course", "Chinese", "Drinks"]
}
```

For a 15–20 item restaurant menu, your backend can return items such as:

```json
[
  {"id":"chicken-biryani","name":"Chicken Biryani","price":220,"category":"Biryani","emoji":"🍗","description":"Aromatic basmati rice with tender chicken and spices.","available":true},
  {"id":"mutton-biryani","name":"Mutton Biryani","price":280,"category":"Biryani","emoji":"🍖","description":"Fragrant basmati rice with slow-cooked mutton.","available":true},
  {"id":"veg-biryani","name":"Veg Biryani","price":170,"category":"Biryani","emoji":"🥕","description":"Basmati rice cooked with vegetables and whole spices.","available":true},
  {"id":"chicken-kebab","name":"Chicken Kebab","price":180,"category":"Starters","emoji":"🍢","description":"Char-grilled chicken pieces with a smoky finish.","available":true},
  {"id":"chilli-chicken","name":"Chilli Chicken","price":190,"category":"Starters","emoji":"🌶️","description":"Crispy chicken tossed in a spicy Indo-Chinese sauce.","available":true},
  {"id":"chicken-manchurian","name":"Chicken Manchurian","price":190,"category":"Chinese","emoji":"🥡","description":"Chicken balls in a glossy garlic-soy Manchurian sauce.","available":true},
  {"id":"veg-manchurian","name":"Veg Manchurian","price":160,"category":"Chinese","emoji":"🥦","description":"Crispy vegetable balls with savoury Manchurian sauce.","available":true},
  {"id":"chicken-noodles","name":"Chicken Noodles","price":170,"category":"Chinese","emoji":"🍜","description":"Wok-tossed noodles with chicken and vegetables.","available":true},
  {"id":"veg-noodles","name":"Veg Noodles","price":140,"category":"Chinese","emoji":"🍜","description":"Wok-tossed noodles with fresh vegetables.","available":true},
  {"id":"fried-rice","name":"Chicken Fried Rice","price":170,"category":"Rice & Noodles","emoji":"🍚","description":"Indo-Chinese fried rice with egg, chicken and vegetables.","available":true},
  {"id":"egg-fried-rice","name":"Egg Fried Rice","price":145,"category":"Rice & Noodles","emoji":"🍳","description":"Wok-fried rice with egg, vegetables and seasoning.","available":true},
  {"id":"veg-fried-rice","name":"Veg Fried Rice","price":130,"category":"Rice & Noodles","emoji":"🥗","description":"Fragrant fried rice with mixed vegetables.","available":true},
  {"id":"butter-chicken","name":"Butter Chicken","price":240,"category":"Main Course","emoji":"🍛","description":"Creamy tomato-based chicken curry with gentle spices.","available":true},
  {"id":"chicken-curry","name":"Chicken Curry","price":220,"category":"Main Course","emoji":"🍲","description":"Homestyle chicken curry with onion, tomato and spices.","available":true},
  {"id":"paneer-butter-masala","name":"Paneer Butter Masala","price":190,"category":"Main Course","emoji":"🧀","description":"Soft paneer in a rich buttery tomato gravy.","available":true},
  {"id":"dal-tadka","name":"Dal Tadka","price":120,"category":"Main Course","emoji":"🥣","description":"Yellow lentils finished with tempered spices.","available":true},
  {"id":"tandoori-roti","name":"Tandoori Roti","price":25,"category":"Breads","emoji":"🫓","description":"Fresh tandoor-baked Indian flatbread.","available":true},
  {"id":"butter-naan","name":"Butter Naan","price":55,"category":"Breads","emoji":"🫓","description":"Soft naan brushed with butter.","available":true},
  {"id":"cold-drink","name":"Cold Drink","price":50,"category":"Drinks","emoji":"🥤","description":"Chilled soft drink served cold.","available":true},
  {"id":"fresh-lime","name":"Fresh Lime Soda","price":70,"category":"Drinks","emoji":"🍋","description":"Refreshing lime soda, sweet or salted.","available":true}
]
```

The array above is an API example only. The React app does not ship with it as fallback data.

## 2. GET /api/catalog/:id

Return the selected product and optional related products:

```json
{
  "id": "chicken-biryani",
  "name": "Chicken Biryani",
  "price": 220,
  "category": "Biryani",
  "emoji": "🍗",
  "description": "Aromatic basmati rice with tender chicken and spices.",
  "available": true,
  "related": [
    {
      "id": "mutton-biryani",
      "name": "Mutton Biryani",
      "price": 280,
      "category": "Biryani",
      "emoji": "🍖",
      "description": "Fragrant basmati rice with slow-cooked mutton.",
      "available": true
    }
  ]
}
```

## 3. POST /api/order

Request:

```json
{
  "items": [
    {"product_id":"chicken-biryani","quantity":2}
  ],
  "fulfillment":"delivery",
  "customer": {
    "name":"Customer Name",
    "email":"customer@example.com",
    "phone":"9876543210",
    "notes":"Less spicy"
  },
  "delivery_charge":40,
  "subtotal":440,
  "total":480
}
```

Response:

```json
{
  "order_ref":"YC-2026-000123",
  "status":"verified",
  "message":"OTP sent"
}
```

The backend should ignore browser-calculated monetary values when validating the order and recompute them from server-side product prices.

## 4. POST /api/order/verify

Request:

```json
{"order_ref":"YC-2026-000123","otp":"123456"}
```

Response:

```json
{"verified":true,"status":"verified","message":"OTP verified"}
```

## 5. POST /api/order/resend-otp

Request:

```json
{"order_ref":"YC-2026-000123"}
```

Response:

```json
{"sent":true,"cooldown_seconds":30,"message":"OTP resent"}
```

## 6. GET /api/track/:order_ref

Response:

```json
{
  "order_ref":"YC-2026-000123",
  "status":"accepted",
  "updated_at":"2026-09-25T14:45:00+05:30",
  "eta":"35–45 min",
  "payment_url":"https://payment.example/checkout/abc123",
  "customer":{"name":"Customer Name","phone":"9876543210"},
  "items":[
    {"product_id":"chicken-biryani","name":"Chicken Biryani","quantity":2,"price":220,"emoji":"🍗"}
  ],
  "subtotal":440,
  "delivery_charge":40,
  "total":480
}
```

When `status` is `shipped` or `delivered`, the API may include:

```json
"shipping": {
  "carrier":"Your Choice Delivery",
  "tracking_number":"YCDEL123456",
  "address":"Customer delivery address"
}
```

## Status model

The UI displays these states in this order:

`verified → accepted → paid → shipped → delivered`

The server should be authoritative for the current status.
