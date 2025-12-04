Backend – CRUD de Productos

Tecnologías: Java 17 · Spring Boot 4.0.0 · MySQL · Maven

Este backend forma parte de mi proyecto Full Stack con Angular + Spring Boot.
Su función es proveer una API REST para la gestión de productos, incluyendo operaciones de creación, lectura, actualización, activación/desactivación y ajuste de inventario.

📌 Características principales

API REST completamente funcional

CRUD de productos

Validaciones de negocio (precio, existencias, nombre único)

Conexión a base de datos MySQL

Arquitectura basada en capas (Controller, Service, Repository)

Manejo de excepciones

Uso de Data JPA para persistencia

Respuestas en formato JSON




*Tecnologías utilizadas
Componente	Versión
Java	17
Spring Boot	4.0.0
Maven	3.8+
MySQL	8+
Lombok	Opcional
Spring Data JPA	Incluido






* Estructura del proyecto
backend/
 ├── src/
 │   ├── main/
 │   │   ├── java/com/miapp/productos/
 │   │   │   ├── controller/
 │   │   │   ├── service/
 │   │   │   ├── repository/
 │   │   │   └── model/
 │   │   └── resources/static/templates
 │   │       └── application.properties
 │   │
 │   └──test/java/com/productos/demo
 │      └──DemoApplicationTests
 │
 └── pom.xml









*Configuración de la base de datos

En el archivo application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/mi_base_de_datos
spring.datasource.username=root
spring.datasource.password=*********

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect





*Endpoints principales

 1-Listar todos los productos
GET /productos

2- Obtener un producto por ID
GET /productos/{id}

3- Crear un producto
POST /productos

4- Actualizar un producto
PUT /productos/{id}

5- Activar/Desactivar producto
PATCH /productos/{id}/activar

 Ajustar inventario
POST /productos/{id}/ajustar





*Pruebas de API

Puedes probar la API con herramientas como:

Postman

Ejemplo:


POST http://localhost:8080/productos

Key: Content-Type
Value: application/json

Content-Type: application/json

{
  "nombre": "Pelota",
  "marca": "MarcaX",
  "categoria": "Juguetes",
  "precio": 150.0,
  "existencias": 20,
  "activo": true
}
[Imagen de demostración](image.png)







*Errores encontrados durante el desarrollo

1-Error en el puerto de MySQL

Al principio, la aplicación Spring Boot no podía conectarse a la base de datos y al intentar arrancarla, en la consola aparecía un error tipo:

Communications link failure
o
Connection refused


Esto hacía que el backend no iniciara correctamente.

Dónde ocurría:
El problema estaba en el archivo application.properties, donde configuraba la conexión a MySQL:

spring.datasource.url=jdbc:mysql://localhost:3307/mi_base
spring.datasource.username=root
spring.datasource.password=1234


En este caso, el puerto configurado (3307) no coincidía con el puerto real donde MySQL estaba escuchando.

Cómo lo solucioné:

Verifiqué el puerto correcto en MySQL Workbench o mediante consola con:

SHOW VARIABLES LIKE 'port';


Actualicé el application.properties con el puerto correcto (3306, que es el por defecto):

spring.datasource.url=jdbc:mysql://localhost:3306/mi_base_de_datos
spring.datasource.username=root
spring.datasource.password=*********


Reinicié la aplicación y la conexión a la base de datos se estableció correctamente, permitiendo que el backend arrancara sin problemas.

2-Error 400 al crear un producto

Al principio, al intentar crear un producto usando el endpoint POST /productos, me regresaba un error 400 (Bad Request). Esto pasaba incluso cuando creía que el JSON que enviaba estaba correcto.

Revisando el código, me di cuenta de que el problema estaba en las validaciones dentro del ProductoService, en el método crearProducto. Allí había reglas como:

if (producto.getPrecio() == null || producto.getPrecio() <= 0) {
    throw new IllegalArgumentException("El precio debe ser mayor que 0");
}
if (producto.getExistencias() == null || producto.getExistencias() < 0) {
    throw new IllegalArgumentException("Las existencias deben ser mayor o igual a 0");
}
if (productoRepository.existsByNombre(producto.getNombre())) {
    throw new IllegalArgumentException("Ya existe un producto con este nombre");
}
if (producto.getActivo() == null) {
    producto.setActivo(true);
}


Qué pasaba:

Si enviaba un producto con precio nulo o menor que 0, el backend lanzaba excepción y Spring devolvía 400.

Lo mismo ocurría si las existencias eran nulas o negativas, o si el nombre del producto ya existía en la base de datos.

También había problemas si el campo activo no se enviaba en el JSON.

Cómo lo solucioné:

Agregué validaciones explícitas en el método crearProducto para manejar todos estos casos y devolver mensajes claros.

if (producto.getPrecio() == null || producto.getPrecio() <= 0) {
    throw new IllegalArgumentException("El precio debe ser mayor que 0");
}

Inicialicé activo por defecto en true cuando el cliente no enviaba ese valor.

if (producto.getActivo() == null) {
            producto.setActivo(true); // Por defecto activo
        }

Con esto, cualquier producto enviado con datos correctos se crea sin problema, y si algún dato es inválido, ahora recibo un mensaje de error específico en lugar de un 400 genérico.

Resultado:

Ahora puedo crear productos correctamente usando JSON como este:

{
  "nombre": "Pelota",
  "marca": "MarcaX",
  "categoria": "Juguetes",
  "precio": 150.0,
  "existencias": 20,
  "activo": true
}


