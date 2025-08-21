# Controllers

This directory contains source files for the controllers exported by this app.

To add a new empty controller, type in `lb4 controller [<name>]` from the
command-line of your application's root directory.

For more information, please visit
[Controller generator](http://loopback.io/doc/en/lb4/Controller-generator.html).


	•	POST /facade/orders → create order
	•	PATCH /facade/orders/{id} → update order
	•	DELETE /facade/orders/{id} → delete order
	•	GET /facade/orders/{orderId}/items → get order items
	•	POST /facade/orders/{orderId}/items → create item
	•	PATCH /facade/orders/{orderId}/items → update item(s)
	•	DELETE /facade/orders/{orderId}/items → delete item(s)