Y si algo no cumple las reglas, el backend me dice exactamente qué campo está mal.

3-Error al traer un producto para editar

Al principio, al intentar obtener un producto usando el endpoint GET /productos/{id} para editarlo, la aplicación podía lanzar una excepción genérica si había un problema al recuperar los datos de la base. Esto hacía que la edición no fuera confiable y dificultaba identificar el error.

Dónde ocurría:
En el método obtenerProducto del ProductoService:

public Optional<Producto> obtenerProducto(Long id) {
    return productoRepository.findById(id); // Si algo fallaba, podía generar error genérico al usar el producto
}


Si se intentaba acceder directamente al producto sin manejar el Optional, podía lanzarse un error inesperado.

Cómo lo solucioné:

Se manejó el Optional usando orElseThrow() en los métodos que requerían el producto para edición:

Producto productoExistente = productoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Error al obtener producto"));


Resultado:
Ahora, al intentar editar un producto, cualquier problema al traer los datos devuelve un mensaje claro, evitando errores genéricos y facilitando la depuración y la experiencia del usuario.






*Fuentes de apoyo utilizadas

Durante el desarrollo se consultaron:

Videos de YouTube sobre Spring Boot + MySQL

Videos sobre CRUD con productos

Asistencia de IA para resolver dudas o errores específicos de código





*Cómo ejecutar el backend

Clonar el repositorio

Crear la base de datos en MySQL:

CREATE DATABASE mi_base_de_datos;


Actualizar usuario/contraseña en application.properties

Ejecutar:

mvn spring-boot:run


API disponible en:

http://localhost:8080/productos

📝 Jose Francisco Morales Mejorada 

Proyecto desarrollado como práctica de aprendizaje utilizando Java 17, Angular 17, Spring Boot 4 y MySQL.

*Se adjuntan pruebas y documentación de APIs REST

{
	"info": {
		"_postman_id": "cb8f68cc-50be-40b2-884b-10c2d975bf67",
		"name": "My Collection",
		"description": "### Welcome to Postman! This is your first collection. \n\nCollections are your starting point for building and testing APIs. You can use this one to:\n\n• Group related requests\n• Test your API in real-world scenarios\n• Document and share your requests\n\nUpdate the name and overview whenever you’re ready to make it yours.\n\n[Learn more about Postman Collections.](https://learning.postman.com/docs/collections/collections-overview/)",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "50500513",
		"_collection_link": "https://jose-morales-20cb0230-3364330.postman.co/workspace/145cb2d9-3818-4c9b-802a-d5234eab4e83/collection/50500513-cb8f68cc-50be-40b2-884b-10c2d975bf67?action=share&source=collection_link&creator=50500513"
	},
	"item": [
		{
			"name": "crear producto",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Status code is 200\", function () {",
							"    pm.response.to.have.status(200);",
							"});"
						],
						"type": "text/javascript",
						"packages": {},
						"requests": {}
					}
				},
				{
					"listen": "prerequest",
					"script": {
						"exec": [
							""
						],
						"type": "text/javascript",
						"packages": {},
						"requests": {}
					}
				}
			],
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n  \"nombre\": \"Iphone 15\",\r\n  \"marca\": \"Marca APPLE\",\r\n  \"categoria\": \"Celulares\",\r\n  \"precio\": 15000.0,\r\n  \"existencias\": 20,\r\n  \"activo\": true\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8080/productos",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"productos"
					]
				},
				"description": "This is a GET request and it is used to \"get\" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).\n\nA successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data."
			},
			"response": []
		},
		{
			"name": "Actualizar producto",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Successful POST request\", function () {",
							"    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
							"});",
							""
						],
						"type": "text/javascript",
						"packages": {},
						"requests": {}
					}
				}
			],
			"request": {
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"nombre\": \"Iphone 15 PRO MAX\",\n  \"marca\": \"Marca Y\",\n  \"categoria\": \"Categoría 2\",\n  \"precio\": 180.0,\n  \"existencias\": 25,\n  \"activo\": true\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8080/productos/{{producto_id}}",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"productos",
						"{{producto_id}}"
					]
				},
				"description": "This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.\n\nA successful POST request typically returns a `200 OK` or `201 Created` response code."
			},
			"response": []
		},
		{
			"name": "activar/desactivar",
			"request": {
				"method": "PATCH",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n  \"activo\": false\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8080/productos/{{producto_id}}/activar",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"productos",
						"{{producto_id}}",
						"activar"
					]
				}
			},
			"response": []
		},
		{
			"name": "ajustar inventario",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8080/productos/1/ajustar?cantidad=10",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"productos",
						"1",
						"ajustar"
					],
					"query": [
						{
							"key": "cantidad",
							"value": "10"
						}
					]
				}
			},
			"response": []
		},
		{
			"name": "Detalle del producto",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8080/productos/{{producto_id}}",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"productos",
						"{{producto_id}}"
					]
				}
			},
			"response": []
		},
		{
			"name": "listar con paginación",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:8080/productos?page=0&size=5",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "8080",
					"path": [
						"productos"
					],
					"query": [
						{
							"key": "page",
							"value": "0"
						},
						{
							"key": "size",
							"value": "5"
						}
					]
				}
			},
			"response": []
		}
	]
}

*Prueba SonarQube
Se realizo la prueba en SonarQube con resultados positivos y los esperados.
comparto evidencia: ![prueba](image-1.png)